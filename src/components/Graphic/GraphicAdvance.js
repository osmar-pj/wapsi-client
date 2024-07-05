import { Chart, registerables } from "chart.js";
import "chart.js/auto";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-annotation";
import annotationPlugin from "chartjs-plugin-annotation";
import moment from "moment";
import "moment/locale/es";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { DataGrafAdvance, DataGroups } from "@/src/libs/api";
import { formartTime } from "@/src/libs/utils";
import { useMainContext } from "@/src/contexts/Main-context";
import { CSVLink } from "react-csv";
import Download from "@/src/Icons/download";
import { he } from "date-fns/locale";

if (typeof window !== "undefined") {
  moment.locale(navigator.language);
}

Chart.register(annotationPlugin);

export default function GraphicAdvance() {
  const { authTokens } = useMainContext();
  const [allData, setAllData] = useState([]);
  const [dataCSV, setDataCSV] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    async function fetchInstruments() {
      const data = await DataGroups(authTokens.token);
      const newData = data?.map((item) =>
          item.groups
            .filter((group) => group.name === "CO")
            .map((group) => ({
              name: group.name,
              _id: group._id,
              ubication: item.ubication,
            }))
        )
        .flat();

      setInstruments(newData);
      
      if (newData?.length > 0) {
        setSelectedOption(newData[0]._id);
      }
    }
    fetchInstruments();
  }, []);

  const optionsInstruments = instruments?.map((i) => ({
    value: i._id,
    ubication: i.ubication,
  }));

  const formatOptionLabel = ({ ubication }) => (
    <div>
      <span style={{ color: "gray" }}> {ubication} </span>
    </div>
  );

  const handleChange = (option) => {
    setSelectedOption(option.value);
  };

  useEffect(() => {
    const fetchGrafAdvance = async () => {
      try {
        setIsLoading(true);
        const data = await DataGrafAdvance(selectedOption);
        // console.log(data)
        setAllData(data);
        setDataCSV(data.data_final);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrafAdvance();
  }, [selectedOption]);

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

    // console.log(data);

    const formatSpanishDate = (date) => {
      return moment(date).format("ddd, DD MMM");
    };

    Chart.register(...registerables);
    Chart.defaults.font.family = "__Sora_fdd6c4";

    const ctx = document.getElementById("Chart");
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
                color: "#000000",
                font: {
                  size: 12.5,
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
                color: "#000000",
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

  return (
    <>
      <div className="container-selects">
        <div className="select-g">
          <Select
            instanceId="react-select-instance"
            name="instruments"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleChange}
            options={optionsInstruments}
            value={optionsInstruments?.find(
              (option) => option.value === selectedOption
            )}
            placeholder="Seleccione..."
            formatOptionLabel={formatOptionLabel}
          />
        </div>
        <div>
          <CSVLink
            className="btn-acept"
            data={dataCSV}
            filename={"mi_archivo.csv"}
            href="#"
          >
            <Download /> Descargar CSV
          </CSVLink>
        </div>
      </div>

      <div className="graf-A">
        <div className="graf-dates">
          <h2>
            {allData && !isNaN(allData.mean)
              ? formartTime(allData.mean)
              : "0h 0min"}
          </h2>
          <span>Tiempo promedio</span>
        </div>
        <div className="leyend">
          <div className="i-leyend">
            <div
              className="i-leyend-circle"
              style={{ backgroundColor: "#b3b3b3" }}
            ></div>
            <span>INOPERATIVO</span>
          </div>
          <div className="i-leyend">
            <div
              className="i-leyend-circle"
              style={{ backgroundColor: "#0bb97d" }}
            ></div>
            <span>OK</span>
          </div>
          <div className="i-leyend">
            <div
              className="i-leyend-circle"
              style={{ backgroundColor: "#b9a50c" }}
            ></div>
            <span>ALTO</span>
          </div>
          <div className="i-leyend">
            <div
              className="i-leyend-circle"
              style={{ backgroundColor: "#ff1437" }}
            ></div>
            <span>MUY ALTO</span>
          </div>
        </div>
        {isLoading ? (
          <>
            <span className="loader"></span>
          </>
        ) : null}
        <canvas
          id="Chart"
          className={isLoading ? "chart-hidden" : "chart-visible"}
          style={{ height: "600px" }}

        ></canvas>
        {/* <div
          className={
            allData && allData.length > 0
              ? "no-data-opacity-0"
              : "no-data-opacity-1"
          }
        >
          No hay datos
        </div> */}
      </div>
    </>
  );
}
