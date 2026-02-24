"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadGLTFModel } from "@/lib/model";

function easeOutCirc(x: number) {
  return Math.sqrt(1 - Math.pow(x - 1, 4));
}

export default function VoxelSai() {
  const refContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const targetRef = useRef(new THREE.Vector3(-0.5, 1.2, 0));
  const initialCameraPositionRef = useRef(
    new THREE.Vector3(
      20 * Math.sin(0.2 * Math.PI),
      10,
      20 * Math.cos(0.2 * Math.PI)
    )
  );
  const sceneRef = useRef(new THREE.Scene());

  const handleWindowResize = useCallback(() => {
    const container = refContainer.current;
    const renderer = rendererRef.current;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;
      renderer.setSize(scW, scH);
    }
  }, []);

  useEffect(() => {
    const container = refContainer.current;
    if (!container || rendererRef.current) return;

    const scW = container.clientWidth;
    const scH = container.clientHeight;
    const target = targetRef.current;
    const initialCameraPosition = initialCameraPositionRef.current;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(scW, scH);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scale = scH * 0.005 + 4.8;
    const camera = new THREE.OrthographicCamera(
      -scale,
      scale,
      scale,
      -scale,
      0.01,
      50000
    );
    camera.position.copy(initialCameraPosition);
    camera.lookAt(target);

    const ambientLight = new THREE.AmbientLight(0xcccccc, Math.PI);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.target = target;

    loadGLTFModel(scene, "/sai.glb", {
      receiveShadow: true,
      castShadow: false,
    }).then(() => {
      animate();
      setLoading(false);
    });

    let req: number | null = null;
    let frame = 0;

    const animate = () => {
      req = requestAnimationFrame(animate);
      frame = frame <= 100 ? frame + 1 : frame;

      if (frame <= 100) {
        const p = initialCameraPosition;
        const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;

        camera.position.y = 10;
        camera.position.x =
          p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
        camera.position.z =
          p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
        camera.lookAt(target);
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    return () => {
      if (req) cancelAnimationFrame(req);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [handleWindowResize]);

  return (
    <div className="relative mx-auto h-[280px] w-[280px] sm:h-[480px] sm:w-[480px] lg:h-[640px] lg:w-[640px]">
      <div ref={refContainer} className="h-full w-full" />
      {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-8 animate-spin rounded-full border-4 border-muted-foreground border-t-transparent" />
        </div>
      )}
    </div>
  );
}
