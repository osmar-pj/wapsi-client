export default function IconVentilator(props) {
  const { color, speed } = props;
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      width="1em"
      height="1em"
      fillRule="evenodd"
      clipRule="evenodd"
      imageRendering="optimizeQuality"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      viewBox="0 0 67.75 67.75"
    >
      <defs>
        <style>
          {
            ".fil1{fill-rule:nonzero} @keyframes Vrotate { to {transform: rotate(360deg);}} "
          }
        </style>
      </defs>

      <circle cx={33.87} cy={33.87} r={33.87} fill="#122DB0" />
      <path
        fill="#1A1A1A"
        fillRule="nonzero"
        d="M60.68 33.87c0 14.8-12 26.8-26.8 26.8s-26.8-12-26.8-26.8 12-26.81 26.8-26.81 26.8 12 26.8 26.81z"
      />
      <path
        fill={color}
        fillRule="nonzero"
        d="M30.08 34.79s-12.78 2.34-17.95-6.68c-1.43-2.5-1.3-5.57.28-7.97 1.68-2.54 3.96-3.94 6.72-4.41 2.48-.42 4.84 1.13 5.53 3.55 1.22 4.27 4.08 7.86 8.04 11l1.17 3.58-.9-3.79s-2.35-12.78 6.68-17.95c2.5-1.43 5.57-1.3 7.97.28 2.54 1.68 3.94 3.96 4.41 6.72.42 2.48-1.13 4.84-3.55 5.53-4.27 1.22-7.86 4.08-11 8.04l-3.62 1.18 3.8-.9s12.78-2.35 17.95 6.68c1.43 2.5 1.3 5.57-.28 7.97-1.68 2.54-3.96 3.94-6.72 4.41-2.48.42-4.84-1.13-5.53-3.55-1.22-4.27-4.08-7.87-8.04-11l-1.17-3.58.9 3.79s2.35 12.78-6.68 17.95c-2.5 1.43-5.57 1.3-7.97-.28-2.54-1.68-3.94-3.96-4.41-6.72-.42-2.48 1.13-4.84 3.55-5.53 4.27-1.22 7.86-4.08 11-8.04l3.62-1.18-3.8.9z"
        style={{
          transformOrigin: "center center",
          animation: `Vrotate ${speed}s linear infinite`,
        }}
      />
      <path
        fill="#1A246B"
        fillRule="nonzero"
        d="M26.44 38.69a8.873 8.873 0 0 1 2.61-12.26 8.873 8.873 0 0 1 12.26 2.61A8.873 8.873 0 0 1 38.7 41.3a8.873 8.873 0 0 1-12.26-2.61z"
      />
    </svg>
  );
}
