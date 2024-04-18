import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DataGrafBasic, DataInstruments } from "@/src/libs/api";
import { getYesterdayMidnight } from "@/src/libs/utils";
import { addDays } from "date-fns";

export default function GrapHig() {
  const [instruments, setInstruments] = useState([]);
  const [allData, setAllData] = useState([]);
  const [dataCSV, setDataCSV] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(getYesterdayMidnight());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    async function fetchInstruments() {
      try {
        const data = await DataInstruments(authTokens?.token);
        const dataFiltrada = data.filter((i) => i.type === "sensor");
        setInstruments(dataFiltrada);
        if (dataFiltrada.length > 0) {
          handleInstrumentChange({ value: dataFiltrada[0]._id });
        }
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    }
    fetchInstruments();
  }, [authTokens]);

  const handleInstrumentChange = (option) => {
    setSelectedOption(option.value);
  };

  useEffect(() => {
    if (!selectedOption || !startDate || !endDate) {
      return;
    }
    const fetchGrafBasic = async () => {
      setIsLoading(true);
      try {
        const data = await DataGrafBasic(
          selectedOption,
          startDate.getTime(),
          endDate.getTime()
        );
        setAllData(data);
        const formattedData = data.data?.map((item) => ({
          x: item.ts * 1000, // Convertir el timestamp a milisegundos
          y: parseFloat(item.value.toFixed(2)),
        }));
        setDataCSV(formattedData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrafBasic();
  }, [selectedOption, startDate, endDate]);

  const options = {
    chart: {
      type: "line",
      fontFamily: "'__Sora_fdd6c4', '__Sora_Fallback_fdd6c4'",
      margin: 0,
      timezone: "America/Lima",
    },
    title: {
      text: "Ejemplo de gráfico de línea con anotaciones",
    },
    xAxis: {
      type: "datetime",
      labels: {
        style: {
          color: "#6e6d7a",
          fontSize: "10px",
        },
      },
      tickInterval: 24 * 3600 * 1000, // Intervalo entre las etiquetas en milisegundos (en este caso, 1 día)
    },
    yAxis: {
      title: {
        text: "Valor",
      },
      labels: {
        style: {
          color: "#6e6d7a",
          fontSize: "10px",
        },
      },
      min: allData.range?.min,
      max: allData.range?.max,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          symbol: "circle",
        },
      },
    },
    tooltip: {
      xDateFormat: "%d/%m/%Y %H:%M",
      formatter: function () {
        return (
          "<b>" +
          Highcharts.dateFormat("%d/%m/%Y %H:%M", this.x) +
          "</b><br/>" +
          "Valor: " +
          this.y.toFixed(2)
        );
      },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      verticalAlign: "top",
    },
    series: [
      {
        name: "Series 1",
        data: allData?.data?.map((item) => ({
          x: item.ts * 1000, // Convertir el timestamp a milisegundos
          y: parseFloat(item.value.toFixed(2)),
        })),
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
