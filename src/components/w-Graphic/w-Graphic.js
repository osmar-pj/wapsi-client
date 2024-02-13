import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { MainContext } from "@/src/contexts/Main-context";
import "@splidejs/react-splide/css";
import { Chart, registerables } from "chart.js";
import "chart.js/auto";
import More from "@/src/Icons/more";
import Metric from "@/src/Icons/metric";
import Select from "react-select";
import Loader from "@/src/Icons/loader";

function Graphic({ sensorData }) {
  
  const [list, setList] = useState([]);
  const [period, setPeriod] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sensor, setSensor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); 

  const chartRef = useRef(null);
  const { menuOpen } = useContext(MainContext);

  const fetchData = useCallback(async () => {
    setIsUpdating(true); 
    try {
      const response = await fetch(
        `${process.env.API_URL}/api/v1/data?serie=${sensorData.serie}&name=${sensor}&start=${start}&end=${end}`
      );
      if (response.ok) {
        const jsonData = await response.json();
       
        setList(jsonData);
      } else {
        console.error("Error en la petición");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsUpdating(false);
  }, [sensorData.serie, sensor, start, end]);

  const resetSelects = () => {
    const currentDate = new Date();
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);
    setStart(inicio.getTime());
    setEnd(currentDate.getTime());
    setPeriod("HOY");
    setSensor(sensorData.devices[0]?.name || "");
    setList([]);
  };

  useEffect(() => {
    resetSelects();
  }, [menuOpen]);

  const handlePeriodChange = ({ value }) => {
    const inicio = new Date();
    inicio.setHours(0, 0, 0, 0);

    if (value === "HOY") {
      const currentDate = new Date();
      setStart(inicio.getTime());
      setEnd(currentDate.getTime());
    } else if (value === "AYER") {
      inicio.setDate(inicio.getDate() - 1);
      setStart(inicio.getTime());

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setEnd(today.getTime());
    } else if (value === "SEMANA") {
      inicio.setDate(inicio.getDate() - 7);
      setStart(inicio.getTime());

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setEnd(today.getTime());
    }
    setPeriod(value);
  };

  const handleSensorChange = ({ value }) => {
    setSensor(value);
  };
  useEffect(() => {
    setIsLoading(true);

    fetchData()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, [fetchData]);

  useEffect(() => {
    const filteredData = list.filter((item, index) => index % 10 === 0);
    const labels = filteredData.map((item) => {
      const formattedTime = new Date(item.createdAt).toLocaleString(undefined, {
        hour: "numeric",
        hour12: false,
      });
      return formattedTime;
    });

    const data = filteredData.map((item) => item.devices.value.toFixed(1));

    if (!chartRef.current) {
      Chart.register(...registerables);
      Chart.defaults.font.family = "__JetBrains_Mono_46261a";

      if (data.length === 0) {
        return; // No hay datos para crear el gráfico, sal del efecto
      }

      const ctx = document.getElementById("myChart").getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#f48a241e");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      const newChartInstance = new Chart(ctx, {
        type: "line",
        responsive: true,
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              label: "O2",
              borderColor: "#f48a24",
              backgroundColor: gradient,
              borderWidth: 1.5,
              pointRadius: 0,
              showLine: true,
              tension: 0.5,
              pointBackgroundColor: "rgb(11, 185, 125)",
              pointBorderWidth: 1,
              fill: true,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              ticks: {
                beginAtZero: true,
                
                font: {
                  size: 9,
                },

                autoSkip: true,
              },
              grid: {
                color: "rgba(128, 128, 128, 0.1)",
                borderDash: [10, 5],
              },
            },
            y: {
              ticks: {
                beginAtZero: true,
                
                font: {
                  size: 9,
                },
              },
              grid: {
                color: "rgba(128, 128, 128, 0.1)",
                borderDash: [10, 5],
              },
            },
          },
        },
      });

      chartRef.current = newChartInstance;
    } else {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
      setIsLoading(false);
    }
  }, [list, sensor]);

  const Periodos = ["HOY", "AYER", "SEMANA"];
  const options = sensorData.devices.map((device) => ({
    value: device.name,
    label: device.name,
  }));

 
  return (
    <div className="Details-content text-3">
      <div className="Details-title">
        <div className="D-title-name">
          <div>
            <Metric />
          </div>
          <h4>Métricas de datos |</h4>
          <h5>Archivado</h5>
        </div>
        <div className="D-title-more">
          <More />
        </div>
      </div>
      <div className="D-c-graphic">
        <div className="D-c-select">
          <div className="select-two">
            <Select
              name="period"
              classNamePrefix="custom-select"
              className="select"
              options={Periodos.map((sup) => ({ label: sup, value: sup }))}
              isSearchable={false}
              isClearable={false}
              value={{ label: period, value: period }}
              onChange={handlePeriodChange}
            />
          </div>
          <div className="select-separ">
            <span className="background"></span>
            <span className="triangle"></span>
          </div>
          <div className="select-two">
            <Select
              name="sensor"
              classNamePrefix="custom-select"
              className="select"
              options={options}
              isSearchable={false}
              isClearable={false}
              value={{ value: sensor, label: sensor }}
              onChange={handleSensorChange}
            />
          </div>
        </div>
        <div className="graf-char">
          {isLoading || isUpdating ? (
            <div className="loader-overlay">
              <Loader className="loader" />
            </div>
          ) : null}
          <canvas
            id="myChart"
            className={
              isLoading || isUpdating ? "chart-hidden" : "chart-visible"
            }
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Graphic;
