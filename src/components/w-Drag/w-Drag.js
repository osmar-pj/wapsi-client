import Back from "@/src/Icons/back";
import Drag from "@/src/Icons/draj";
import Layer from "@/src/Icons/layer";
import Reg from "@/src/Icons/reg";
import { useEffect, useState } from "react";

export default function DragAndDrop({ setCreate }) {
  const [draggedSensors, setDraggedSensors] = useState([]);
  const [draggedActuators, setDraggedActuators] = useState([]);
  const [sensorItems, setSensorItems] = useState([]);
  const [actuatorsItems, setActuatorsItems] = useState([]);

  useEffect(() => {
    const fetchWapsi = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/api/v1/relation`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSensorItems(data.sensors);
          setActuatorsItems(data.actuators);
        } else {
          console.error("Error al obtener datos");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchWapsi();
  }, []);

  const handleSensorItemClick = (clickedItem) => {
    setSensorItems((prevItems) =>
      prevItems.filter((item) => item._id !== clickedItem._id)
    );
    setDraggedSensors((prevDraggedSensors) => [
      ...prevDraggedSensors,
      { _id: clickedItem._id, name: clickedItem.name },
    ]);
  };

  const handleActuatorItemClick = (clickedItem) => {
    setActuatorsItems((prevItems) =>
      prevItems.filter((item) => item._id !== clickedItem._id)
    );
    setDraggedActuators((prevDraggedActuators) => [
      ...prevDraggedActuators,
      { _id: clickedItem._id, name: clickedItem.name },
    ]);
  };

  const handleRemoveSensorItemClick = (clickedItem) => {
    setDraggedSensors((prevDraggedSensors) =>
      prevDraggedSensors.filter((item) => item._id !== clickedItem._id)
    );
    setSensorItems((prevItems) => [...prevItems, clickedItem]);
  };

  const handleRemoveActuatorItemClick = (clickedItem) => {
    setDraggedActuators((prevDraggedActuators) =>
      prevDraggedActuators.filter((item) => item._id !== clickedItem._id)
    );
    setActuatorsItems((prevItems) => [...prevItems, clickedItem]);
  };

  const handleCreateUser = async () => {
    try {
      const dataToSend = {
        sensors: draggedSensors.map((item) => item._id),
        actuators: draggedActuators.map((item) => item._id),
      };

      console.log(dataToSend);
      const response = await fetch(`${process.env.API_URL}/api/v1/relation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCreate(false)
        fetchData();
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

 
  return (
    <div className="modalCreate-backg">
      <form className="mCreate-content mC-Drag">
        <div className="mC-c-header">
          <div className="mC-h-title">
            <div className="mC-c-title-icon">
              <Reg />
            </div>
            <div className="mC-c-title-text">
              <h3>Relacionar </h3>
              <h4>Selecionar los valores que desea relacionar</h4>
            </div>
          </div>
          <span
            onClick={() => setCreate(false)}
            className="mC-h-close"
            type="button"
          >
            <img src="../assets/img/i-close.svg" alt="" />
          </span>
        </div>
        <div className="mC-c-body">
          <div className="Home-Drag">
            <div className="content-drag">
              <div className="c-drag-title">
                <div className="c-d-icon">
                  <Layer />
                </div>
                <span>Lista de Sensores</span>
              </div>
              <div className="container-drag">
                <div className="c-drag-items">
                  {sensorItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSensorItemClick(item)}
                      className="d-item-list"
                    >
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="c-drag-items">
                  {draggedSensors.map((item) => (
                    <div key={item._id} className="d-item-list">
                      <span>{item.name}</span>
                      <button onClick={() => handleRemoveSensorItemClick(item)}>
                        <Back />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="content-drag">
              <div className="c-drag-title">
                <div className="c-d-icon">
                  <Layer />
                </div>
                <span>Lista de Actuadores</span>
              </div>
              <div className="container-drag">
                <div className="c-drag-items">
                  {actuatorsItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleActuatorItemClick(item)}
                      className="d-item-list"
                    >
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
                <div className="c-drag-items">
                  {draggedActuators.map((item) => (
                    <div key={item._id} className="d-item-list">
                      <span>{item.name}</span>
                      <button
                        onClick={() => handleRemoveActuatorItemClick(item)}
                      >
                        <Back />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mC-c-footer">
          <button
            className="btn-cancel"
            type="button"
            onClick={() => setCreate(false)}
          >
            Cancelar
          </button>
          <button
            className="btn-acept"
            type="button"
            onClick={() => handleCreateUser()}
          >
            Aceptar
          </button>
        </div>
      </form>
    </div>
  );
}
