import "./style.css";
import { useState, useEffect, useRef } from "react";

export default function StatElement({ stat, randomColor, saveParams }) {
  const [value, setValue] = useState(stat.value);
  const [displayValue, setDisplayValue] = useState(""); // Ce qui est affiché à l'écran
  const [isVisible, setIsVisible] = useState(true);
  const [currentProgress, setCurrentProgress] = useState(0);

  const duration = 5000; // 5 secondes pour matcher ton ancienne config

  useEffect(() => {
    if (stat.value === null || stat.value === undefined) {
      let finalValue;

      if (stat.options !== undefined) {
        finalValue = Math.floor(Math.random() * stat.options.length);
      } else if (stat.min !== undefined && stat.max !== undefined) {
        finalValue = parseFloat(getRandomValueBetween(stat.min, stat.max));
      } else if (stat.label == "Couleur de surface") {
        finalValue = String(randomColor);
      }

      setValue(finalValue);
      saveParams({ label: stat.label, value: finalValue });

      // 2. Logique d'animation synchronisée
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1); // de 0 à 1

        // Mise à jour de la barre de progression
        setCurrentProgress(progress * 100);

        if (stat.options) {
          // EFFET TEXTE : On pioche un index au hasard dans les options tant que c'est pas fini
          const randomIndex = Math.floor(Math.random() * stat.options.length);
          setDisplayValue(stat.options[randomIndex]);
        } else {
          // EFFET NOMBRE : On fait grimper le chiffre
          const currentNum = (progress * finalValue).toFixed(2);
          setDisplayValue(currentNum);
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // FIN : On fixe la valeur réelle
          setDisplayValue(stat.options ? stat.options[finalValue] : finalValue);
          setIsVisible(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [stat]);

  return (
    <div
      className="statElement"
      style={{ backgroundColor: randomColor + "15" }}
    >
      <span className="label">{stat.label}</span>

      {stat.label !== "Couleur de surface" ? (
        <div>
          <span className="value" style={{ color: randomColor }}>
            {displayValue}
          </span>
          <span className="right">{stat.right}</span>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: randomColor }} className="color"></div>
          <span className="right">{hexToHsl(randomColor)}</span>
        </div>
      )}

      <div
        className="progressBar"
        style={{
          opacity: isVisible ? 1 : 0,
          backgroundColor: randomColor,
          width: `${currentProgress}%`, // Simple et synchronisé sur progress
          transition: isVisible ? "none" : "opacity 0.5s ease-out",
        }}
      />
    </div>
  );
}
function getRandomValueBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

/**
 * Convertit une couleur Hexadécimale en HSL
 * @param {string} hex - Exemple: "#ff5733"
 * @returns {string} - Format: "hsl(h, s%, l%)"
 */
const hexToHsl = (hex) => {
  // 1. Nettoyage du string (enlève le #)
  hex = hex.replace(/^#/, "");

  // 2. Conversion en RGB
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatique (gris)
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // 3. Formatage pour CSS (arrondi pour plus de propreté)
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

// Test
console.log(hexToHsl("#57e54f")); // "hsl(117, 76%, 60%)"
