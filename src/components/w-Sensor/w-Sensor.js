import Circle from "@/src/Icons/circle";
import Dat from "@/src/Icons/dat";
import More from "@/src/Icons/more";

const Sensor = ({ sensorData }) => {

  const renderNameWithSubscript = (name) => {
    const number = name.match(/\d+/);
    if (number) {
      return [
        name.substring(0, number.index),
        <sub key={number[0]}>{number[0]}</sub>,
        name.substring(number.index + number[0].length),
      ];
    } else {
      return name;
    }
  };

  return (
    <div className="Details-content text-1">
      <div className="Details-title">
        <div className="D-title-name">
          <div>
            <Dat />
          </div>
          <h4>Análisis |</h4>
          <h5>Tiempo real</h5>
        </div>
        <div className="D-title-more">
          
        </div>
      </div>
      <div className="Sensor-circle">
        {sensorData.groups && sensorData.groups.length > 0 ? (
          sensorData.groups.map((device, index) => {
            return (
              <div key={device.name} className={`circle-item ${device.alarm && device.alarm.category}`}>
                <Circle />
                <p >{renderNameWithSubscript(device.name)}</p>
                <h3>{device.value.toFixed(2)}</h3>
                <span>{device.und}</span>
              </div>
            );
          })
        ) : (
          <p>Sin Datos</p>
        )}
      </div>
    </div>
  );
};

export default Sensor;
