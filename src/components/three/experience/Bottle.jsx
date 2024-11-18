import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import MeshCustomStandardMaterial from "../shader/customStandardMaterial.js";
import * as THREE from "three";
import gsap from "gsap";
import useThreeStore from "@/store/useStore.js";

export function Bottle(props) {
  const { nodes, materials } = useGLTF("/models/Bottle.glb");
  const { isColor } = useThreeStore();
  const ref = useRef();
  const customMaterialRef = useRef();

  useEffect(() => {
    customMaterialRef.current.uniforms.uValueZ.value = 7.0;
    customMaterialRef.current.uniforms.uColor2.value = new THREE.Color(isColor);

    gsap.to(customMaterialRef.current.uniforms.uValueZ, {
      duration: 2,
      value: -6.0,
      ease: "linear",
      onComplete() {
        customMaterialRef.current.uniforms.uValueZ.value = 7.0;
        customMaterialRef.current.uniforms.uColor1.value = new THREE.Color(
          isColor
        );
      },
    });

    return () => {};
  }, [isColor]);

  return (
    <group {...props} dispose={null} ref={ref}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh.geometry}
        material={materials["Material.001"]}
      >
        <MeshCustomStandardMaterial ref={customMaterialRef} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_1.geometry}
        material={materials["Material.003"]}
      ></mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesh_2.geometry}
        material={materials.metal}
      />
    </group>
  );
}

useGLTF.preload("/models/Bottle.glb");
