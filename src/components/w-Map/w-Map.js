import { useContext, useEffect, useState, useCallback } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import ImageMarker from "react-image-marker";

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
    }
  }

  return "/imgs/mapJulcani.svg";
};

const CustomMarker = ({ sensorData, handleOnClick, index }) => {
  const memoizedHandleOnClick = useCallback(() => {
    handleOnClick(sensorData);
  }, [handleOnClick, sensorData, index]);

  return (
    <div
      onClick={memoizedHandleOnClick}
      className={`Map-info ${index % 2 === 0 ? "M-orange" : "M-blue"}`}
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

export default function Mapa({ controllers, empresa }) {
  const machineImage = getMachineImage();
  const [isLoading, setIsLoading] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { setMenuOpen } = useContext(MainContext);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    if (controllers.length > 0) {
      setIsLoading(false);
    }
  }, [controllers]);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  useEffect(() => {
    if (isMapLoaded && !isLoading) {
      setIsLoading(false);
    }
  }, [isMapLoaded, isLoading]);

  const handleOnClick = useCallback(
    (sensorData) => {
      setMenuOpen((prevMenuOpen) => !prevMenuOpen);
      selectedSensorSubject.next(sensorData);
    },
    [setMenuOpen]
  );

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
  }, [controllers]);

  const memoizedMarkerComponent = useCallback(
    (props) => (
      <MemoizedCustomMarker {...props} handleOnClick={handleOnClick} index={controllers.findIndex((sensorData) => sensorData._id === props.sensorData._id)} />
    ),
    [handleOnClick, controllers]
  );

  return (
    <>
      <div className="Home-title points">
        <h1>UNIDAD MINERA {empresa}</h1>
        <span>//Monitoreo en tiempo real </span>
        <div className="square1"></div>
        <div className="square2"></div>
      </div>
      <div className="Home-image">
        {isLoading ? (
          <div
            onLoad={handleMapLoad}
            style={{
              position: "relative",
              top: "0",
              left: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
              opacity: isLoading ? "1" : "0",
              visibility: isLoading ? "visible" : "hidden",
              transition: "opacity 0.8 ease-in-out, visibility 0.8 ease-in-out",
              zIndex: "2",
            }}
          >
            <Loader className="loader" />
          </div>
        ) : controllers.length > 0 ? (
          <div
            className="Map-content"
            onLoad={handleMapLoad}
            style={{
              opacity: isMapLoaded ? "1" : "0",
              visibility: isMapLoaded ? "visible" : "hidden",
              transition: "opacity 0.8 ease-in-out, visibility 0.8 ease-in-out",
            }}
          >
            <ImageMarker
              src={machineImage}
              markers={controllers
                .map((sensorData) => {
                  
                    return {
                      top: parseInt(sensorData.top),
                      left: parseInt(sensorData.left),
                      sensorData: sensorData,
                    };
                  
                  return null;
                })
                .filter((marker) => marker !== null)}
                markerComponent={memoizedMarkerComponent}
            />
          </div>
        ) : (
          <p>No hay datos disponibles para mostrar en el mapa.</p>
        )}

        {selectedSensor && <Details sensorData={selectedSensor} />}
      </div>
    </>
  );
}
