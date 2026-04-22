import * as THREE from "three";
import { useEffect, useRef } from "react";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function Sun({ getParams, soleilRef , setSunReady}) {
  const lightRef = useRef();
  const hdrColor = new THREE.Color(10, 5, 0);
  useEffect(() => {
    if (lightRef.current) {
      // La lumière appartient au calque 0 (planète) et 1 (soleil)
      lightRef.current.layers.enable(0);
      lightRef.current.layers.enable(1);
    }
  }, []);
   useEffect(() => {
    if (soleilRef.current) {
      setSunReady(true);
    }
  }, [soleilRef.current]);

  return (
    <>
      <mesh
        ref={soleilRef}
        layers={1}
        scale={[65, 65, 65]}
        position={[getParams("Distance au soleil") * 0.001, 0, 0]}
      >
        <icosahedronGeometry args={[1, 5]} />
        <pointLight
          color={"#FDB813"}
          intensity={2000000}
          distance={1000}
        />
        <ambientLight color={"white"} intensity={0.8} ref={lightRef} />
        <meshStandardMaterial
          emissive={hdrColor}
          emissiveIntensity={1}
          color={"#fdd77f"}
          wireframe={false}
        />
      </mesh>
      <EffectComposer>
        <Bloom
          luminanceThreshold={1.0} // <--- SEUIL CRITIQUE
          mipmapBlur
          intensity={2}
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}
