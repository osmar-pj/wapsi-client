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

export default function GraphicBasic() {
  const { authTokens } = useMainContext();
  const [chart, setChart] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [allData, setAllData] = useState([
    { value: 8, ts: 1711987362 },
    { value: 45, ts: 1711987462 },
  ]);
  const [baselineSeries, setBaselineSeries] = useState(null);
  const chartContainerRef = useRef(null);
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
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrafBasic();
  }, [selectedOption, startDate, endDate]);

  useEffect(() => {
    console.log("tercero");
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

      baselineSeries.setData(nuevoData);

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
        maxPriceLine.setData([
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
      </div>
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
    </>
  );
}
