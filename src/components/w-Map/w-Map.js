import { useContext, useEffect, useState,useCallback } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import ImageMarker from "react-image-marker";
import { BehaviorSubject } from "rxjs";
import { map } from 'rxjs/operators';

import Loader from "@/src/Icons/loader";
import Details from "../w-Details/w-Details";

const getMachineImage = () => {
  let empresa = null;

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


  // Agregar un índice propio al sensorData
  return (
    <div
      onClick={handleClick}
      className={`Map-info ${index % 2 === 0 ? "M-blue" : "M-orange"}`}
      key={sensorData._id}
    >
      <img src="/imgs/icon.png" alt="" loading="lazy" />
      <div className="M-i-content">
        <div className="pulse"></div>
        <div className="content-text">
          <span>{sensorData.level}</span>
          <h2>{sensorData.ubication}</h2>
          <button> Ver Detalle</button>
        </div>
      </div>
    </div>
  );
};


const MemoizedCustomMarker = CustomMarker;
const selectedSensorSubject = new BehaviorSubject(null);
export default function Mapa({ empresa }) {
  const machineImage = getMachineImage();
  const [isLoading, setIsLoading] = useState(true);

  const contextData = useContext(MainContext);
  const { setMenuOpen, controllers } = contextData;
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [misControllers, setMisControllers] = useState([]);

  useEffect(() => {
    setMisControllers(controllers);
  }, [controllers]);

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
            return controllers.find((data) => data.serie === sensorData.serie);
          } else {
            return null;
          }
        })
      )
      .subscribe((sensorData) => {
        if (sensorData !== selectedSensor) {
          setSelectedSensor(sensorData);
        }
      });
  
    return () => {
      subscription.unsubscribe();
    };
  }, [controllers, selectedSensorSubject]);
  



  const handleMarkerClick = useCallback(
    (sensorData) => {
      setMenuOpen((prevMenuOpen) => !prevMenuOpen);
      selectedSensorSubject.next(sensorData);
    },
    [setMenuOpen]
  );

  return (
    <>
      <div className="Home-title points">
        <h1>UNIDAD MINERA {empresa}</h1>
        <span>Monitoreo de gases en tiempo real </span>
        <div className="square1"></div>
        <div className="square2"></div>
        <img src="imgs/warning.svg" className="img-warning" alt="" />
      </div>
      <div className="Home-image">
        {isLoading ? (
          <Loader className="loader" />
        ) : (
          <div className="Map-content">
            <ImageMarker
              src={machineImage}
              markers={misControllers.map((sensorData, index) => ({
                top: parseInt(sensorData.top),
                left: parseInt(sensorData.left),
                sensorData: sensorData,
                handleOnClick: handleMarkerClick,
                index,
              }))}
              markerComponent={MemoizedCustomMarker}
            />
          </div>
        )}
      </div>
      {selectedSensor && (
        <Details
          sensorData={selectedSensor}/>
      )}
    </>
  );
}
