import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DataGrafBasic } from "@/src/libs/api";

export default function GrapHig() {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGrafBasic = async () => {
      setIsLoading(true);
      try {
        const data = await DataGrafBasic(
          "661571e837aa86c1166f14eb",
          1712725200000,
          1713416400000
        );
        // console.log(data);
        setAllData(data?.data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrafBasic();
  }, []);

  const newData = allData?.map((item) => [item.ts * 1000, item.value]);

  // Calcular las fechas únicas de la data
  const uniqueDates = [
    ...new Set(allData?.map((item) => new Date(item.ts * 1000).toDateString())),
  ];

  // Crear las bandas para cada día
  const plotBands = uniqueDates.map((dateString) => {
    const date = new Date(dateString);

    const startOfDay = new Date(date);
    startOfDay.setHours(7, 0, 0, 0);
    startOfDay.setTime(startOfDay.getTime() - 5 * 60 * 60 * 1000);

    const endOfDay = new Date(date);
    endOfDay.setHours(19, 0, 0, 0);
    endOfDay.setTime(endOfDay.getTime() - 5 * 60 * 60 * 1000);

    return {
      from: startOfDay.getTime(),
      to: endOfDay.getTime(),
      color: "#D8DCFFbb",
      label: {
        zIndex: 6,
        text: "07:00 hrs",
        align: "left",
        x: 0,
        y: 60,
        rotation: -90,

        style: {
          fontSize: "10px",
          padding: "3px",
        },
        format:
          '<div style="background-color: #FEB019; padding: 2px; border-radius: 3px;">{value}</div>',
      },
    };
  });

  const options = {
    chart: {
      zoomType: "x",
      style: {
        fontFamily: "'__Sora_fdd6c4', '__Sora_Fallback_fdd6c4'",
      },
    },
    rangeSelector: {
      selected: 1,
    },
    title: {
      text: "Ejemplo",
    },
    xAxis: {
      type: "datetime",
      plotBands: plotBands,
      labels: {
        style: {
          colors: "#6e6d7a",
          fontSize: "10px",
        },
      },
    },
    yAxis: {
      title: {
        enabled: false,
      },
      labels: {
        style: {
          colors: "#6e6d7a",
          fontSize: "10px",
        },
      },
    },
    navigator: {
      series: {
        accessibility: {
          exposeAsGroupOnly: true,
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
      enabled: false,
    },
    series: [
      {
        name: "AAPL Stock Price",
        data: newData,
        type: "line",
        threshold: null,
        tooltip: {
          valueDecimals: 2,
        },
        zones: [
          {
            value: 0,  // Valor más pequeño posible
            color: "red",
          },
          {
            value: 21,
            color: "yellow",
          },
          {
            value: 17,
            color: "green",
          },
        ],
        
        
      },
    ],
  };

  return (
    <div className="container-chart highcharts-figure">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
