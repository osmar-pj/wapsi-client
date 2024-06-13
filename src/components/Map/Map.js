import { useMainContext } from "@/src/contexts/Main-context";
import ImageMarker from "react-image-marker";
import { ImageMap } from "./ImageMap";
import Marker from "./Marker";
import { useState, useEffect } from "react";
import SensorsMobile from "../SensorMobile";

export default function Map() {
  const machineImage = ImageMap();
  const [isLoading, setIsLoading] = useState(true);

  const { instruments } = useMainContext();

  useEffect(() => {
    setIsLoading(true);
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = machineImage;
  }, [machineImage]);

  return (
    <div className="Home-image">
      {isLoading ? (
        <>
          <span className="loader"></span>
        </>
      ) : (
        <>
          <div className="Map-content">
            <ImageMarker
              src={machineImage}
              markers={instruments?.map((sensorData, index) => ({
                top: parseInt(sensorData.instrumentPosition.x),
                left: parseInt(sensorData.instrumentPosition.y),
                sensorData: sensorData,
                index,
              }))}
              markerComponent={Marker}
            />
          </div>
          <SensorsMobile />
        </>
      )}
    </div>
  );
}
