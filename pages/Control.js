import { useEffect, useMemo, useState } from "react";
import { useMainContext } from "@/src/contexts/Main-context";
import {
  DataRelations,
  DeleteRelations,
  UpdateInstrument,
} from "@/src/libs/api";
import { io } from "socket.io-client";
import { Subject } from "rxjs";
import DragAndDrop from "@/src/components/w-Drag/DragAndDrop";
import Delete from "@/src/Icons/delete";
import Reg from "@/src/Icons/reg";

export default function Control() {
  const { fetchInstruments, authTokens } = useMainContext();
  const [create, setCreate] = useState(false);
  const [relations, setRelations] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loadingModeMap, setLoadingModeMap] = useState({}); // Estado para el modo de carga de cada actuador
  const [loadingSignalMap, setLoadingSignalMap] = useState({}); // Estado para la señal de carga de cada actuador

  const fetchRelations = async () => {
    try {
      const data = await DataRelations(authTokens?.empresa);
      if (data && data.relations) {
        setRelations(data.relations);
      } else {
        console.error("Error.");
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };

  useEffect(() => {
    fetchRelations();
  }, [authTokens]);

  const formattedData = useMemo(() => {
    const allSensors = relations.flatMap((relation) => relation.sensors);
    const sensorNames = allSensors.map((sensor) => sensor.name);
    setColumns([...new Set(sensorNames)]);

    return relations
      .flatMap((relation) => {
        return relation.actuators.map((actuator) => {
          const actuadorRow = {
            id: relation._id,
            name: actuator.name || "",
            mode: actuator.mode || "",
            actuatorId: actuator._id || "",
            value: actuator.value || 0,
            signal: actuator.signal || "",
            type: actuator.type || "",
            symbol: actuator.symbol || "",
            level: actuator.controllerId.level || "",
            ubication: actuator.controllerId.ubication || "",
            sensors: relation.sensors,
          };
          return actuadorRow;
        });
      })
      .flat();
  }, [relations]);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const controller$ = new Subject();

    socket.on(`${authTokens?.empresa.toUpperCase()}`, (data) => {
      controller$.next(data);
    });

    const subscription = controller$.subscribe((updatedData) => {
      setRelations((prevRelations) => {
        const updatedRelations = prevRelations.map((relation) => {
          // Actualizamos los sensores
          const updatedSensors = relation.sensors.map((sensor) => {
            if (sensor._id === updatedData._id) {
              return { ...sensor, ...updatedData };
            }
            return sensor;
          });

          // Retornamos la relación con los sensores actualizados y los actuadores intactos
          return { ...relation, sensors: updatedSensors };
        });
        return updatedRelations;
      });
    });

    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [authTokens]);

  const updateMode = async (actuatorId, currentMode) => {
    setLoadingModeMap((prevState) => ({ ...prevState, [actuatorId]: true }));
    const newMode = currentMode === "auto" ? "manual" : "auto";
    try {
      const data = await UpdateInstrument(actuatorId, { mode: newMode });
      if (data.status === true) {
        fetchInstruments();
        fetchRelations();
      }
    } finally {
      setTimeout(() => {
        setLoadingModeMap((prevState) => ({
          ...prevState,
          [actuatorId]: false,
        }));
      }, 1000);
    }
  };

  const updateSignal = async (actuatorId, currentMode) => {
    setLoadingSignalMap((prevState) => ({ ...prevState, [actuatorId]: true }));
    const newMode = currentMode === "digital" ? "analog" : "digital";
    try {
      const data = await UpdateInstrument(actuatorId, { signal: newMode });
      if (data.status === true) {
        fetchInstruments();
        fetchRelations();
      }
    } finally {
      setTimeout(() => {
        setLoadingSignalMap((prevState) => ({
          ...prevState,
          [actuatorId]: false,
        }));
      }, 1000);
    }
  };

  const deleteRelations = async (id) => {
    console.log("ingresado", id);
    try {
      const data = await DeleteRelations(id);
      console.log(data);

      if (data.status === true) {
        fetchInstruments();
        fetchRelations();
      }
    } finally {
    }
  };

  const iconMap = {
    monitor: "/imgs/i-sensor.svg",
    VENTILADOR: "/imgs/i-ventilador.svg",
    "3LED": "/imgs/i-led.svg",
  };

  console.log(relations);

  return (
    <>
      <section className="w-FormUser">
        <div className="Cont">
          <div className="Container-title">
            <div className="D-title-name">
              <div className="i-name-list">
                <h2>Sistema de Control </h2>{" "}
                <span>{formattedData?.length} </span>
              </div>
            </div>
            <div className="D-title-more">
              <button className="btn-acept" onClick={() => setCreate(true)}>
                <Reg /> Relacionar
              </button>
            </div>
          </div>
          <div className="Container-table">
            <div className="C-table-header">
              <div className="c-t-h-search">
                <input
                  type="text"
                  // value={filtering}
                  // onChange={(e) => setFiltering(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="input-crud"
                />
              </div>
            </div>

            <div className="C-table-body">
              {formattedData.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Imagen</th>
                      <th>Tipo</th>
                      <th>Nivel</th>
                      <th>Ubicación</th>
                      <th>Nombre</th>
                      <th>Modo</th>
                      <th>Señal</th>
                      <th>Value</th>
                      {columns.map((i, index) => (
                        <td key={index}>{i}</td>
                      ))}
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedData.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          userSelect:
                            Object.values(loadingModeMap).some(loading => loading) || // Comprobar si algún modo de carga está activo
                            Object.values(loadingSignalMap).some(loading => loading) // Comprobar si alguna señal de carga está activa
                              ? "none"
                              : "auto",
                          pointerEvents:
                            Object.values(loadingModeMap).some(loading => loading) || // Comprobar si algún modo de carga está activo
                            Object.values(loadingSignalMap).some(loading => loading) // Comprobar si alguna señal de carga está activa
                              ? "none"
                              : "auto",
                        }}
                        
                      >
                        <td>#{index + 1}</td>
                        <td>
                          {iconMap[item.name] ? (
                            <img
                              src={iconMap[item.name]}
                              alt={item.name}
                              style={{ width: "20px", height: "20px" }}
                            />
                          ) : (
                            <img
                              src="/imgs/avatar.gif"
                              alt="Default"
                              style={{ width: "20px", height: "20px" }}
                            />
                          )}
                        </td>
                        <td>{item.type}</td>
                        <td>{item.level}</td>
                        <td>{item.ubication}</td>
                        <td>{item.name}</td>
                        <td>
                          <button
                            className="btn-auto"
                            onClick={() =>
                              updateMode(item.actuatorId, item.mode)
                            }
                            disabled={loadingModeMap[item.actuatorId]} // Desactivar el botón si está en estado de carga
                          >
                            {loadingModeMap[item.actuatorId] ? ( // Mostrar el indicador de carga si está en estado de carga
                              <>
                                <span className="loader"></span>Env...
                              </>
                            ) : (
                              <>{item.mode}</>
                            )}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-auto"
                            onClick={() =>
                              updateSignal(item.actuatorId, item.signal)
                            }
                            disabled={loadingSignalMap[item.actuatorId]} // Desactivar el botón si está en estado de carga
                          >
                            {loadingSignalMap[item.actuatorId] ? ( // Mostrar el indicador de carga si está en estado de carga
                              <>
                                <span className="loader"></span>Env...
                              </>
                            ) : (
                              <>{item.signal}</>
                            )}
                          </button>
                        </td>
                        <td>{item.value}</td>

                        {item.sensors &&
                          columns.map((sensorName, i) => {
                            const sensor = item.sensors.find(
                              (sensor) => sensor.name === sensorName
                            );
                            return (
                              <td key={i}>
                                {sensor ? (
                                  <span className={`td-${sensor.category}`}>
                                    {sensor.value?.toFixed(2)}
                                  </span>
                                ) : null}
                              </td>
                            );
                          })}
                        <td className="btns">
                          <button
                            className="btn-tbl-edit"
                            onClick={() => deleteRelations(item.id)}
                          >
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
      {create && (
        <DragAndDrop setCreate={setCreate} fetchRelations={fetchRelations} />
      )}
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  const userDataCookie = ctx.req.cookies.userData;
  const isLoggedIn = !!userDataCookie;

  if (!isLoggedIn) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
