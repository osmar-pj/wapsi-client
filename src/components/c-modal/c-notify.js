import Circle from "@/src/Icons/circle";
import { formatRelativeTime, isDataUpdated } from "@/src/libs/utils";
import 'dayjs/locale/es';
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { io } from "socket.io-client";

export default function NotifyW() {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [instruments, setInstruments] = useState([]);

  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");

    if (userDataCookie) {
      const userData = JSON.parse(userDataCookie);
      setEmpresa(userData.empresa);
    }
  }, []);

  useEffect(() => {
    if (empresa) {
      const fetchInstrumensts = async (empresa) => {
        try {
          const response = await fetch(
            `${process.env.API_URL}/api/v1/instrument?empresa=${empresa}`
          );
          if (response.ok) {
            const data = await response.json();
            setInstruments(data);
          } else {
            console.error("Error al obtener datos");
          }
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      };

      fetchInstrumensts(empresa);
    }
  }, [empresa]);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const controller$ = new Subject();

    socket.on(`${empresa.toUpperCase()}`, (data) => {
      // console.log(data.name, data.value, data.updatedAt);
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
  }, [empresa]);

  const reproducirSonido = () => {
    const audio = new Audio("/music/sound.mp3");
    audio.play();
  };

  //   console.log(instruments);

 

  return (
    <div className="w-notify">
      <div className="Sensor-circle">
        {instruments.length > 0 ? (
          instruments.map((device, index) => {
            return (
              <div key={device._id}>
                {isDataUpdated(device.updatedAt) ? (
                  <div
                    key={index}
                    className={`circle-item c-${
                      device.alarm && device.alarm.category
                    }`}
                  >
                    <Circle />
                    <p>{device.name}</p>
                    {device.value !== undefined ? (
                      <div>
                        <h3>{device.value.toFixed(2)}</h3>
                        <span>{device.und}</span>
                      </div>
                    ) : (
                      <p>no disponible</p>
                    )}
                    <p>{device.ubication}</p>
                  </div>
                ) : (
                  <div>
                    <span key={device._id}>Sin conexión</span>
                    <span>{device.name}</span>
                    <p>{device.ubication}</p>
                    <p>{formatRelativeTime(device.updatedAt)}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Sin Datos</p>
        )}
      </div>
    </div>
  );
}
