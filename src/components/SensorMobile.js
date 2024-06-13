import { useMainContext } from "../contexts/Main-context";
import React, { useState, useEffect } from "react";
import { formatRelativeTime, renderNameWithSubscript } from "../libs/utils";
import Circle from "../Icons/circle";
import NotConect from "../Icons/notConect";

export default function SensorsMobile() {
  const { instruments } = useMainContext();
  const [verifyTime, setVerifyTime] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();

      // Calcula la diferencia de tiempo para cada grupo individual
      const updatedTimes = {};

      instruments.forEach((instrument) => {
        if (instrument.groups) {
          instrument.groups.forEach((group) => {
            const updatedTime = new Date(group.updatedAt);
            const differenceInSeconds = (currentTime - updatedTime) / 1000;
            updatedTimes[group.name] = differenceInSeconds > 15;
          });
        }
      });

      // Actualiza el estado con los resultados
      setVerifyTime(updatedTimes);
    }, 1000); // Se ejecuta cada segundo

    return () => clearInterval(interval);
  }, [instruments]);

  return (
    <div className="Content-Mobile">
      {instruments.map((instrument, index) => (
        <div className="w-Details-mobile" key={index}>
          <div className="Details-header">
            <h2>
              {instrument.name} 
            </h2>
            <small>/{instrument.ubication}</small>
          </div>
     
          <div className="Details-body">
            <div className="Details-content">
              <div className="Sensor-circle">
                {instrument.groups &&
                  instrument.groups.map((group) => (
                    <React.Fragment key={group.name}>
                      {verifyTime[group.name] ? (
                        <div className="sensor-withC">
                          <div className="s-w-content">
                            <NotConect />
                            <h4>
                              <strong>{group.name}</strong>
                            </h4>
                          </div>
                          <font>{formatRelativeTime(group.updatedAt)} </font>
                        </div>
                      ) : (
                        <div
                          className={`circle-item se-${
                            group.alarm && group.alarm.category
                          }`}
                        >
                          <Circle />
                          <p>{renderNameWithSubscript(group.name)}</p>
                          <h3>{group.value.toFixed(2)}</h3>
                          <span>{group.measure}</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
