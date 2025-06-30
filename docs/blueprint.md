# **App Name**: SatLink Analyzer

## Core Features:

- Transmitter Geo Calculation: Calculate and display the azimuth, elevation, and range from the transmitter ground station to the satellite.
- Receiver Geo Calculation: Calculate and display the azimuth, elevation, and range from the satellite to the receiver ground station.
- Free Space Path Loss Calculation: Calculate and display free space path loss for both the uplink (transmitter to satellite) and downlink (satellite to receiver).
- Rain Fade Prediction: Determine, based on entered values, if weather (Rain/Snow) will effect a specific connection and inform user, if necessary, of the required adjustments for that tool to correctly predict link performance.
- Quality Factor Calculation: Calculate and display the quality factor (G/T) for both the satellite and the receiver ground station.
- SNR Calculation: Calculate and display the signal-to-noise ratio (SNR) for both the uplink and downlink.
- Pointing Loss Calculation: Calculate and display the total power loss due to antenna pointing errors.

## Style Guidelines:

- Primary color: Dark Blue (#3F51B5) to represent space and technology, while providing a professional feel.
- Background color: Very light gray (#F5F5F5), for a clean and unobtrusive backdrop.
- Accent color: Orange (#FF9800), to highlight important values or interactive elements with good contrast.
- Font: 'Inter', a sans-serif font for clear readability and a modern, neutral look, suitable for both data display and interface elements.
- Use clear and universally understood icons to represent satellite links, ground stations, and signal metrics.
- Divide the UI into logical sections, each responsible for the configuration and calculation of individual factors within the link budget. A tab-based interface would work well.
- Provide a spinning satellite to serve as the loading indicator.