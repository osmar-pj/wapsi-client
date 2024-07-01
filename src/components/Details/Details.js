import React, { useEffect, useState } from "react";
import DetailsSensor from "./DetailsSensor";
import DetailsVentilator from "./DetailsVentilator";
import Close from "@/src/Icons/close";

const DynamicComponent = React.memo(({ sensorData }) => {
  let Component;

  switch (sensorData.img) {
    case "monitor":
      Component = DetailsSensor;
      break;
    case "ventilador":
      Component = DetailsVentilator;
      break;
    case "caja":
      Component = DetailsSensor;
      break;
    default:
      break;
  }

  return Component ? <Component sensorData={sensorData} /> : null;
});

export default function Details({ sensorData, onClose, closeDisabled }) {
  return (
    <div
      className="w-Details"
      style={{
        bottom: `${sensorData.cardPosition.x}`,
        right: `${sensorData.cardPosition.y}`,
      }}
    >
      <div className="Details-header">
        <h2>
          {sensorData.ubication} <small>/Ubicación</small>
        </h2>
      </div>
      <div className="Details-close">
        <button
          className="btn-close"
          onClick={onClose}
          disabled={closeDisabled}
        >
          <Close />
        </button>
      </div>
      <div className="Details-body">
        <DynamicComponent sensorData={sensorData} />
      </div>
    </div>
  );
}
