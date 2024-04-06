import NotConect from "@/src/Icons/notConect";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataInstruments } from "@/src/libs/api";
import { formatRelativeTime, isDataUpdated } from "@/src/libs/utils";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { io } from "socket.io-client";

export default function Notification() {
  const [instruments, setInstruments] = useState([]);
  const { authTokens } = useMainContext();

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const data = await DataInstruments(authTokens.empresa);
        if (data) {
          setInstruments(data);
        } else {
          console.error("Error.");
        }
      } catch (error) {
        console.error("Error :", error);
      }
    }
    fetchInstruments();
  }, [authTokens]);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const controller$ = new Subject();

    socket.on(`${authTokens?.empresa.toUpperCase()}`, (data) => {
      // console.log(data.name, data.value);
      controller$.next(data);
    });

    const subscription = controller$.subscribe((updatedData) => {
      setInstruments((prevInstruments) => {
        const updatedInstruments = prevInstruments.map((instrument) => {
          if (instrument._id === updatedData._id) {
            return { ...instrument, ...updatedData };
          }
          return instrument;
        });
        return updatedInstruments;
      });
    });

    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [authTokens]);

  return (
    <div className="w-notify">
      {instruments.length > 0
        ? instruments.map((device, index) => {
            return (
              <div key={device._id}>
                {isDataUpdated(device.updatedAt) ? (
                  <div
                    key={index}
                    className={`notify-item c-${
                      device.alarm && device.alarm.category
                    }`}
                  >
                    {/* <Circle /> */}
                    <p>{device.name}</p>
                    <h3>{device.value.toFixed(2)}</h3>
                    {/* <span>{device.und}</span> */}
                    <div className="n-i-ubi">
                      <font>{device.ubication}</font>
                    </div>
                  </div>
                ) : (
                  <div className="sensor-withC">
                    <div className="s-w-content">
                      <NotConect />
                      <h4>
                        <strong>{device.name}</strong>
                      </h4>
                    </div>
                    <font>{formatRelativeTime(device.updatedAt)}</font>
                    <div className="s-w-ubi">
                      <p>{device.ubication}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        : null}
    </div>
  );
}
