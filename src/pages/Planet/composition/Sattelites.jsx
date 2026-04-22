import { useFBX } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo , useRef} from "react";

export default function Satellites({ planetRef, rayon }) {
  const fbx = useFBX("/src/assets/texture/Satellite(With textures).fbx");
  const scaleProportionnel = rayon * 0.0002;
  const orbitGroupRef = useRef();
  const pointsAFaire = useMemo(() => {
    const saved = localStorage.getItem("planetSatellites");
    return saved ? JSON.parse(saved) : 0;
  }, []);

  const satellitesData = useMemo(() => {
    const data = [];
    const ecart = 5;
    const distanceTotale = (rayon || 1) + ecart;

    // On récupère la position du centre (ou 0,0,0 si la ref n'est pas encore prête)
    const centre = planetRef?.current?.position || new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < pointsAFaire; i++) {
      const pos = getPositionAutour(centre, distanceTotale);
      console.log(pos);
      const clone = fbx.clone();
      data.push({ pos: pos.toArray(), model: clone });
    }
    return data;
  }, [fbx, pointsAFaire, rayon, planetRef]);

  useFrame((state, delta) => {
    if (orbitGroupRef.current && planetRef.current) {
      // Le groupe de satellites copie la position de la planète
      orbitGroupRef.current.position.copy(planetRef.current.position);
      
      // On fait tourner le groupe (vitesse à ajuster)
      orbitGroupRef.current.rotation.y += delta * 0.2;
      orbitGroupRef.current.rotation.z += delta * 0.05; 
    }
  });

  console.log(satellitesData);
  return (
    <group ref={orbitGroupRef}>
      {satellitesData.map((sat, index) => (
        <primitive
          key={index}
          object={sat.model}
          scale={scaleProportionnel}
          position={sat.pos}
        />
      ))}
    </group>
  );
}
function getPositionAutour(centre, distance) {
  // 1. Créer un vecteur direction aléatoire
  const direction = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  ).normalize(); // On le rend de longueur 1

  // 2. On le multiplie par la distance et on ajoute la position du centre
  const positionFinale = new THREE.Vector3()
    .copy(centre)
    .add(direction.multiplyScalar(distance));

  return positionFinale;
}
