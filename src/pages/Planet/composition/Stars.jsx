import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
export default function Stars() {
  const texture = useLoader(TextureLoader, "/src/assets/texture/galaxy1.png");

  return (
    <mesh>
      <sphereGeometry args={[80, 64, 64]}></sphereGeometry>
      <meshBasicMaterial map={texture} side={THREE.BackSide} transparent />
    </mesh>
  );
}
