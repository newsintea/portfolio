import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type * as THREE from "three";

type LoadOptions = {
  receiveShadow?: boolean;
  castShadow?: boolean;
};

export function loadGLTFModel(
  scene: THREE.Scene,
  glbPath: string,
  options: LoadOptions = { receiveShadow: true, castShadow: true }
): Promise<THREE.Object3D> {
  const { receiveShadow = true, castShadow = true } = options;

  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      glbPath,
      (gltf) => {
        const obj = gltf.scene;
        obj.name = "sai";
        obj.position.y = 0;
        obj.position.x = 0;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        resolve(obj);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
