import { useEffect, useState, useRef, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import Header from "@/src/components/c-header/c-header";
import Select from "react-select";
import Loader from "@/src/Icons/loader";
import annotationPlugin from "chartjs-plugin-annotation";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-annotation";
Chart.register(annotationPlugin);

export default function Analysis({ empresa, roles }) {
  const [allData, setAllData] = useState([]);
  const [sensor, setSensor] = useState("");
  const [list, setList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Nuevo estado
  const chartRef = useRef(null);
  const fetchWapsi = async () => {
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
        const jsonData = await response.json();
        console.log(jsonData.controllers);
        setList(jsonData.controllers);
        if (jsonData.controllers.length > 0) {
          setSensor(jsonData.controllers[0].serie);
        }
      } else {
        console.error("Error al obtener datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  useEffect(() => {
    fetchWapsi();
  }, []);

  const fetchData = useCallback(async () => {
    setIsUpdating(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const end = new Date();
    try {
      const response = await fetch(
        `${
          process.env.API_URL
        }/api/v1/data/analytics?serie=${sensor}&name=CO&start=${start.getTime()}&end=${end.getTime()}`
      );
      if (response.ok) {
        const jsonData = await response.json();

        setAllData(jsonData);
      } else {
        console.error("Error en la petición");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsUpdating(false);
  }, [sensor]);

  useEffect(() => {
    if (!allData || !allData.bars) {
      return;
    }

    const filter = allData.bars;
    const annotation = allData.data_final;

    const reorganizedData = annotation.map((item) => ({
      x: new Date(item.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      y: formatDate(new Date(item.tstart)),
      value: item.duration.toFixed(0),
    }));

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const annotations = reorganizedData.map((i, index) => ({
      type: "label",
      id: "l" + index,
      xValue: i.x,
      yValue: i.y,
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      paddingLeft: 12,
      paddingRight: 12,
      borderRadius: 4,
      content: [`${i.value}min`],
      font: {
        size: 13,
      },
      color: "white",
      zIndex: 2,
    }));

    const data = filter.map((item) => ({
      label: item.x,
      data: [{ x: item.x, y: item.y }],
      backgroundColor: item.color,
      barPercentage: 0.5,
      categoryPercentage: 0.5,
      barThickness: 60,
      maxBarThickness: 65,
    }));
    const formatSpanishDate = (date) => {
      const options = { weekday: "short", day: "numeric", month: "short" };
      return new Date(date).toLocaleDateString("es-ES", options);
    };

    Chart.register(...registerables);
    Chart.defaults.font.family = "__JetBrains_Mono_79498a";

    const ctx = document.getElementById("Chart").getContext("2d");
    if (!chartRef.current) {
      const newChartInstance = new Chart(ctx, {
        type: "bar",
        responsive: true,
        data: {
          datasets: data,
        },
        options: {
          indexAxis: "y",
          plugins: {
            annotation: {
              drawTime: "afterDatasetsDraw",
              annotations: annotations,
            },
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
          },
          elements: {
            bar: {
              borderRadius: 2,
            },
          },
          scales: {
            x: {
              stacked: false,
              type: "time",
              time: {
                parser: "HH:mm",
                unit: "hour",
                displayFormats: {
                  hour: "HH:mm",
                },
              },
              min: "00:00",
              max: "23:59",
              ticks: {
                beginAtZero: true,
                color: "#e6e6e6",
                font: {
                  size: 13,
                },
                maxRotation: 90,
                minRotation: 90,
                autoSkip: true,
              },
              grid: {
                color: "rgba(128, 128, 128, 0.1)",
                borderDash: [10, 5],
              },
              barSpacing: 5,
            },
            y: {
              stacked: true,

              type: "time",
              time: {
                parser: "yyyy-MM-dd",
                unit: "day",
                displayFormats: {
                  day: "eee dd",
                },
              },
              ticks: {
                beginAtZero: true,
                color: "#e6e6e6",
                font: {
                  size: 13,
                },
                callback: (value) => formatSpanishDate(value),
              },
              grid: {
                display: false,
              },
            },
          },
        },
      });

      chartRef.current = newChartInstance;
    } else {
      chartRef.current.data.datasets = data;
      chartRef.current.options.plugins.annotation.annotations = annotations;
      chartRef.current.update();
    }
  }, [allData]);

  const handleSensorChange = (selectedOption) => {
    if (selectedOption && selectedOption.value !== sensor) {
      setIsUpdating(true);
      setSensor(selectedOption.value);
    }
  };
  

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    if (sensor !== "") {
      setIsLoading(true);
      fetchData().then(() => {
        setIsLoading(false);
      });
    }
  }, [sensor]);

  let options = [];
  console.log(list);
  if (list) {
    options = list.map((i) => {
      return {
        value: i.serie,
        label: i.ubication,
      };
    });
  }

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      className: "custom-select__option",
    }),
    control: (provided, state) => ({
      ...provided,
      className: "custom-select__control",
    }),
  };
  function formatearTiempo(totalMinutos) {
    // Calcular las horas y los minutos
    const horas = Math.floor(totalMinutos / 60); // Obtener las horas completas
    const minutos = totalMinutos % 60; // Obtener los minutos restantes

    // Formatear los minutos con dos decimales
    const minutosFormateados = minutos.toFixed(0);

    // Formatear el resultado
    const tiempoFormateado = `${horas}h ${minutosFormateados}min`;

    return tiempoFormateado;
  }
  return (
    <>
      <Header roles={roles} />
      <section className="w-Analysis">
        <div className="D-c-select"></div>
        <div className="graf-dates">
          {allData.mean !== undefined ? (
            <div className="graf-dates-pro">
              {" "}
              <span>Tiempo promedio</span>{" "}
              <h2>{formatearTiempo(allData.mean)} </h2>{" "}
            </div>
          ) : null}
          <div className="select-g">
            <Select
              instanceId="react-select-instance"
              name="sensor"
              classNamePrefix="custom-select"
              options={options}
              isSearchable={false}
              isClearable={false}
              value={options.find(option => option.value === sensor)}
              onChange={handleSensorChange}
              styles={customStyles}
            />
          </div>
        </div>
        <div className="leyend">
          <div className="i-leyend">
            <div className="i-leyend-circle ley-green"></div>
            <span>OK</span>
          </div>
          <div className="i-leyend">
            <div className="i-leyend-circle ley-yellow"></div>
            <span>ALERTA ALTO</span>
          </div>
          <div className="i-leyend">
            <div className="i-leyend-circle ley-red"></div>
            <span>ALERTA MUY ALTO</span>
          </div>
        </div>

        <div className="graf-A">
          {isLoading || isUpdating ? (
            <div className="loader-overlay">
              <Loader className="loader" />
            </div>
          ) : null}
          <canvas
            id="Chart"
            className={
              isLoading || isUpdating ? "chart-hidden" : "chart-visible"
            }
          ></canvas>
        </div>
      </section>
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
