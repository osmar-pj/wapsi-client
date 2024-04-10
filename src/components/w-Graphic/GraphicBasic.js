import { useEffect, useRef, useState } from "react";
import { DataGrafBasic, DataInstruments } from "@/src/libs/api";
import { getYesterdayMidnight, timeToLocal } from "@/src/libs/utils";
import { LineStyle, createChart } from "lightweight-charts";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, addMonths } from "date-fns";
import ES from "date-fns/locale/es";
import { useMainContext } from "@/src/contexts/Main-context";
import { CSVLink } from "react-csv";
import Download from "@/src/Icons/download";
import { motion } from "framer-motion";

export default function GraphicBasic() {
  const { authTokens } = useMainContext();
  const [instruments, setInstruments] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dataCSV, setDataCSV] = useState([]);

  const [chart, setChart] = useState(null);
  const chartContainerRef = useRef(null);
  const [baselineSeries, setBaselineSeries] = useState(null);
  const [avgPriceLine, setAvgPriceLine] = useState(null);
  const [maxPriceLine, setMaxPriceLine] = useState(null);
  const [startDate, setStartDate] = useState(getYesterdayMidnight());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchInstruments() {
      const data = await DataInstruments(authTokens?.empresa);
      setInstruments(data);

      if (data?.length > 0) {
        setSelectedOption(data[0]._id);
      }
    }
    fetchInstruments();
  }, [authTokens]);

  const optionsInstruments = instruments?.map((instrument) => ({
    value: instrument._id,
    label: instrument.name,
  }));

  const formatOptionLabel = ({ serie, label, mining }) => (
    <div>
      <span>{label}</span>
      <span style={{ color: "gray" }}> {mining} </span>
      <span style={{ color: "gray" }}> {serie} </span>
    </div>
  );

  const handleDayChange = (update) => {
    const [newStartDate, newEndDate] = update;
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleInstrumentChange = (option) => {
    setSelectedOption(option.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchGrafBasic = async () => {
      try {
        if (selectedOption && startDate && endDate) {
          const data = await DataGrafBasic(
            selectedOption,
            startDate.getTime(),
            endDate.getTime()
          );
          setAllData(data);
          const formattedData = data?.map((item) => ({
            ts: new Date(item.ts * 1000).toLocaleString(), // Convertir el timestamp a formato de fecha
            value: parseFloat(item.value.toFixed(2)), // Convertir el value a número y redondear a 2 decimales
          }));

          setDataCSV(formattedData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrafBasic();
  }, [selectedOption, startDate, endDate]);

  useEffect(() => {
    if (!allData || allData.length === 0) {
      return;
    }

    if (!chart) {
      const newChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: {
            type: "solid",
            color: "transparent",
          },
          textColor: "#898989",
          fontFamily: "__Sora_fdd6c4",
          fontBoldWeight: 600,
        },

        rightPriceScale: {
          scaleMargins: {
            top: 0,
            bottom: 0,
          },
          borderVisible: false,
        },
        crosshair: {
          horzLine: {
            visible: true,
            labelVisible: true,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: "rgba(32, 38, 46, 0.1)",
            labelVisible: true,
          },
        },
        grid: {
          vertLines: {
            color: "transparent",
          },
          horzLines: {
            color: "#e6e6e6",
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          borderVisible: false,
        },
      });

      const baselineSeries = newChart.addBaselineSeries({
        baseValue: { type: "price", price: 25 },
        bottomLineColor: "rgba( 38, 166, 154, 1)",
        bottomFillColor2: "rgba( 38, 166, 154, 0.28)",
        bottomFillColor1: "rgba( 38, 166, 154, 0.05)",
        topLineColor: "rgba( 239, 83, 80, 1)",
        topFillColor2: "rgba( 239, 239, 80, 0.1)",
        topFillColor1: "rgba( 239, 34, 80, 0.52)",
      });

      setChart(newChart);
      setBaselineSeries(baselineSeries);
    } else {
      const nuevoData = allData?.map((item) => ({
        value: parseFloat(item.value.toFixed(2)),
        time: timeToLocal(item.ts),
      }));

      if (baselineSeries) {
        baselineSeries.setData(nuevoData);
      }

      const maximumPrice = Math.max(...nuevoData.map((item) => item.value));
      const avgPrice =
        nuevoData.reduce((acc, cur) => acc + cur.value, 0) / nuevoData.length;

      const lineWidth = 2;

      if (!avgPriceLine) {
        const newAvgPriceLine = chart.addLineSeries({
          color: "#5220DD",
          lineWidth: lineWidth,
          lineStyle: LineStyle.Solid,
          title: "valor promedio",
        });
        setAvgPriceLine(newAvgPriceLine);
      } else {
        avgPriceLine?.setData([
          { time: nuevoData[0].time, value: avgPrice },
          { time: nuevoData[nuevoData.length - 1].time, value: avgPrice },
        ]);
      }
      if (!maxPriceLine) {
        const newMaxPriceLine = chart.addLineSeries({
          color: "#5220DD",
          lineWidth: lineWidth,
          lineStyle: LineStyle.Solid,
          title: "valor máximo",
        });
        setMaxPriceLine(newMaxPriceLine);
      } else {
        maxPriceLine?.setData([
          { time: nuevoData[0].time, value: maximumPrice },
          { time: nuevoData[nuevoData.length - 1].time, value: maximumPrice },
        ]);
      }
    }
  }, [allData]);

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
        <div className="select-g">
          <Select
            instanceId="react-select-instance"
            name="sensor"
            classNamePrefix="custom-select"
            isSearchable={false}
            isClearable={false}
            options={optionsInstruments}
            value={optionsInstruments?.find((i) => i.value === selectedOption)}
            onChange={handleInstrumentChange}
            placeholder="Seleccione..."
            formatOptionLabel={formatOptionLabel}
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
          <div className="chart-container chart-hidden" ref={chartContainerRef}>
            <p>No hay datos disponibles.</p>
          </div>
        )}
      </div>
      <div className="container-table">
        <table>
          <thead>
            <tr>
              <th>Valor promedio</th>
              <th>Tiempo de retraso</th>
              <th>Duración</th>
            </tr>
          </thead>
          <tbody>
            {allData?.map((item, index) => (
              <motion.tr key={index}  initial={{ opacity: 0, y: "-0.9em" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}>
                <td>{parseFloat(item.value).toFixed(2)}</td>
                <td>{new Date(item.ts * 1000).toLocaleString()}</td>
                <td>
                  {index > 0 && ( 
                    <>{item.ts - allData[index - 1].ts} segundos</>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
