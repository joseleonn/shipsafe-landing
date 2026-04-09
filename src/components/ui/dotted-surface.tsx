"use client";

import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

interface DottedSurfaceProps {
  /** Number of dots along each axis */
  gridSize?: number;
  /** Spacing between dots */
  spacing?: number;
  /** Base dot size */
  dotSize?: number;
  /** Wave amplitude */
  waveAmplitude?: number;
  /** Wave speed multiplier */
  waveSpeed?: number;
  /** Dot color (hex) */
  color?: string;
  /** Dot opacity */
  opacity?: number;
  /** Fog color to blend edges */
  fogColor?: string;
}

export default function DottedSurface({
  gridSize = 60,
  spacing = 0.35,
  dotSize = 2.2,
  waveAmplitude = 0.6,
  waveSpeed = 0.8,
  color = "#4a8eff",
  opacity = 0.45,
  fogColor = "#0B1F3B",
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const reducedMotion = useRef(false);

  const dotCount = useMemo(() => gridSize * gridSize, [gridSize]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(new THREE.Color(fogColor), 1);
    container.appendChild(renderer.domElement);

    // Scene + fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(new THREE.Color(fogColor), 0.06);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    // Geometry — grid of dots
    const positions = new Float32Array(dotCount * 3);
    const baseY = new Float32Array(dotCount);
    const halfGrid = (gridSize * spacing) / 2;

    for (let ix = 0; ix < gridSize; ix++) {
      for (let iz = 0; iz < gridSize; iz++) {
        const idx = ix * gridSize + iz;
        const x = ix * spacing - halfGrid;
        const z = iz * spacing - halfGrid;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;
        baseY[idx] = 0;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: dotSize * 0.04,
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Animation loop
    let clock = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      if (!reducedMotion.current) {
        clock += 0.016 * waveSpeed;
        const posArray = geometry.attributes.position.array as Float32Array;
        for (let ix = 0; ix < gridSize; ix++) {
          for (let iz = 0; iz < gridSize; iz++) {
            const idx = ix * gridSize + iz;
            const x = posArray[idx * 3];
            const z = posArray[idx * 3 + 2];
            posArray[idx * 3 + 1] =
              Math.sin(x * 0.5 + clock) * waveAmplitude * 0.5 +
              Math.sin(z * 0.4 + clock * 0.7) * waveAmplitude * 0.5 +
              Math.cos((x + z) * 0.3 + clock * 0.5) * waveAmplitude * 0.3;
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [dotCount, gridSize, spacing, dotSize, waveAmplitude, waveSpeed, color, opacity, fogColor]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
