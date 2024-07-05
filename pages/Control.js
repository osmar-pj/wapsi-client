import { useEffect, useMemo, useState } from "react";
import { Subject } from "rxjs";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { CSVLink } from "react-csv";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataRelations, UpdateInstrument } from "@/src/libs/api";
import DragAndDrop from "@/src/components/Drag/DragAndDrop"
import DeleteDrag from "@/src/components/Drag/DeleteDrag"
import Delete from "@/src/Icons/delete";
import Download from "@/src/Icons/download";
import Reg from "@/src/Icons/reg";

export default function Control() {
  const { fetchInstruments, authTokens } = useMainContext();
  const [create, setCreate] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [relations, setRelations] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loadingModeMap, setLoadingModeMap] = useState({});
  const [loadingSignalMap, setLoadingSignalMap] = useState({});
  const [deletedId, setDeletedId] = useState(null);

  const fetchRelations = async () => {
    try {
      const data = await DataRelations(authTokens?.token);
      // console.log(data);
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
            ubication: actuator.ubication || "",
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

          // Actualizamos los actuadores
          const updatedActuators = relation.actuators.map((actuator) => {
            if (actuator._id === updatedData._id) {
              return { ...actuator, ...updatedData };
            }
            return actuator;
          });

          return {
            ...relation,
            sensors: updatedSensors,
            actuators: updatedActuators,
          };
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
    console.log(actuatorId, currentMode)
    setLoadingModeMap((prevState) => ({ ...prevState, [actuatorId]: true }));
    const newMode = currentMode === "auto" ? "manual" : "auto";
    try {
      const data = await UpdateInstrument(authTokens.token,actuatorId, { mode: newMode });

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
      const data = await UpdateInstrument(authTokens.token,actuatorId, { signal: newMode });
      
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

  const handleDeleteClick = (id) => {
    setDeletedId(id);
    setDeleted(true);
  };

  const iconMap = {
    monitor: "/imgs/i-sensor.svg",
    caja: "/imgs/i-caja.svg",
    VENTILADOR: "/imgs/i-ventilador.svg",
    ventiladorsc: "/imgs/i-ventilador.svg",
    "3LED": "/imgs/i-led.svg",
  };

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
            {formattedData.length > 0 && (
              <div className="D-title-more">
                <button className="btn-acept" onClick={() => setCreate(true)}>
                  <Reg /> Relacionar
                </button>
              </div>
            )}
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
              <div>
                <CSVLink
                  className="btn-acept"
                  data={formattedData}
                  filename={"mi_archivo.csv"}
                  href="#"
                >
                  <Download /> Descargar CSV
                </CSVLink>
              </div>
            </div>

            <div className="C-table-body">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Ubicación</th>
                    <th>Imagen</th>
                    <th>Tipo</th>
                    <th>Nombre</th>
                    <th>Modo</th>
                    <th>Señal</th>
                    <th>Value</th>
                    {columns.map((i, index) => (
                      <td key={index}>{i}</td>
                    ))}
                    <th>Acción</th>
                  </tr>
                  <tr className="nexrui"> </tr>
                </thead>
                <tbody>
                  {formattedData.length > 0 ? (
                    formattedData.map((item, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: "-0.9em" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.04 }}
                        style={{
                          userSelect:
                            Object.values(loadingModeMap).some(
                              (loading) => loading
                            ) || // Comprobar si algún modo de carga está activo
                            Object.values(loadingSignalMap).some(
                              (loading) => loading
                            ) // Comprobar si alguna señal de carga está activa
                              ? "none"
                              : "auto",
                          pointerEvents:
                            Object.values(loadingModeMap).some(
                              (loading) => loading
                            ) || // Comprobar si algún modo de carga está activo
                            Object.values(loadingSignalMap).some(
                              (loading) => loading
                            ) // Comprobar si alguna señal de carga está activa
                              ? "none"
                              : "auto",
                        }}
                      >
                        <td className="td-id">
                          <span>#{index + 1}</span>
                        </td>
                        <td>{item.ubication}</td>
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

                        <td>{item.name}</td>
                        <td>
                          <button
                            className={`btn-auto ${
                              item.mode === "manual"
                                ? "m-manual"
                                : item.mode === "auto"
                                ? "m-auto"
                                : ""
                            }`}
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
                            className={`btn-auto ${
                              item.signal === "digital"
                                ? "m-digital"
                                : item.signal === "analog"
                                ? "m-analog"
                                : ""
                            }`}
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
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Delete />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr className="s-dates">
                      <td colSpan="10">
                        <div className="td-s-dates">
                          <h4>Sin datos disponibles</h4>
                          <p>
                            Lo sentimos, no hay datos para mostrar en este
                            momento. Por favor, verifica tu selección e intente
                            de nuevo más tarde.
                          </p>

                          <button
                            className="btn-acept"
                            onClick={() => setCreate(true)}
                            style={{ width: "130px" }}
                          >
                            <Reg /> Relacionar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {create && (
          <DragAndDrop setCreate={setCreate} fetchRelations={fetchRelations} />
        )}
        {deleted && (
          <DeleteDrag
            id={deletedId}
            setDeleted={setDeleted}
            fetchRelations={fetchRelations}
          />
        )}
      </AnimatePresence>
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
