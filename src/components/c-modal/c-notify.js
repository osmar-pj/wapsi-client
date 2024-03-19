import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import Close from "@/src/Icons/close";
import Circle from "@/src/Icons/circle";

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
    const fetchInstrumensts = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/v1/instrument`
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

    fetchInstrumensts();
  }, []);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const controller$ = new Subject();

    socket.on(`${empresa.toUpperCase()}`, (data) => {
      controller$.next(data);
    });

    const subscription = controller$.subscribe((updatedData) => {
      setInstruments((prevControllers) => {
        return prevControllers.map((controller) => {
          if (controller._id === updatedData._id) {
            return { ...controller, ...updatedData };
          }
          return controller;
        });
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
              <div
                key={device.name}
                className={`circle-item c-${
                  device.alarm && device.alarm.category
                }`}
              >
                <Circle />
                <p>{device.name}</p>
                {device.value !== undefined ? (
                  <>
                    <h3>{device.value.toFixed(2)}</h3>
                    <span>{device.und}</span>
                  </>
                ) : (
                  <p>Valor no disponible</p>
                )}
                <p>{device.ubication}</p>
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
