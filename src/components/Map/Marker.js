import { useEffect, useState } from "react";
import IconLed from "@/src/IconsMap/IconLed";
import IconSensor from "@/src/IconsMap/IconSensor";
import IconVentilator from "@/src/IconsMap/IconVentilator";
import Details from "../Details/Details";
import { getBackgroundColor, getSeed } from "@/src/libs/utils";
import IconCaja from "@/src/IconsMap/IconCaja";

const iconComponentMap = {
  monitor: IconSensor,
  ventilador: IconVentilator,
  "3led": IconLed,
  caja: IconCaja,

};

const Marker = ({ sensorData, index }) => {
  // console.log("sen",sensorData);
  const [showInfo, setShowInfo] = useState(false);
  const [closeDisabled, setCloseDisabled] = useState(false);

  const handleClick = () => {
    setShowInfo(!showInfo);
  };

  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  const getModal = (groups) => {
    let foundAlert = false;

    for (const group of groups) {
      if (
        group.type === "sensor" &&
        (group.category === "warning" || group.category === "danger")
      ) {
        foundAlert = true;
        break;
      }
    }

    if (foundAlert) {
      return "encontre alerta";
    } else {
      const allSuccess = groups.every((group) => group.category === "success");
      if (allSuccess) {
        return "todos son success";
      } else {
        return "otro";
      }
    }
  };

  useEffect(() => {
    const modalType = getModal(sensorData.groups);
    if (modalType === "encontre alerta") {
      setShowInfo(true);
      setCloseDisabled(true);
    } else {
      setCloseDisabled(false);
    }
  }, [sensorData.groups]);

  const speed = getSeed(sensorData.groups) || 0;
  const IconComponent = iconComponentMap[sensorData.img];
  const backgroundColor = getBackgroundColor(sensorData.groups) || "#9C9C9C";



  return (
    <>
      <div
        onClick={handleClick}
        className="Map-info"
        key={sensorData._id}
      >
        {IconComponent && (
          <IconComponent color={backgroundColor} speed={speed} />
        )}
        <div className="M-i-content">
          <div className="content-text">
            <span>{sensorData.ubication}</span>
            <h2>{sensorData.name}</h2>
          </div>
        </div>
      </div>
      {showInfo && (
        <Details
          sensorData={sensorData}
          onClose={handleCloseInfo}
          closeDisabled={closeDisabled}
        />
      )}
    </>
  );
};

export default Marker;
