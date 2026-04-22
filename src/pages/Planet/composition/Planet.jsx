import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useState, useEffect, useRef, useMemo } from "react";
import { Icosahedron, Line } from "@react-three/drei";
import { TextureLoader } from "three"; 
import  Satellites  from "./Sattelites.jsx";

export default function Planet({
  getParams,
  getParamsObject,
  soleilRef,
  planetRef,
  sunReady,
}) {
  const vitesse = getParams("Vitesse d'orbite autour du soleil") / 100;
  const hasOrbite =
    getParamsObject("Orbite")?.options[getParams("Orbite")] === "Oui";
  let rayon = getParams("Taille (rayon)");
  const planetWithTextureRef = useRef();
  const couleur = getParams("Couleur de surface");

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
      !sunReady ||
      !hasOrbite
    ) {
      return { a: 0, b: 0, focalOffset: 0, orbitPoints: [] };
    }
    const pDist = sXposition - 0;
    if (!pDist) return { a: 0, b: 0, focalOffset: 0, orbitPoints: [] };
    console.log("distance : " + pDist);
    const b_val = sRayon * 2 * 4;
    const a_val = pDist * 1.5;
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
    if (!planetRef.current || !a || !b || !hasOrbite) return;
    const time = state.clock.elapsedTime * vitesse;

    // Rotation sur elle-même
    planetRef.current.rotation.y += 0.005;

    // Position sur l'ellipse
    planetRef.current.position.x = Math.cos(time) * a;
    planetRef.current.position.z = Math.sin(time) * b;
  });
  useEffect(() => {
    if (planetWithTextureRef.current) {
      planetWithTextureRef.current.geometry.computeVertexNormals();
    }
  }, [planetWithTextureRef]);
  return (
    <>
      <group ref={planetRef}>
        <mesh ref={planetWithTextureRef} scale={[rayon, rayon, rayon]}>
          <icosahedronGeometry args={[1, 100]} />
          <meshStandardMaterial
            color={couleur}
            displacementMap={ReliefTexture(getParams("Type d'eau"))}
            displacementScale={parseInt(getParams("Taux de cratères")) / 100} // Plus de cratères = plus de relief)}
            displacementBias={-0.05}
            flatShading={true}
            emissive={couleur}
            emissiveIntensity={0.2} // Fait briller la planète
            roughness={0.8}
          />
        </mesh>

        <mesh scale={[rayon * 0.98, rayon * 0.98, rayon * 0.98]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial
            color={couleur}
            metalness={parseInt("0." + getParams("Quantité d'oxygène"))}
            roughness={0.2}
          />
        </mesh>
        <pointLight intensity={2} distance={rayon * 3} color={couleur} />
       <Satellites rayon={rayon} planetRef={planetRef}></Satellites>
      </group>
      {hasOrbite && false && orbitPoints && orbitPoints.length > 0 && (
        <Line
          points={orbitPoints}
          color="#ffffff"
          opacity={0.1}
          transparent
          lineWidth={1}
          dashed
          dashScale={0.1}
        />
      )}
    </>
  );
}


// types options: ["Liquide", "Glace", "Vapeur", "Aucune"]
// type = 1 -> Glace
export function ReliefTexture(type) {
  const file1 = "/src/assets/texture/planetHeightMap.png";
  const file2 = "/src/assets/texture/grand_canyon_heightmap_sm.png";
  const texture = useLoader(THREE.TextureLoader, type==1 ? (Math.random() < 0.5 ? file1 : file2) : file2);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
