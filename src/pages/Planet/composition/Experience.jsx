import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef, useMemo } from "react";
import { Line } from "@react-three/drei";
import { or } from "three/tsl";

export default function Experience({ getParams, soleilRef,planetRef , sunReady }) {
 
  let rayon = getParams("Taille (rayon)");

  useEffect(() => {
    if (soleilRef.current) {
      console.log("Soleil ref est prêt :", soleilRef.current);
    }
  }, [soleilRef.current, sunReady]);
  const sRayon = useMemo(() => {
    if (soleilRef?.current) {
      return soleilRef.current.scale.x;
    }
    return undefined;
  }, [soleilRef.current, sunReady]);
  const sXposition = useMemo(() => {
    if (soleilRef?.current) {
      return soleilRef.current.position.x;
    }
    return undefined;
  }, [soleilRef.current, sunReady]);

  const { a, b, focalOffset, orbitPoints } = useMemo(() => {
    if (
      sRayon === undefined ||
      sXposition === undefined ||
      soleilRef.current === undefined ||
      !sunReady
    ) {
      return { a: 0, b: 0, focalOffset: 0, orbitPoints: [] };
    }
    const pDist = sXposition - 0;
    if (!pDist) return { a: 0, b: 0, focalOffset: 0, orbitPoints: [] };
    console.log("distance : " + pDist);
    const b_val = sRayon * 2 * 4;
    const a_val = pDist *1.5;
    const f_offset = Math.sqrt(Math.abs(a_val * a_val - b_val * b_val));

    // Génération des points
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(Math.cos(angle) * a_val, 0, Math.sin(angle) * b_val),
      );
    }
    return { a: a_val, b: b_val, focalOffset: f_offset, orbitPoints: points };
  }, [sRayon, sXposition, soleilRef.current, sunReady]);

  useFrame((state) => {
    if (!planetRef.current || !a || !b) return;
    const time = state.clock.elapsedTime * 0.1
    planetRef.current.rotation.y += 0.01;
    planetRef.current.position.x = Math.cos(time) * a;
    planetRef.current.position.z = Math.sin(time) * b;
  });
  console.log("orbit : " + orbitPoints);
  console.log("soleil ref :" + soleilRef);
  console.log("planet ref :" + planetRef);
  console.log("sRayon :" + sRayon);
  console.log("soleil x" + sXposition);

  console.log("rayon :" + rayon);
  return (
    <>
      <group>
        <mesh
          layers={0}
          ref={planetRef}
          position={[focalOffset, 0, 0]}
          scale={[rayon, rayon, rayon]}
          position-y={0}
        >
          <sphereGeometry args={[1, 60, 16]} />
          <meshToonMaterial
            args={[{ color: getParams("Couleur de surface") }]}
            wireframe={false}
          />
        </mesh>
        {true && orbitPoints && orbitPoints.length > 0 && (
          <Line
            points={orbitPoints ?? []} // Les points calculés plus haut
            color="#ffffff1c" // Couleur de la ligne
            lineWidth={1} // Épaisseur
            dashed={true} // Pointillés (optionnel)
            dashScale={0.1} // Échelle des pointillés
          />
        )}
      </group>
    </>
  );
}
