import More from "@/src/Icons/more";
import Reg from "@/src/Icons/reg";
import { useEffect, useState } from "react";

export default function Notification({ sensorData }) {

  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/v1/notification?serie=${sensorData.serie}`
          );
          
          if (response.ok) {
            const jsonData = await response.json();
          
          setNotifications(jsonData);
        } else {
          console.error("Error en la petición");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchNotifications();
  }, [sensorData.serie]);

  return (
    <div className="Details-content text-2">
      <div className="Details-title">
        <div className="D-title-name">
          <div>
            <Reg />
          </div>
          <h4>Registro escalada |</h4>
          <h5>Notificaciones</h5>
        </div>
        <div className="D-title-more">
          <More />
        </div>
      </div>
      <div className="D-c-notification">
        <table>
          <thead>
            <tr>
              <th>Sensor</th>
              <th>Valor</th>
              <th>Nivel</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <>
                <tr>
                  <td>No hay datos</td>
                </tr>
              </>
            ) : (
              notifications                
                .map((notification, index) => (
                  <tr key={index}>
                    <td>{notification.name}</td>
                    <td>{notification.value}</td>
                    <td>
                      <p
                        className={`status ${
                          notification.msg === "ALERTA NIVEL MUY ALTO"
                            ? "status-MUY-ALTO"
                            : notification.msg === "ALERTA NIVEL ALTO"
                            ? "status-ALTO"
                            : notification.msg === "ALERTA NIVEL BAJO"
                            ? "status-BAJO"
                            : "OKEY"
                        }`}
                      >
                        {notification.msg}
                      </p>
                    </td>
                    <td>                     
                        {formatFecha(notification.createdAt) }
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatFecha(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const day = date.getDate();
  const monthIndex = date.getMonth();

  return ` ${day} ${monthNames[monthIndex]}, ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}