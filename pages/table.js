import { useEffect, useState, useMemo } from "react";
import Reg from "@/src/Icons/reg";
import Foot from "@/src/components/c-footer/c-footer";
import Header from "@/src/components/c-header/c-header";
import DragAndDrop from "@/src/components/w-Drag/w-Drag";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { io } from "socket.io-client";
import { useMainContext } from "@/src/contexts/Main-context";

export default function Safety({ roles, empresa }) {
  const [create, setCreate] = useState(false);
  const [relations, setRelations] = useState([]);

  const { fetchInstruments } = useMainContext();
  const fetchRelations = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/api/v1/relation`);
      if (response.ok) {
        const data = await response.json();
        setRelations(data.relations);
      } else {
        console.error("Error al obtener datos");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    fetchRelations();
  }, []);

  // console.log(relations);
  const formattedData = useMemo(() => {
    return relations
      .flatMap((relation) => {
        return relation.actuators.map((actuator) => {
          const actuadorRow = {
            name: actuator.name || "",
            mode: actuator.mode || "",
            id: actuator._id || "",
            value: actuator.value || 0,
            signal: actuator.signal || "",
            symbol: actuator.symbol || "",
          };
          if (relation.sensors && relation.sensors.length > 0) {
            relation.sensors.forEach((sensor) => {
              actuadorRow[`${sensor.name}`] = {
                value: sensor.value,
                alarm:
                  sensor.alarm && sensor.alarm.category
                    ? sensor.alarm.category
                    : null,
              };
            });
          }
          return actuadorRow;
        });
      })
      .flat();
  }, [relations]);

  // useEffect(() => {
  //   const socket = io(process.env.API_URL);
  //   const subscription = new Subject();

  //   socket.on(`${empresa.toUpperCase()}`, (data) => {
  //     console.log(data.name, data.value);
  //     const updatedRelations = relations.map((relation) => {
  //       if (
  //         relation.sensors.some((sensor) => sensor._id === data._id) ||
  //         relation.actuators.some((actuator) => actuator._id === data._id)
  //       ) {
  //         const updatedSensors = relation.sensors.map((sensor) =>
  //           sensor._id === data._id ? { ...sensor, ...data } : sensor
  //         );
  //         const updatedActuators = relation.actuators.map((actuator) =>
  //           actuator._id === data._id ? { ...actuator, ...data } : actuator
  //         );
  //         return {
  //           ...relation,
  //           sensors: updatedSensors,
  //           actuators: updatedActuators,
  //         };
  //       return relation;
  //     });
  //     setRelations(updatedRelations);
  //     subscription.next(data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //     subscription.unsubscribe();
  //   };
  // }, [relations, empresa]);

  useEffect(() => {
    const socket = io(process.env.API_URL);
    const controller$ = new Subject();

    socket.on(`${empresa.toUpperCase()}`, (data) => {
      controller$.next(data);
    });

    const subscription = controller$.subscribe((updatedData) => {
      setRelations((prevRelations) => {
        const updatedRelations = prevRelations.map((relation) => {
          // Actualizamos los actuadores
          const updatedActuators = relation.actuators.map((actuator) => {
            if (actuator._id === updatedData._id) {
              return { ...actuator, ...updatedData };
            }
            return actuator;
          });

          // Actualizamos los sensores
          const updatedSensors = relation.sensors.map((sensor) => {
            if (sensor._id === updatedData._id) {
              return { ...sensor, ...updatedData };
            }
            return sensor;
          });

          // Retornamos la relación con los actuadores y sensores actualizados
          return {
            ...relation,
            actuators: updatedActuators,
            sensors: updatedSensors,
          };
        });
        return updatedRelations;
      });
    });

    return () => {
      subscription.unsubscribe();
      socket.disconnect();
    };
  }, [empresa]);

  const updateMode = async (id, currentMode) => {
    const newMode = currentMode === "auto" ? "manual" : "auto";

    console.log(id, newMode);
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/instrument/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ mode: newMode }), // Envía el nuevo modo
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === true) {
          fetchInstruments();
          fetchRelations();
        } else {
          console.log("error");
        }
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const updateSignal = async (id, currentMode) => {
    const newMode = currentMode === "digital" ? "analog" : "digital";

    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/instrument/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ signal: newMode }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === true) {
          fetchInstruments();
          fetchRelations();
        } else {
          console.log("error");
        }
      } else {
        console.error("Error al crear:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <Header roles={roles} />
      <section className="w-FormUser">
        <div className="Cont">
          <div className="Container-title">
            <div className="D-title-name">
              {/* <button className="h-title-btn">
            <img src="imgs/i-drop.svg" alt="" />
          </button> */}
              <div className="i-name-list">
                {/* <h2>Lista de Tajos </h2> <span>{data?.length} </span> */}
              </div>
            </div>
            <div className="D-title-more">
              <button className="btn-acept" onClick={() => setCreate(true)}>
                Relacionar
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
                      <th>Nombre</th>
                      <th>Modo</th>
                      <th>Señal</th>
                      <th>Value</th>
                      <th>O2</th>
                      <th>CO</th>
                      <th>CO2</th>
                      <th>NO2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedData.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <button
                            className="btn-auto"
                            onClick={() => updateMode(item.id, item.mode)}
                          >
                            {item.mode}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-auto"
                            onClick={() => updateSignal(item.id, item.signal)}
                          >
                            {item.signal}
                          </button>
                        </td>
                        <td>{item.value}</td>
                        <td>
                          <span className={`td-${item.O2 && item.O2.alarm}`}>
                            {item.O2 && item.O2.value}
                          </span>
                        </td>
                        <td>
                          <span className={`td-${item.CO && item.CO.alarm}`}>
                            {item.CO && item.CO.value}
                          </span>
                        </td>
                        <td>
                          <span className={`td-${item.CO2 && item.CO2.alarm}`}>
                            {item.CO2 && item.CO2.value}
                          </span>
                        </td>
                        <td>
                          <span className={`td-${item.NO2 && item.NO2.alarm}`}>
                            {item.NO2 && item.NO2.value}
                          </span>
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
      <Foot />
      {create && <DragAndDrop setCreate={setCreate} />}
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

  const userData = JSON.parse(userDataCookie);
  const empresa = userData.empresa;
  const roles = userData.roles;
  return {
    props: { empresa, roles },
  };
};
