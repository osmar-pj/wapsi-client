import React from "react";
import IconLed from "@/src/IconsMap/IconLed";
import IconSensor from "@/src/IconsMap/IconSensor";
import IconVentilator from "@/src/IconsMap/IconVentilator";

const iconComponentMap = {
  monitor: IconSensor,
  ventilador: IconVentilator,
  "3led": IconLed,
};

const CustomMarker = ({ sensorData, handleOnClick, index }) => {
  const handleClick = () => {
    handleOnClick(sensorData);
  };

  const getBackgroundColor = (groups) => {
    const priorityCategories = ["danger", "warning", "success"];

    for (const category of priorityCategories) {
      const group = groups.find((group) => group.category === category);
      if (group) {
        return group.color;
      }
    }

    return "#9C9C9C";
  };

  const getSeed = (groups) => {
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
        } if (value <= 0) {
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

    return null; // Si no se encuentra ningún grupo actuator con señal analógica o digital
  };

  const speed = getSeed(sensorData.groups) || 0;
  const IconComponent = iconComponentMap[sensorData.img];
  const backgroundColor = getBackgroundColor(sensorData.groups) || "#9C9C9C";


  console.log("valor:",speed);

  return (
    <div
      onClick={handleClick}
      className={`Map-info ${index % 2 === 0 ? "M-blue" : "M-orange"}`}
      key={sensorData._id}
    >
      {IconComponent && <IconComponent color={backgroundColor} speed={speed} />}
      <div className="M-i-content">
        <div className="content-text">
          <h2>{sensorData.ubication}</h2>
        </div>
      </div>
    </div>
  );
};

export default CustomMarker;
