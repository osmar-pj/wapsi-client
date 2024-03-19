import { useEffect, useState, useContext } from "react";
import Mapa from "@/src/components/w-Map/w-Map";
import Header from "@/src/components/c-header/c-header";
import { MainContext } from "@/src/contexts/Main-context";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import Foot from "../components/c-footer/c-footer";

export default function ConexionSocket({ empresa, roles, categoria }) {
  const { controllers, setControllers } = useContext(MainContext);
  const controller$ = new Subject();

  useEffect(() => {
    const fetchController = async () => {
      try {
        const response = await fetch(
          `${process.env.API_URL}/api/v1/groupInstrument`,
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
          console.log(data);
          setControllers(data);
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
  
    socket.on(`${empresa.toUpperCase()}`, (data) => {
          console.log(data.value, data.name)
      const foundControlIndex = controllers.findIndex((d) => d._id === data._id);
      
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
  }, [controllers, empresa]);
  

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
       
      </section>
      <Foot />
    </>
  );
}
