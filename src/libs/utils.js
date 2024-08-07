import dayjs from "dayjs";
import "dayjs/locale/es";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("es");

export const isDataUpdated = (updatedAt) => {
  const now = dayjs();

  // Obtener la fecha de actualización del dispositivo (updatedAt)
  const updatedTime = dayjs(updatedAt);

  // Obtener la diferencia de tiempo en segundos
  const differenceInSeconds = now.diff(updatedTime, "second");

  // Definir el límite de tiempo en segundos (por ejemplo, 60 segundos = 1 minuto)
  const timeLimitInSeconds = 10;

  // Verificar si la diferencia de tiempo está dentro del límite
  return differenceInSeconds <= timeLimitInSeconds;
};

export const formatRelativeTime = (updatedAt) => {
  // Configura la localización en español
  dayjs.locale('es');

  // Obtiene el tiempo relativo desde la fecha proporcionada
  return dayjs(updatedAt).fromNow(true)  .replace("minuto", "min")
  .replace("minutos", "mins")
  .replace("segundos", "seg")
  .replace("horas", "hrs")
  .replace("unos segundos", "ahora")
  .replace("dias", "ds");
};

export function timeToLocal(originalTime) {
  const d = new Date(originalTime * 1000); // Crear un objeto Date a partir del tiempo en segundos
  return d.getTime(); // Devolver el tiempo local en milisegundos
}

export function formartTime(totalMinutos) {
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;
  const minutosFormateados = minutos.toFixed(0);
  const tiempoFormateado = `${horas}h ${minutosFormateados}min`;
  return tiempoFormateado;
}

export function getYesterdayMidnight() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Resta un día para obtener ayer
  yesterday.setHours(0, 0, 0, 0); // Establece las horas a medianoche
  return yesterday;
}

export function renderNameWithSubscript(name) {
  const number = name.match(/\d+/);
  if (number) {
    return [
      name.substring(0, number.index),
      <sub key={number[0]}>{number[0]}</sub>,
      name.substring(number.index + number[0].length),
    ];
  } else {
    return name;
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSeed(groups) {
  const priorityCategories = ["danger", "warning", "success"];

  for (const category of priorityCategories) {
    const analogGroup = groups.find(
      (group) =>
        group.category === category &&
        group.type === "actuator" &&
        group.signal === "analog"
    );
    const digitalGroup = groups.find(
      (group) =>
        group.category === category &&
        group.type === "actuator" &&
        group.signal === "digital"
    );

    if (analogGroup) {
      const value = analogGroup.value;
      if (value === 0) {
        return 0;
      }
      if (value <= 0) {
        return 0; // Si es negativo, devuelve 0.3
      } else if (value >= 100) {
        return 0.2; // Si es mayor o igual a 100, devuelve 5
      } else {
        // Mapea el valor al rango de 0.2 a 0.3
        return 1 - (value - 1) * 0.008;
      }
    }

    if (digitalGroup) {
      const value = digitalGroup.value;
      if (value === 0) {
        return 0;
      } else if (value === 1) {
        return 0.3;
      }
    }
  }

  return null;
};

export function getBackgroundColor (groups)  {

  const priorityCategories = ["danger", "warning", "success"];

  for (const category of priorityCategories) {
    const group = groups.find((group) => group.category === category);
    if (group) {
      return group.color;
    }
  }

  return "#9C9C9C";
};
