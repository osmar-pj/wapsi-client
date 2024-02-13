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
        name.substring(number.index + number[0].length) 
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
          <More />
        </div>
      </div>
      <div className="Sensor-circle">
        {sensorData.devices && sensorData.devices.length > 0 ? (
          sensorData.devices.map((device, index) => {
            const { name, value, und, min, max1, max2 } = device;
            return (
              <div
                key={name}
                className={`circle-item ${
                  value < max1 && value > min 
                    ? "green"
                    : value < min || value > max2
                    ? "red"
                    : "yellow"
                }`}
              >
                <Circle/>
                <p>{renderNameWithSubscript(name)}</p>          
                <h3>{value.toFixed(1)}</h3>
                <span>{und}</span>
              </div>
            );
          })
        ) : (
          <p>Datos no disponibles</p>
        )}
      </div>
    </div>
  );
};

export default Sensor;