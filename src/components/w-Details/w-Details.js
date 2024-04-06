import { useMainContext } from "@/src/contexts/Main-context";
import { useRef } from "react";
import Sensor from "../w-Sensor/w-Sensor";

const Details = ({ selectedSensorId }) => {
  const { menuOpen, setMenuOpen } = useMainContext();
  const ref = useRef(null);

  if (!selectedSensorId) {
    return null;
  }

  return (
    <div className="w-Details">
      <div className="Details-header">
        <h2>
          {selectedSensorId.ubication} <small>/Ubicación</small>
        </h2>
      </div>
      <div className="Details-close">
        <span onClick={() => setMenuOpen(!menuOpen)}>&times;</span>
      </div>
      <div className="Details-body" ref={ref}>
        <Sensor className="text-1" selectedSensorId={selectedSensorId} />
      </div>
    </div>
  );
};

export default Details;
