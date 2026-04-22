import "./style.css";
export default function DataInterface({ getParams, getParamsObject }) {
  const color = getParams("Couleur de surface");
  const params = JSON.parse(localStorage.getItem("planetParams"))
    .filter((param) => param.label != "Couleur de surface")
    .map((param) => {
      if (param.options) {
        return { name: param.label, value: param.options[param.value] };
      }
      return { name: param.label, value: param.value + param.right };
    });
  return (
    <>
      <a
        href="/"
        style={{ borderColor: color, color: color }}
        className="regenerateButton"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C12.0967 2.50789 14.1092 3.32602 15.6167 4.78333L17.5 6.66667"
            stroke={color}
            style={{ stroke: color, strokeOpacity: 1 }}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.4999 2.5V6.66667H13.3333"
            stroke={color}
            style={{ stroke: color, strokeOpacity: 1 }}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 10C17.5 11.9891 16.7098 13.8968 15.3033 15.3033C13.8968 16.7098 11.9891 17.5 10 17.5C7.90329 17.4921 5.89081 16.674 4.38333 15.2167L2.5 13.3333"
            stroke={color}
            style={{ stroke: color, strokeOpacity: 1 }}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66667 13.3333H2.5V17.5"
            stroke={color}
            style={{ stroke: color, strokeOpacity: 1 }}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Noubelle planète
      </a>
      <div className="statPanel" style={{ backgroundColor: color + "15" , borderColor: color}}>
        <h1 style={{ color: color }}>
          Planète {localStorage.getItem("planetName")}
        </h1>
        <div className="wrapper">
          {params.map((param) => {
            if (param.name === "Probabilité de survie"){
                return
            }
            return             (
            <div key={param.name} className="stat">
              <span className="statName">{param.name}</span>
              <span style={{color:color}} className="statValue">{param.value}</span>
            </div>
          )})}
           <div  className="stat">
              <span className="statName">Probabilité de survie</span>
              <span style={{color:color}} className="statValue">{getParams("Probabilité de survie")}%</span>
                <div className="proportion">
                    <div className="completed" style={{width: `${getParams("Probabilité de survie")}%`, backgroundColor: color}}></div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
