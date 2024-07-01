import Download from "@/src/Icons/download";
import { useMainContext } from "@/src/contexts/Main-context";
import { DataGrafBasic, DataInstruments } from "@/src/libs/api";
import { getYesterdayMidnight } from "@/src/libs/utils";
import { addDays, addMonths } from "date-fns";
import ES from "date-fns/locale/es";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function GraphicBasic() {
  const { authTokens } = useMainContext();
  const [instruments, setInstruments] = useState([]);
  const [selectedUbication, setSelectedUbication] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [allData, setAllData] = useState([]);
  const [dataCSV, setDataCSV] = useState([]);
  const [startDate, setStartDate] = useState(getYesterdayMidnight());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const data = await DataInstruments(authTokens?.token);
        const dataFiltrada = data.filter((i) => i.type === "sensor");
        setInstruments(dataFiltrada);

        const optionsUbications = [
          ...new Set(dataFiltrada.map((instrument) => instrument.ubication)),
        ].map((ubication) => ({
          value: ubication,
          label: ubication,
        }));

        setSelectedUbication(optionsUbications[0] || null);

        
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    }
    fetchInstruments();
  }, [authTokens]);

  useEffect(() => {
    if (selectedUbication) {
      const filteredInstruments = instruments.filter(
        (instrument) => instrument.ubication === selectedUbication.value
      );
      const optionsInstruments = filteredInstruments.map((instrument) => ({
        value: instrument._id,
        label: instrument.name,
      }));
      setSelectedInstrument(optionsInstruments[0] || null);
    }
  }, [selectedUbication, instruments]);
  

  // console.log(selectedUbication, selectedInstrument);

  const optionsUbications = [
    ...new Set(instruments.map((instrument) => instrument.ubication)),
  ].map((ubication) => ({
    value: ubication,
    label: ubication,
  }));

  const optionsInstruments = instruments
    .filter((instrument) => instrument.ubication === selectedUbication?.value)
    .map((instrument) => ({
      value: instrument._id,
      label: instrument.name,
    }));

  const handleUbicationChange = (selectedOption) => {
    setSelectedUbication(selectedOption);
  };

  const handleInstrumentChange = (selectedOption) => {
    setSelectedInstrument(selectedOption);
  };

  const handleDayChange = (update) => {
    const [newStartDate, newEndDate] = update;
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  useEffect(() => {
    if (!selectedInstrument || !startDate || !endDate) {
      return;
    }

    const fetchGrafBasic = async () => {
      setIsLoading(true);
      try {
        const data = await DataGrafBasic(
          selectedInstrument.value,
          startDate.getTime(),
          endDate.getTime()
        );

        setAllData(data);
        const formattedData = data?.data?.map((item) => ({
          ts: new Date(item.ts * 1000).toLocaleString(),
          value: parseFloat(item.value.toFixed(2)),
        }));
        setDataCSV(formattedData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrafBasic();
  }, [selectedInstrument, startDate, endDate]);

  const categories = allData?.data?.map((item) => (item.ts - 5 * 3600) * 1000);
  const values = allData?.data?.map((item) => item.value.toFixed(2));

  const uniqueDates = [
    ...new Set(
      categories?.map((timestamp) => new Date(timestamp).toDateString())
    ),
  ];

  const annotations = [];

  uniqueDates.forEach((dateString) => {
    const date = new Date(dateString);
    const timestamp = new Date(date);
    timestamp.setHours(0, 0, 0, 0);

    const timestamp7AM = new Date(date);
    timestamp7AM.setHours(7, 0, 0, 0);
    timestamp7AM.setTime(timestamp7AM.getTime() - 5 * 60 * 60 * 1000);

    const timestamp7PM = new Date(date);
    timestamp7PM.setHours(19, 0, 0, 0);
    timestamp7PM.setTime(timestamp7PM.getTime() - 5 * 60 * 60 * 1000);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(7, 0, 0, 0);
    nextDay.setTime(nextDay.getTime() - 5 * 60 * 60 * 1000); // Ajuste de zona horaria

    annotations.push({
      x: timestamp7AM.getTime(),
      x2: timestamp7PM.getTime(), // Definir el final del primer rango
      strokeDashArray: 0,
      fillColor: "white",
      borderColor: "white",
      borderWidth: 5,
      yAxisIndex: 0,
      label: {
        show: true,
        text: "7:00 hrs",
        style: {
          color: "#fff",
          background: "#EF7B45",
        },
      },
    });

    // Agregar la segunda anotación para las 7:00 PM
    annotations.push({
      x: timestamp7PM.getTime(),
      x2: nextDay.getTime(),
      strokeDashArray: 0,
      fillColor: "#D8DCFF",
      borderColor: "#D8DCFF",
      borderWidth: 5,
      yAxisIndex: 0,
      label: {
        show: true,
        text: "19:00 hrs",
        style: {
          color: "#fff",
          background: "#2667FF",
        },
      },
    });
  });

  let LimitOne, LimitTwo;
  let color1, color2, color3;
  if (allData?.alarms && allData.alarms.length > 1) {
    LimitOne = allData.alarms[1].limit_lower;
    LimitTwo = allData.alarms[1].limit_upper;

    color1 = allData.alarms[0].color;
    color2 = allData.alarms[1].color;
    color3 = allData.alarms[2].color;
  }

  const generateColors = (data) => {
    return data?.map((d, idx) => {
      let color;
      if (d <= LimitOne) {
        color = color1;
      } else if (d > LimitOne && d <= LimitTwo) {
        color = color2;
      } else {
        color = color3;
      }
      return {
        offset: (idx / data.length) * 100,
        color,
        opacity: 1,
      };
    });
  };

  const series = [
    {
      name: "series1",
      data: values?.map((value, index) => ({
        x: categories[index], // timestamp
        y: value, // valor
      })),
    },
  ];

  const options = {
    chart: {
      fontFamily: "'__Sora_fdd6c4', '__Sora_Fallback_fdd6c4'",
      margin: 0,
      type: "line",
      timezone: "America/Lima",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      // curve: "smooth",
      width: 1.5,
    },
    annotations: {
      xaxis: annotations,
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#6e6d7a",
          fontSize: "10px",
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6e6d7a",
          fontSize: "10px",
        },
      },
      min: allData.range?.min,
      max: allData.range?.max,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
      y: {
        formatter: function (value) {
          return value.toFixed(2);
        },
        title: {
          formatter: function () {
            return "Valor";
          },
        },
      },
      style: {
        fontSize: "12px",
        color: "#fff",
      },
      marker: {
        show: true,
        fillColors: ["green"],
      },
      items: {
        display: "flex",
        flexDirection: "column",
      },
      fillSeriesColor: false,
      background: "blue",
      border: {
        show: true,
        width: 2,
        radius: 5,
        color: "red",
      },
    },

    grid: {
      show: true,
      // borderColor: "#6e6d7a",
      strokeWidth: 0.5,
      position: "back",
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "bottom",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        colorStops: generateColors(values),
      },
    },
  };

  return (
    <>
      <div className="container-selects">
        <div className="select-g">
          <ReactDatePicker
            dateFormat="dd/MM/yyyy"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            isClearable={true}
            onChange={handleDayChange}
            placeholderText="dd/MM/yyyy"
            locale={ES}
            minDate={addMonths(new Date(), -3)}
            maxDate={addDays(new Date(), 0)}
          />
        </div>
        <div className="select-g" style={{ width: "160px" }}>
          <Select
            instanceId="react-select-instance-ubication"
            name="ubication"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleUbicationChange}
            options={optionsUbications}
            value={selectedUbication}
            placeholder="Seleccione..."
          />
        </div>
        <div className="select-g" style={{ width: "160px" }}>
          <Select
            instanceId="react-select-instance-instrument"
            name="instrument"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            onChange={handleInstrumentChange}
            options={optionsInstruments}
            value={selectedInstrument}
            placeholder="Seleccione ..."
          />
        </div>

        <div>
          <CSVLink
            className="btn-acept"
            data={dataCSV}
            filename={"mi_archivo.csv"}
          >
            <Download /> Descargar CSV
          </CSVLink>
        </div>
      </div>
      <div className="container-grafs">
        <div className="container-chart">
          {isLoading ? (
            <div className="background-loader">
              <span className="loader"></span>
            </div>
          ) : null}
          <Chart options={options} series={series} type="line" height={700} />
          {/* <Chart options={brushOptions} series={series} type="area" height={70} /> */}
        </div>
        <div className="container-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Val. Pro.</th>
                <th>Tiempo de retraso</th>
                <th>Duración</th>
              </tr>
              <tr className="nexrui"> </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="thumb pulse"></div>
                    </td>
                    <td>
                      <div className="thumb pulse"></div>
                    </td>
                    <td>
                      <div className="thumb pulse"></div>
                    </td>
                    <td>
                      <div className="thumb pulse"></div>
                    </td>
                  </tr>
                ))
              ) : allData.data?.length > 0 ? (
                allData.data?.map((item, index) => (
                  <tr key={index}>
                    <td className="td-id">
                      <span>#{index + 1}</span>
                    </td>
                    <td>{parseFloat(item.value).toFixed(2)}</td>
                    <td>{new Date(item.ts * 1000).toLocaleString()}</td>
                    <td>
                      {index > 0 && (
                        <>{item.ts - allData.data[index - 1].ts} seg</>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <motion.tr
                  key={`no-data`}
                  className="s-dates"
                  initial={{ opacity: 0, y: "-0.9em" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <td colSpan="10">
                    <div className="td-s-dates">
                      <h4>Sin datos disponibles</h4>
                      <p>
                        Lo sentimos, no hay datos para mostrar en este momento.
                        Por favor, verifica tu selección e intente de nuevo más
                        tarde.
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

{
  /* {isLoading ? (
            <div className="background-loader">
              <span className="loader"></span>Enviando...
            </div>
          ) : null}
          {allData && allData.length > 0 ? (
            <div
              className={`chart-container ${
                isLoading ? "chart-hidden" : "chart-visible"
              }`}
              ref={chartContainerRef}
            ></div>
          ) : (
            <div
              className="chart-container chart-hidden"
              ref={chartContainerRef}
            >
              <p>No hay datos disponibles.</p>
            </div>
          )} */
}
