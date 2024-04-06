import React, { useEffect, useState } from "react";
import Circle from "@/src/Icons/circle";
import Dat from "@/src/Icons/dat";
import { useMainContext } from "@/src/contexts/Main-context";
import { formatRelativeTime, renderNameWithSubscript } from "@/src/libs/utils";
import NotConect from "@/src/Icons/notConect";

const Sensor = ({ selectedSensorId }) => {
  const { instruments } = useMainContext();
  const [groupDataUpdated, setGroupDataUpdated] = useState({});

  const filteredInstrument =
    instruments.find((instrument) => instrument._id === selectedSensorId._id)
      ?.groups || [];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const updatedGroups = {};
      filteredInstrument.forEach((group) => {
        const lastUpdatedTime = new Date(group.updatedAt).getTime();
        const differenceInSeconds = (now - lastUpdatedTime) / 1000;
        updatedGroups[group._id] = differenceInSeconds <= 15;
      });
      setGroupDataUpdated(updatedGroups);
    }, 1000); // Ejecutar cada segundo
    console.log("ejecutnado")
    return () => clearInterval(interval);
  }, [filteredInstrument]);

  return (
    <div className="Details-content text-1">
      <div className="Details-title">
        <div className="D-title-name">
          <div>
            <Dat />
          </div>
          <h4>Análisis |</h4>
          <h5>Tiempo real</h5>
        </div>
        <div className="D-title-more"></div>
      </div>
      <div className="Sensor-circle">
        {filteredInstrument.map((i) => (
          <div key={i._id}>
            {groupDataUpdated[i._id] ? (
              <div
                key={i._id}
                className={`circle-item se-${i.alarm && i.alarm.category}`}
              >
                <Circle />
                <p>{renderNameWithSubscript(i.name)}</p>
                <h3>{i.value.toFixed(2)}</h3>
                <span>{i.und}</span>
              </div>
            ) : (
              <div key={i._id} className="sensor-withC">
                <div className="s-w-content">
                  <NotConect />
                  <h4>
                    <strong>{i.name}</strong>
                  </h4>
                </div>
                <font>{formatRelativeTime(i.updatedAt)}</font>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sensor;
