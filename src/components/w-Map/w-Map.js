import { MainContext } from "@/src/contexts/Main-context";
import { useCallback, useContext, useEffect, useState } from "react";
import ImageMarker from "react-image-marker";
import Details from "../w-Details/w-Details";
import MVentilador from "../w-ventil/w-venti";
import CustomMarker from "./w-CustomMaker";
import { ImageMap } from "./ImageMap";

export default function Mapa() {
  const machineImage = ImageMap();
  const [isLoading, setIsLoading] = useState(true);
  const contextData = useContext(MainContext);
  const { setMenuOpen, instruments } = contextData;
  const [selectedSensorId, setSelectedSensorId] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = machineImage;
  }, [machineImage]);
  
  useEffect(() => {}, [selectedSensorId]);

  const handleMarkerClick = useCallback(
    (sensorData) => {
      if (!modalType || selectedSensorId._id !== sensorData._id) {
        setSelectedSensorId(sensorData);
        setModalType(sensorData && sensorData.img);
        setMenuOpen(true); // Abrir el menú
      } else {
        setSelectedSensorId(null);
        setModalType(null);
        setMenuOpen(false); // Cerrar el menú
      }
    },
    [selectedSensorId, modalType, setMenuOpen]
  );

  return (
    <>
      <div className="Home-image">
        {isLoading ? (
          <>
            <span className="loader"></span>
          </>
        ) : (
          <div className="Map-content">
            <ImageMarker
              src={machineImage}
              markers={instruments?.map((sensorData, index) => ({
                top: parseInt(sensorData.position.x),
                left: parseInt(sensorData.position.y),
                sensorData: sensorData,
                handleOnClick: handleMarkerClick,
                index,
              }))}
              markerComponent={CustomMarker}
            />
          </div>
        )}
      </div>
      {modalType === "monitor" && (
        <Details selectedSensorId={selectedSensorId} />
      )}
      {modalType === "ventilador" && (
        <MVentilador selectedSensorId={selectedSensorId} />
      )}
    </>
  );
}
