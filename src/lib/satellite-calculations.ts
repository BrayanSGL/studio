'use client';

export interface CalculationInputs {
  satelliteLon: number;
  txLat: number;
  txLon: number;
  txAntennaDiameter: number;
  txAntennaEfficiency: number;
  txPower: number;
  txFreq: number;
  txPointingError: number;
  rxLat: number;
  rxLon: number;
  rxAntennaDiameter: number;
  rxAntennaEfficiency: number;
  rxSystemNoiseTemp: number;
  rxFreq: number;
  rxPointingError: number;
}

const EARTH_RADIUS = 6371; // km
const GEOSTATIONARY_ALTITUDE = 35786; // km

// Simplified geo calculations
export const calculateGeoParams = (stationLat: number, stationLon: number, satelliteLon: number) => {
  const stationLatRad = stationLat * (Math.PI / 180);
  const G_rad = (stationLon - satelliteLon) * (Math.PI / 180);

  const range = Math.sqrt(
    Math.pow(EARTH_RADIUS, 2) + 
    Math.pow(EARTH_RADIUS + GEOSTATIONARY_ALTITUDE, 2) - 
    2 * EARTH_RADIUS * (EARTH_RADIUS + GEOSTATIONARY_ALTITUDE) * Math.cos(stationLatRad) * Math.cos(G_rad)
  );
  
  const el_rad = Math.atan(
    ( (EARTH_RADIUS + GEOSTATIONARY_ALTITUDE) * Math.cos(stationLatRad) * Math.cos(G_rad) - EARTH_RADIUS ) / 
    ( (EARTH_RADIUS + GEOSTATIONARY_ALTITUDE) * Math.sin(stationLatRad) )
  );

  let az = Math.atan( Math.tan(Math.abs(G_rad)) / Math.sin(stationLatRad) ) * (180 / Math.PI);

  if (stationLat < 0) {
    az = G_rad > 0 ? 360 - az : 180 + az;
  } else {
    az = G_rad > 0 ? 180 - az : az;
  }
  
  return {
    azimuth: az.toFixed(2),
    elevation: (el_rad * (180 / Math.PI)).toFixed(2),
    range: range.toFixed(2),
  }
}

// Free Space Loss
const calculateFSL = (freqGHz: number, rangeKm: number) => {
  return (20 * Math.log10(rangeKm) + 20 * Math.log10(freqGHz) + 92.45).toFixed(2);
}

// Antenna Gain
const calculateAntennaGain = (diameter: number, freqGHz: number, efficiency: number) => {
  const c = 299792458; // m/s
  const lambda = c / (freqGHz * 1e9);
  const gain = (efficiency / 100) * Math.pow((Math.PI * diameter) / lambda, 2);
  return (10 * Math.log10(gain)).toFixed(2);
}


// Quality Factor G/T
const calculateGT = (antennaGain: number, systemNoiseTemp: number) => {
  return (antennaGain - 10 * Math.log10(systemNoiseTemp)).toFixed(2);
}

// C/N0
const calculateCNo = (txPower: number, txGain: number, fsl: number, rxGT: number) => {
  const eirp = 10 * Math.log10(txPower) + txGain; // EIRP in dBW
  const k = -228.6; // Boltzmann constant in dBW/K/Hz
  return (eirp - fsl + rxGT - k).toFixed(2);
}


// Pointing Loss
const calculatePointingLoss = (pointingErrorDegrees: number, antennaDiameter: number, frequencyGhz: number) => {
  // Simplified model, actual loss is more complex
  const beamwidth = 70 / (frequencyGhz * antennaDiameter); // Approx 3dB beamwidth
  return (12 * Math.pow(pointingErrorDegrees / beamwidth, 2)).toFixed(2);
}

export const performCalculations = (inputs: CalculationInputs) => {
  const txGeo = calculateGeoParams(inputs.txLat, inputs.txLon, inputs.satelliteLon);
  const rxGeo = calculateGeoParams(inputs.rxLat, inputs.rxLon, inputs.satelliteLon);

  const txAntennaGain = parseFloat(calculateAntennaGain(inputs.txAntennaDiameter, inputs.txFreq, inputs.txAntennaEfficiency));
  const rxAntennaGain = parseFloat(calculateAntennaGain(inputs.rxAntennaDiameter, inputs.rxFreq, inputs.rxAntennaEfficiency));
  
  // Placeholder values for satellite
  const satelliteRxAntennaGain = 35; // dBi
  const satelliteNoiseTemp = 500; // K
  const satelliteTxPower = 20; // W
  const satelliteTxAntennaGain = 35; // dBi

  const satelliteGT = parseFloat(calculateGT(satelliteRxAntennaGain, satelliteNoiseTemp));
  
  const uplinkFSL = parseFloat(calculateFSL(inputs.txFreq, parseFloat(txGeo.range)));
  const downlinkFSL = parseFloat(calculateFSL(inputs.rxFreq, parseFloat(rxGeo.range)));

  const uplinkCNo = calculateCNo(inputs.txPower, txAntennaGain, uplinkFSL, satelliteGT);
  const downlinkGT = parseFloat(calculateGT(rxAntennaGain, inputs.rxSystemNoiseTemp));
  const downlinkCNo = calculateCNo(satelliteTxPower, satelliteTxAntennaGain, downlinkFSL, downlinkGT);

  const uplinkPointingLoss = calculatePointingLoss(inputs.txPointingError, inputs.txAntennaDiameter, inputs.txFreq);
  const downlinkPointingLoss = calculatePointingLoss(inputs.rxPointingError, inputs.rxAntennaDiameter, inputs.rxFreq);

  return {
    tx: {
      ...txGeo,
      fsl: uplinkFSL.toFixed(2),
      gt: satelliteGT.toFixed(2),
      cno: uplinkCNo,
      pointingLoss: uplinkPointingLoss,
    },
    rx: {
      ...rxGeo,
      fsl: downlinkFSL.toFixed(2),
      gt: downlinkGT.toFixed(2),
      cno: downlinkCNo,
      pointingLoss: downlinkPointingLoss,
    }
  }
}
