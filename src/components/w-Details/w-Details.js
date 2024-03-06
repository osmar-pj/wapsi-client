import { useContext, useEffect, useRef } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import Notification from "../w-Notification/Notification";
import Sensor from "../w-Sensor/w-Sensor";
import Graphic from "../w-Graphic/w-Graphic";

const Details = ({ sensorData }) => {
  const { menuOpen, setMenuOpen } = useContext(MainContext);
  const ref = useRef(null);

  if (!sensorData) {
    return null;
  }

  useEffect(() => {
    if (!!menuOpen) {
      ref.current.scrollTo(0, 0);
    }
  }, [menuOpen]);

  return (
    <div className="w-Details">
      <div className="Details-Container">
        <svg className="svg" width="100%" height="100%">
          <rect
            className="rect"
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="1"
            ry="10"
          />
        </svg>
        <div className="cd"></div>
        <div className="cd2"></div>
        <div className="cd3"></div>
        <div className="cd4"></div>
        <div className="Details-header">
          <h2>{sensorData.ubication}</h2>
        </div>
        <div className="Details-close">
          <span onClick={() => setMenuOpen(!menuOpen)}>&times;</span>
        </div>
        <div className="Details-body" ref={ref}>
          <Sensor className="text-1" sensorData={sensorData} />
          <Notification className="text-2" sensorData={sensorData} />
          <Graphic className="text-3" sensorData={sensorData} />
        </div>
      </div>
    </div>
  );
};

export default Details;
