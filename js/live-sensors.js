// Definición de las 4 categorías de alerta
const ALERT_LEVELS = [
  { class: "alert-normal", status: "Normal", min: 20, max: 50 },
  { class: "alert-minima", status: "Mínima", min: 51, max: 65 },
  { class: "alert-naranja", status: "Naranja", min: 66, max: 80 },
  { class: "alert-roja", status: "Roja", min: 81, max: 95 },
];

// Función para obtener un valor aleatorio dentro del rango de alerta
function getRandomLevel() {
  return ALERT_LEVELS[Math.floor(Math.random() * ALERT_LEVELS.length)];
}

// 1. Piezómetros (Presión de Agua) - 4 sensores
function generatePiezoValue(level) {
  const value =
    Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
  return { value: `${value}%`, status: level.status, category: level.class };
}

// 2. Humedad TDR (Saturación) y Lluvia (3 sensores)
function generateHumedadValue(level) {
  const value =
    Math.floor(Math.random() * (level.max - level.min + 1)) + level.min;
  return { value: `${value}%`, status: level.status, category: level.class };
}

function generateLluviaValue(level) {
  // Rango de 5.0 a 35.0 mm/hr
  const value = (Math.random() * (35 - 5) + 5).toFixed(1);
  return {
    value: `${value} mm/hr`,
    status: level.status,
    category: level.class,
  };
}

// 3. Inclinómetros (Movimiento, 3 sensores)
function generateInclinometroValue(level) {
  // Rango de 0.0 a 1.2 mm/día
  const value = (Math.random() * (1.2 - 0.0) + 0.0).toFixed(1);
  return {
    value: `${value} mm/día`,
    status: level.status,
    category: level.class,
  };
}

// Mapeo de IDs de sensor a su función de generación, prefijo de texto y tipo (para lluvia)
const SENSOR_MAP = [
  {
    id: "sensor-1",
    generator: generatePiezoValue,
    text: "Presión",
    name: "Piezómetro P-01",
  },
  {
    id: "sensor-2",
    generator: generatePiezoValue,
    text: "Presión",
    name: "Piezómetro P-02",
  },
  {
    id: "sensor-3",
    generator: generatePiezoValue,
    text: "Presión",
    name: "Piezómetro P-03",
  },
  {
    id: "sensor-4",
    generator: generatePiezoValue,
    text: "Presión",
    name: "Piezómetro P-04",
  },

  {
    id: "sensor-5",
    generator: generateHumedadValue,
    text: "Saturación",
    name: "Humedad TDR H-01",
  },
  {
    id: "sensor-6",
    generator: generateLluviaValue,
    text: "Intensidad",
    textPrefix: "Intensidad",
    name: "Pluviómetro P-01",
  }, // Pluviómetro usa un prefijo de texto distinto
  {
    id: "sensor-7",
    generator: generateHumedadValue,
    text: "Saturación",
    name: "Humedad TDR H-02",
  },

  {
    id: "sensor-8",
    generator: generateInclinometroValue,
    text: "Movimiento",
    name: "Inclinómetro I-01",
  },
  {
    id: "sensor-9",
    generator: generateInclinometroValue,
    text: "Movimiento",
    name: "Inclinómetro I-02",
  },
  {
    id: "sensor-10",
    generator: generateInclinometroValue,
    text: "Movimiento",
    name: "Inclinómetro I-03",
  },
];

function updateSensors() {
  // 1. Actualizar el tiempo
  const now = new Date();
  const timeString = `${now.getDate().toString().padStart(2, "0")}/${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${now.getFullYear()}, ${now
    .getHours()
    .toString()
    .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
    .getSeconds()
    .toString()
    .padStart(2, "0")} HORA COL`;
  document.getElementById(
    "time-update"
  ).textContent = `Última Actualización del Sistema de Alerta Temprana: ${timeString}`;

  // 2. Actualizar los datos de cada sensor
  SENSOR_MAP.forEach((sensor) => {
    const randomLevel = getRandomLevel();
    const data = sensor.generator(randomLevel);

    const card = document.getElementById(sensor.id);
    if (!card) return; // Si el ID no existe, saltar

    const valueElement = card.querySelector(".value");
    const statusElement = card.querySelector(".status");

    // Determina el prefijo correcto (e.g., 'Presión' vs 'Intensidad')
    const prefix = sensor.textPrefix || sensor.text;

    // Actualiza el valor del sensor
    valueElement.textContent = `${prefix}: ${data.value}`;

    // Actualiza el estado de alerta
    statusElement.textContent = `Alerta: ${data.status}`;

    // Actualiza las clases CSS para el borde y el color del título
    card.className = card.className
      .split(" ")
      .filter((c) => !c.startsWith("alert-"))
      .join(" ");
    card.classList.add(data.category);
  });
}

// Ejecuta la función inmediatamente y luego cada 5 segundos
window.onload = function () {
  updateSensors();
  setInterval(updateSensors, 5000);
};
