import { useEffect, useState } from "react";
import "./style.css";
import Loader from "../../Components/Loader/Loader.jsx";
import StatElement from "./statElement/StatElement.jsx";
export default function Generation() {
  const [result, setResult] = useState(null);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [stats, setStats] = useState([
    {
      label: "Taille (rayon)",
      value: null,
      min: 7,
      max: 15,
      right: "km",
    },
    { label: "Gravité", value: null, min: 0.1, max: 50.0, right: "m/s²" },
    {
      label: "Distance au soleil",
      value: null,
      min: 597870,
      max: 1495978,
      right: "km",  
    },
    {
      label: "Distance de la terre",
      value: null,
      min: 0.01,
      max: 100.0,
      right: "ua",
    },
    {
      label: "Température moyenne",
      value: null,
      min: -270,
      max: 500,
      right: "°C",
    },
    { label: "Quantité d'oxygène", value: null, min: 0, max: 100, right: "%" },
    {
      label: "Quantité d'eau",
      value: null,
      min: 0,
      max: 100,
      right: "% surface",
    },
    { label: "Taux de cratères", value: null, min: 0, max: 100, right: "%" },
    {
      label: "Vitesse d'orbite autour du soleil",
      value: null,
      min: 0,
      max: 60,
      right: "km/s",
    },
    { label: "Toxicité", value: null, min: 0, max: 100, right: "indice" },
    { label: "Texture", value: null, min: 0, max: 100, right: "indice" },
   {
      label: "Orbite",
      value: null,
      options: ["Oui", "Non"],
      right: "",
    },
    { label: "Végétation", value: null, min: 0, max: 100, right: "%" },
    {
      label: "Transparence atmosphérique",
      value: null,
      min: 0,
      max: 100,
      right: "%",
    },
    {
      label: "Type d'eau",
      value: null,
      options: ["Liquide", "Glace", "Vapeur", "Aucune"],
      right: "",
    },  
    { label: "Couleur de surface", value: null, right: "" },
  ]);
  const [randomColor, setRandomColor] = useState(getLightColor);

  useEffect(() => {
    function fetchData() {
      const url =
        "https://cors-anywhere.herokuapp.com/https://www.cjglitter.com/rand_name/api";
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setResult(data.results[0].name);
          if (stats) {
            saveParams();
          }
          setTimeout(() => setButtonVisible(true), 5000);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    fetchData();
  }, []);

  function saveParams(newObj) {
    console.log(newObj);
    console.log(stats);
    if (!newObj) {
      return;
    }
    setStats((prev) =>
      prev.map((stat) =>
        stat.label == newObj.label ? { ...stat, value: newObj.value } : stat,
      ),
    );
  }

  // Synchronise le localStorage à chaque changement de stats
  useEffect(() => {
    localStorage.setItem("planetParams", JSON.stringify(stats));
  }, [stats]);

  return (
    <div className="generationPage">
      <div className="header">
        {result && result?.first_name ? (
          <>
            <h1 style={{ color: randomColor }}>{result.first_name}</h1>
            <p className="uppercase">Analyse planétaire en cours</p>
            <span className="loadingMessage">Caclul des paramètres</span>
          </>
        ) : (
          <Loader color={randomColor}></Loader>
        )}
      </div>
      <div className="wrapper">
        {result &&
          result?.first_name &&
          stats.map((stat) => (
            <StatElement
              saveParams={saveParams}
              key={stat.label}
              stat={stat}
              randomColor={randomColor}
            />
          ))}
      </div>
      {buttonVisible && (
        <a
          href="/planet"
          style={{ borderColor: randomColor, color: randomColor }}
          className="discoverButton"
        >
          Découvrir la planète
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.74998 13.75C2.49998 14.8 2.08331 17.9167 2.08331 17.9167C2.08331 17.9167 5.19998 17.5 6.24998 16.25C6.84165 15.55 6.83331 14.475 6.17498 13.825C5.85107 13.5159 5.42439 13.3372 4.97683 13.3234C4.52928 13.3095 4.09238 13.4615 3.74998 13.75Z"
              stroke={randomColor}
              style={{ stroke: randomColor, strokeOpacity: 1 }}
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 12.5L7.5 9.99998C7.94345 8.84951 8.50184 7.7467 9.16667 6.70832C10.1377 5.1558 11.4897 3.87752 13.0942 2.99506C14.6986 2.11259 16.5022 1.65529 18.3333 1.66665C18.3333 3.93332 17.6833 7.91665 13.3333 10.8333C12.2807 11.4989 11.164 12.0573 10 12.5Z"
              stroke={randomColor}
              style={{ stroke: randomColor, strokeOpacity: 1 }}
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.49998 10H3.33331C3.33331 10 3.79165 7.475 4.99998 6.66666C6.34998 5.76666 9.16665 6.66666 9.16665 6.66666"
              stroke={randomColor}
              style={{ stroke: randomColor, strokeOpacity: 1 }}
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 12.5V16.6666C10 16.6666 12.525 16.2083 13.3333 15C14.2333 13.65 13.3333 10.8333 13.3333 10.8333"
              stroke={randomColor}
              style={{ stroke: randomColor, strokeOpacity: 1 }}
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      )}
    </div>
  );
}

// Source - https://stackoverflow.com/q/23601792
// Posted by user3610762, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-15, License - CC BY-SA 3.0
function getLightColor() {
  var letters = "ABCDEF".split(""); // On retire 0-9
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}
