import Circle from "@/src/Icons/circle";
import NotConect from "@/src/Icons/notConect";
import { formatRelativeTime, renderNameWithSubscript } from "@/src/libs/utils";
import React, { useState, useEffect } from 'react';

export default function DetailsSensor({ sensorData }) {
  const [verifyTime, setVerifyTime] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();

      // Calcula la diferencia de tiempo para cada grupo individual
      const updatedTimes = {};
      sensorData.groups.forEach((group) => {
        const updatedTime = new Date(group.updatedAt);
        const differenceInSeconds = (currentTime - updatedTime) / 1000;
        updatedTimes[group.name] = differenceInSeconds > 15;
      });

      // Actualiza el estado con los resultados
      setVerifyTime(updatedTimes);
    }, 1000); // Se ejecuta cada segundo

    return () => clearInterval(interval);
  }, [sensorData]);

  return (
    <div className="Details-content">
      <div className="Sensor-circle">
        {sensorData &&
          sensorData.groups.map((group) => (
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
                  className={`circle-item se-${group.alarm &&
                    group.alarm.category}`}
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
  );
}
