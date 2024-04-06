import Back from "@/src/Icons/back";
import Close from "@/src/Icons/close";
import Drag from "@/src/Icons/drag";
import Layer from "@/src/Icons/layer";
import Reg from "@/src/Icons/reg";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataRelations, UpdateRelations } from "@/src/libs/api";
import { useEffect, useState } from "react";

export default function DragAndDrop({ setCreate,fetchRelations }) {
  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [draggedSensors, setDraggedSensors] = useState([]);
  const [draggedActuators, setDraggedActuators] = useState([]);
  const [sensorItems, setSensorItems] = useState([]);
  const [actuatorsItems, setActuatorsItems] = useState([]);
  const { authTokens } = useMainContext();

  useEffect(() => {
    async function fetchInstruments() {
      const data = await DataRelations(authTokens.empresa);
      setSensorItems(data.sensors);
      setActuatorsItems(data.actuators);
    }

    fetchInstruments();
  }, [authTokens]);

  const handleSensorItemClick = (clickedItem) => {
    setSensorItems((prevItems) =>
      prevItems.filter((item) => item._id !== clickedItem._id)
    );
    setDraggedSensors((prevDraggedSensors) => [
      ...prevDraggedSensors,
      {
        ...clickedItem,
        mining: clickedItem.controllerId.mining.name,
        ubication: clickedItem.controllerId.ubication,
      },
    ]);
  };

  const handleActuatorItemClick = (clickedItem) => {
    setActuatorsItems((prevItems) =>
      prevItems.filter((item) => item._id !== clickedItem._id)
    );
    setDraggedActuators((prevDraggedActuators) => [
      ...prevDraggedActuators,
      {
        ...clickedItem,
        mining: clickedItem.controllerId.mining.name,
        ubication: clickedItem.controllerId.ubication,
      },
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
    const dataToSend = {
      sensors: draggedSensors.map((item) => item._id),
      actuators: draggedActuators.map((item) => item._id),
    };

    try {
      setButtonClicked(true);
      const data = await UpdateRelations(dataToSend);
      console.log(data)
       if (data.status === true) {
        fetchRelations();
        setSuccess(true);
        setTimeout(() => {
          setCreate(false);
        }, 3000);
       }
    } finally {
      
    }
  };

  return (
    <div className="modalCreate-backg">
      <form className="mCreate-content mC-Drag" style={{
          userSelect: buttonClicked ? "none" : "auto",
          pointerEvents: buttonClicked ? "none" : "auto",
        }}>
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
            <Close />
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
                      <div className="item-l-icon">
                        <Drag />
                      </div>
                      <div className="item-l-content">
                        <div className="item-l-detall">
                          <span>{item.name}</span>
                          <h5>{item.controllerId.mining.name}</h5>
                        </div>
                        <h6>{item.controllerId.ubication}</h6>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="c-drag-items">
                  {draggedSensors.map((item) => (
                    <div key={item._id} className="d-item-list">
                      <div className="item-l-icon">
                        <Drag />
                      </div>
                      <div className="item-l-content">
                        <div className="item-l-detall">
                          <span>{item.name}</span>
                          <h5>{item.mining}</h5>
                        </div>
                        <h6>{item.ubication}</h6>
                      </div>
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
                      <div className="item-l-icon">
                        <Drag />
                      </div>
                      <div className="item-l-content">
                        <div className="item-l-detall">
                          <span>{item.name}</span>
                          <h5>{item.controllerId.mining.name}</h5>
                        </div>
                        <h6>{item.controllerId.ubication}</h6>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="c-drag-items">
                  {draggedActuators.map((item) => (
                    <div key={item._id} className="d-item-list">
                      <div className="item-l-icon">
                        <Drag />
                      </div>
                      <div className="item-l-content">
                        <div className="item-l-detall">
                          <span>{item.name}</span>
                          <h5>{item.mining}</h5>
                        </div>
                        <h6>{item.ubication}</h6>
                      </div>

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
             className={`btn-acept${
              buttonClicked && !success ? " sending" : ""
            }${success ? " success" : ""}`}
            type="button"
            onClick={() => handleCreateUser()}
          >
            {buttonClicked && !success ? (
              <>
                <span className="loader"></span>Enviando...
              </>
            ) : success ? (
              <>
                <div className="checkbox-wrapper">
                  <svg viewBox="0 0 35.6 35.6">
                    <circle
                      className="stroke"
                      cx="17.8"
                      cy="17.8"
                      r="14.37"
                    ></circle>
                    <polyline
                      className="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
                Proceso exitoso
              </>
            ) : (
              "Aceptar"
            )}
            
          </button>
        </div>
      </form>
    </div>
  );
}
