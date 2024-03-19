export default function CustomMarker({ sensorData, handleOnClick, index }) {
  const handleClick = () => {
    handleOnClick(sensorData);
  };

  return (
    <div
      onClick={handleClick}
      className={`Map-info ${index % 2 === 0 ? "M-blue" : "M-orange"}`}
      key={sensorData._id}
    >
      <iconGraf />
      <div className="M-i-content">
        <div className="pulse"></div>
        <div className="content-text">
          <span>{sensorData.level}</span>
          <h2>{sensorData.ubication}</h2>
          <button> Ver Detalle</button>
        </div>
      </div>
    </div>
  );
}
