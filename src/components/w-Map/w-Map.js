import { useContext, useEffect, useState, useCallback } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import ImageMarker from "react-image-marker";
import Sensor from "@/src/Icons/Sensor";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import Loader from "@/src/Icons/loader";
import Details from "../w-Details/w-Details";
import MVentilador from "../w-ventil/w-venti";

const getMachineImage = () => {
  let empresa = "YUMPAG";

  if (typeof window !== "undefined") {
    empresa = localStorage.getItem("empresa");
    empresa = empresa ? empresa.toUpperCase() : null;

    if (empresa === "JULCANI") {
      return "/imgs/mapJulcani.svg";
    } else if (empresa === "YUMPAG") {
      return "/imgs/mapYumpag.svg";
    } else if (empresa === "HUARON") {
      return "/imgs/mapHuaron.svg";
    }
  }

  return "/imgs/mapJulcani.svg";
};

const CustomMarker = ({ sensorData, handleOnClick, index }) => {
  const handleClick = () => {
    handleOnClick(sensorData);
  };

  let iconSrc;
  if (sensorData.img === "monitor") {
    iconSrc = "/imgs/i-sensor.svg";
  } else if (sensorData.img === "ventilador") {
    iconSrc = "/imgs/i-ventilador.svg";
  }

  let backgroundColor;
  if (sensorData.groups && sensorData.groups.length > 0) {
    // Inicializar un objeto para mantener el recuento de colores
    const colorCount = {
      red: 0,
      yellow: 0,
      green: 0,
    };

    // Contar la ocurrencia de cada color en sensorData.groups
    sensorData.groups.forEach((group) => {
      if (group.alarm && group.alarm.category) {
        if (group.alarm.category === "danger") {
          colorCount.red++;
        } else if (group.alarm.category === "warning") {
          colorCount.yellow++;
        } else if (group.alarm.category === "success") {
          colorCount.green++;
        }
      }
    });

    // Establecer el color de fondo basado en la prioridad de los colores
    if (colorCount.red > 0) {
      backgroundColor = "red";
    } else if (colorCount.yellow > 0) {
      backgroundColor = "yellow";
    } else if (colorCount.green > 0) {
      backgroundColor = "green";
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`Map-info ${index % 2 === 0 ? "M-blue" : "M-orange"}`}
      key={sensorData._id}
    >
      <img src={iconSrc} />
      {/* <Sensor color={sensorData.color}/> */}
      <div className="cuadrado" style={{ backgroundColor }}></div>
      <div className="M-i-content">
        <div className="pulse"></div>
        <div className="content-text">
          <h2>{sensorData.ubication}</h2>
        </div>
      </div>
    </div>
  );
};

const MemoizedCustomMarker = CustomMarker;
const selectedSensorSubject = new BehaviorSubject(null);
export default function Mapa() {
  let empresa = "YUMPAG";
  const machineImage = getMachineImage();
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState(null);

  const contextData = useContext(MainContext);
  const { setMenuOpen, instruments } = contextData;
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [misControllers, setMisControllers] = useState([]);

  useEffect(() => {
    setMisControllers(instruments);
  }, [instruments]);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoading(false);
    };
    image.src = machineImage;
  }, []);

  useEffect(() => {
    const subscription = selectedSensorSubject
      .pipe(
        map((sensorData) => {
          if (sensorData) {
            return instruments.find((data) => data._id === sensorData._id);
          } else {
            return null;
          }
        })
      )
      .subscribe((sensorData) => {
        if (sensorData !== selectedSensor) {
          setSelectedSensor(sensorData);
          setModalType(sensorData && sensorData.img);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [instruments, selectedSensorSubject]);

  const handleMarkerClick = useCallback(
    (sensorData) => {
      setMenuOpen((prevMenuOpen) => !prevMenuOpen);
      selectedSensorSubject.next(sensorData);
    },

    [setMenuOpen]
  );

  return (
    <>
      <div className="Home-title">
        <h1>Unidad Minera {empresa.toUpperCase()}</h1>
        <span>Monitoreo de gases en tiempo real </span>
        <img src="imgs/warning.svg" className="img-warning" alt="" />
      </div>
      <div className="Home-image">
        {isLoading ? (
          <Loader className="loader" />
        ) : (
          <div className="Map-content">
            <ImageMarker
              src={machineImage}
              markers={
                (misControllers &&
                  misControllers.map((sensorData, index) => ({
                    top: parseInt(sensorData.position.x),
                    left: parseInt(sensorData.position.y),
                    sensorData: sensorData,
                    handleOnClick: handleMarkerClick,
                    index,
                  }))) ||
                []
              } // Asegura que markers sea un array incluso si misControllers es undefined
              markerComponent={MemoizedCustomMarker}
            />
          </div>
        )}
      </div>
      {/* {selectedSensor && <Details sensorData={selectedSensor} />} */}
      {modalType === "monitor" && <Details sensorData={selectedSensor} />}
      {modalType === "ventilador" && (
        <MVentilador sensorData={selectedSensor} />
      )}
    </>
  );
}
