export default function Loader(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        shapeRendering: "geometricPrecision",
        textRendering: "geometricPrecision",
        imageRendering: "optimizeQuality",
        fillRule: "evenodd",
        clipRule: "evenodd",
      }}
      viewBox="0 0 10.38 4.41"
    >
      <defs>
        <style>{".fil1{fill:#0a423b}.fil0{fill:#0bb97d} @keyframes fade { 0%, 100% { opacity: 1;}60% {opacity: 0;}}"}</style>
      </defs>
      <g id="Capa_x0020_1">
        <rect width={1.51} height={4.41} className="fil0" rx={0.08} ry={0.14} style={{
            opacity: "0",
            animation: "fade 2s ease-in-out infinite",
          }}/>
        <rect
          width={1.51}
          height={4.41}
          x={2.22}
          className="fil1"
          rx={0.06}
          ry={0.11}
          style={{
            opacity: "0",
            animation: "fade 2s ease-in-out 0.4s infinite",
          }}
        />
        <rect
          width={1.51}
          height={4.41}
          x={4.43}
          className="fil0"
          rx={0.06}
          ry={0.11}
          style={{
            opacity: "0",
            animation: "fade 2s ease-in-out 0.8s infinite",
          }}
        />
        <rect
          width={1.51}
          height={4.41}
          x={6.65}
          className="fil1"
          rx={0.06}
          ry={0.11}
          style={{
            opacity: "0",
            animation: "fade 2s ease-in-out 1.2s infinite",
          }}
        />
        <rect
          width={1.51}
          height={4.41}
          x={8.87}
          className="fil0"
          rx={0.06}
          ry={0.11}
          style={{
            opacity: "0",
            animation: "fade 2s ease-in-out 1.6s infinite",
          }}
        />
      </g>
    </svg>
  );
}
