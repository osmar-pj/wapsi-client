import { useEffect, useState, useContext } from "react";
import Mapa from "@/src/components/w-Map/w-Map";
import Header from "@/src/components/c-header/c-header";
import { MainContext } from "@/src/contexts/Main-context";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import Circle from "../Icons/circle";
import Foot from "../components/c-footer/c-footer";

export default function ConexionSocket({ empresa, roles, categoria }) {
  const { controllers, setControllers } = useContext(MainContext);
  const controller$ = new Subject();

  useEffect(() => {
    const fetchController = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/v1/controller?empresa=${empresa}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setControllers(data.controllers);
        } else {
          console.error("Error al obtener datos:", response.statusText);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchController();
  }, [empresa, setControllers]);
  useEffect(() => {
    const socket = io(process.env.API_URL);
  
    socket.on(`${empresa.toUpperCase()}-${categoria}`, (data) => {
     
      
      const foundControlIndex = controllers.findIndex((d) => d.serie === data.serie);
      
      if (foundControlIndex !== -1) {
        const updatedController = { ...controllers[foundControlIndex] };
        const currentTime = new Date();
        const timeDifference =
          (currentTime - new Date(updatedController.updatedAt)) / 1000;
      
        if (data.devices.length > 0 || timeDifference >= 30) {
          updatedController.devices = data.devices;
          updatedController.updatedAt = data.updatedAt;

          const updatedControllers = [...controllers];
          updatedControllers[foundControlIndex] = updatedController;
          setControllers(updatedControllers);
          controller$.next(updatedController);
        }
      } else {
        console.log("No se encontró el dispositivo");
      }
    });
  
    return () => {
      socket.disconnect();
    };
  }, [controllers, empresa, categoria]);
  
  const renderNameWithSubscript = (name) => {
    const number = name.match(/\d+/);
    if (number) {
      return [
        name.substring(0, number.index), 
        <sub key={number[0]}>{number[0]}</sub>, 
        name.substring(number.index + number[0].length) 
      ];
    } else {
      return name;
    }
  };
  return (
    <>
      <Header roles={roles} />
      <section className="w-Home">
        <Mapa controllers={controllers} controller={controllers} empresa={empresa} />
        <div className="float-sensores">
          {controllers.map((i, index) => {
            return (
              <div
                className={`Float-content ${
                  index % 2 === 0 ? "D-blue" : "D-orange"
                }`}
                key={i._id}
              >
                <div className="Float-title">
                  <h2>{i.ubication}</h2>
                  <h3>/{i.level}</h3>
                  <div className="square"></div>
                </div>
                <div className="Sensor-circle">
                  {i.devices.map((device) => {
                    const { name, value, und, min, max1, max2 } = device;
                    return (
                      <div
                        key={name}
                        className={`circle-item ${
                          value < max1 && value > min
                            ? "green"
                            : value < min || value > max2
                            ? "red"
                            : "yellow"
                        }`}
                      >
                        <Circle />
                        <p>{renderNameWithSubscript(name)}</p>
                        <h3>{value.toFixed(2)}</h3>
                        <span>{und}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
      </section>
      <Foot />
    </>
  );
}
