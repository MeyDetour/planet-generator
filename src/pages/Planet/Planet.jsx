import "./style.css";
import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

// composition
import Experience from "./composition/Experience.jsx";
import Stars from "./composition/Stars.jsx";
import Sun from "./composition/Sun.jsx";
export default function Planet() {
  const [parameters, setParameters] = useState(
    localStorage.getItem("planetParams")
      ? JSON.parse(localStorage.getItem("planetParams"))
      : null,
  );
  const [sunReady, setSunReady] = useState(false);
  const soleilRef = useRef();
  const planetRef = useRef();

  function getParams(label) {
    return parameters.find((param) => param.label === label)?.value;
  }

  useEffect(() => {
    if (!parameters) return;
  }, [parameters]);

  return (
    <div className="planetePage">
      <Canvas
        onCreated={({ scene, camera }) => {
          camera.layers.enable(0); // Calque par défaut (Planète, Stars)
          camera.layers.enable(1); // Calque du Soleil
          scene.background = new THREE.Color("black");
        }}
        camera={{
          fov: 45, // deformation comme sur minecraft
          near: 0.1, // near (0.1) & far (200) : Tout ce qui est plus proche que 0.1 ou plus loin que 200 unités de la caméra ne sera pas affiché (le "clipping")
          far: 100000000,
          position: [0, getParams("Taille (rayon)") * 2, 6], // Place la caméra en haut ($Y=3$) et en arrière ($Z=6$).
        }}
      >
        <Sun
          soleilRef={soleilRef}
          getParams={getParams}
          setSunReady={setSunReady}
        ></Sun>

        <Experience
          sunReady={sunReady}
          soleilRef={soleilRef}
          planetRef={planetRef}
          getParams={getParams}
        />
        <Stars></Stars>

        <OrbitControls makeDefault />

        {planetRef.current && <CameraHandler planetRef={planetRef} />}
      </Canvas>
    </div>
  );
}
function CameraHandler({ planetRef }) {
    const offset = new THREE.Vector3(300,300,300);
  useFrame((state) => {
    if (planetRef.current) {
      const worldPos = new THREE.Vector3();
      planetRef.current.getWorldPosition(worldPos);

     // const idealCameraPos = worldPos.clone().add(offset);

       //state.camera.position.lerp(idealCameraPos, 0.05); // 0.05 pour un suivi souple

      if (state.controls) {
        state.controls.target.lerp(worldPos, 0.1);
        state.controls.update();
      }

      state.camera.lookAt(worldPos);
    }
  });
  return null;
}
