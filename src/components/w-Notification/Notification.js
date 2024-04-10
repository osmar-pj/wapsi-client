import { useMainContext } from "@/src/contexts/Main-context";
import { DataInstruments } from "@/src/libs/api";
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
      controller$.next(data);
    });

    const subscription = controller$.subscribe((updatedData) => {
      if (updatedData && updatedData._id) {
        setInstruments((prevInstruments) => {
          const updatedInstruments = prevInstruments.map((instrument) => {
            if (instrument._id === updatedData._id) {
              return { ...instrument, ...updatedData };
            }
            return instrument;
          });
          return updatedInstruments;
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [authTokens]);

  return (
    <div className="w-notify">
      {instruments
        .filter((device) => device.type !== "actuator") 
        .map((device, index) => (
          <div
            key={device._id}
            className={`notify-item c-${device.alarm && device.alarm.category}`}
          >
            <p>{device.name}</p>
            <h3>{device.value.toFixed(2)}</h3>
            <div className="n-i-ubi">
              <font>{device.ubication}</font>
            </div>
          </div>
        ))}
    </div>
  );
}
