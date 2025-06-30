
# Análisis Teórico de Parámetros en Enlaces Satelitales

Este documento describe la fundamentación teórica de los cálculos realizados para estimar el desempeño de un enlace de comunicaciones satelitales entre dos estaciones terrestres y un satélite geoestacionario, aplicando principios de geometría esférica, teoría de antenas y propagación electromagnética.

---

## 1. Cálculo Geométrico Estación-Satélite (`calculateGeoParams`)

### **Objetivo:**  
Determinar los parámetros geométricos clave del enlace: *azimut*, *elevación* y *distancia* desde una estación terrestre al satélite geoestacionario.

### **Parámetros calculados:**

- **Elevación (°):**  
  Ángulo vertical entre el horizonte local y la línea visual hacia el satélite.

- **Azimut (°):**  
  Dirección angular desde el norte geográfico hacia la posición del satélite en el plano horizontal.

- **Rango (km):**  
  Distancia en línea recta entre la estación terrestre y el satélite.

### **Supuestos:**
- El satélite se encuentra en una órbita geoestacionaria (longitud fija sobre el ecuador).
- Se utiliza trigonometría esférica para estimar los ángulos.

---

## 2. Pérdida por Espacio Libre (Free Space Loss - `calculateFSL`)

### **Objetivo:**  
Modelar la atenuación inherente al medio libre de propagación electromagnética entre transmisor y receptor.

### **Ecuación utilizada:**
```math
L_{\text{fs}}(dB) = 20 \log_{10}(R) + 20 \log_{10}(f) + 92.45
```

- \( R \): Distancia en km.  
- \( f \): Frecuencia en GHz.  
- 92.45: Constante que incluye la conversión de unidades (frecuencia en GHz y distancia en km).

---

## 3. Ganancia de Antena Parabólica (`calculateAntennaGain`)

### **Objetivo:**  
Calcular la ganancia direccional de una antena parabólica en función de su tamaño, eficiencia y frecuencia de operación.

### **Modelo utilizado:**
```math
G = \eta \left( \frac{\pi D}{\lambda} \right)^2
```

- \( \eta \): Eficiencia de la antena (0 < η ≤ 1).  
- \( D \): Diámetro de la antena (m).  
- \( \lambda \): Longitud de onda en metros, \( \lambda = \frac{c}{f} \).  
- \( c \): Velocidad de la luz (m/s).  
- Ganancia en dBi: \( G_{\text{dBi}} = 10 \log_{10}(G) \).

---

## 4. Figura de Mérito G/T (`calculateGT`)

### **Objetivo:**  
Estimar el parámetro de desempeño de recepción *G/T*, que combina la ganancia de la antena receptora y la temperatura de ruido del sistema.

### **Ecuación:**
```math
G/T (dB/K) = G_{\text{dBi}} - 10 \log_{10}(T_s)
```

- \( T_s \): Temperatura de ruido del sistema en kelvin (K).

---

## 5. Relación Portadora a Densidad de Ruido (C/N₀) (`calculateCNo`)

### **Objetivo:**  
Evaluar la calidad del enlace en función de la potencia recibida respecto al ruido térmico.

### **Ecuación:**
```math
C/N_0 = \text{EIRP} - L_{\text{fs}} + G/T - k
```

- **EIRP (dBW):**  
  Potencia isotrópica radiada equivalente:

  ```math
  \text{EIRP} = 10 \log_{10}(P_{\text{tx}}) + G_{\text{tx}}
  ```

- \( L_{\text{fs}} \): Pérdida por espacio libre (dB).  
- \( G/T \): Figura de mérito del receptor (dB/K).  
- \( k \): Constante de Boltzmann = –228.6 dBW/K/Hz.

---

## 6. Pérdidas por Error de Apuntamiento (`calculatePointingLoss`)

### **Objetivo:**  
Modelar la degradación de ganancia efectiva debido al error angular en el direccionamiento de la antena.

### **Modelo simplificado:**
```math
L_p = 12 \left( \frac{\theta_e}{\theta_{3\text{dB}}} \right)^2
```

- \( \theta_e \): Error de apuntamiento en grados.  
- \( \theta_{3\text{dB}} \): Ancho de haz a –3 dB, estimado como:

  ```math
  \theta_{3\text{dB}} \approx \frac{70}{f \cdot D}
  ```

  donde \( f \) es la frecuencia en GHz y \( D \) el diámetro de la antena en metros.

---

## 7. Flujo de Cálculo General (`performCalculations`)

### **Etapas:**

1. Cálculo de geometría (azimut, elevación y rango) para Tx y Rx.
2. Cálculo de ganancias de antena transmisora y receptora.
3. Asignación de parámetros satelitales (ganancia, potencia, temperatura de ruido).
4. Estimación de pérdidas por espacio libre en ambos sentidos.
5. Evaluación de C/N₀ en uplink y downlink.
6. Estimación de pérdidas por errores de apuntamiento.

---

## 8. Referencias Bibliográficas

- Maral, G., & Bousquet, M. (2020). *Satellite Communications Systems: Systems, Techniques and Technology*. Wiley.
- Sklar, B. (2001). *Digital Communications: Fundamentals and Applications*. Prentice Hall.
- ITU-R P.525-4. *Calculation of Free-Space Attenuation*.

---