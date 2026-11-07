import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Methodology3DScene.css';

gsap.registerPlugin(ScrollTrigger);

interface Methodology3DSceneProps {
  activeStep: number;
}

export const Methodology3DScene: React.FC<Methodology3DSceneProps> = ({ activeStep }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<number>(activeStep);
  activeStepRef.current = activeStep;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    let isDisposed = false;
    let animationFrameId: number;
    let isVisible = true;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 1.2, 5.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Assembly Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Materials
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x111c2a,
      roughness: 0.45,
      metalness: 0.25,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc8a86b,
      roughness: 0.2,
      metalness: 0.88,
    });

    const activeMat = new THREE.MeshStandardMaterial({
      color: 0xe5ce9e,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x5a441e,
      emissiveIntensity: 0.5,
    });

    // 4 Monolithic Pillars in Ascending Spatial Stepping
    const pillars: { group: THREE.Group; beacon: THREE.Mesh; pointLight: THREE.PointLight }[] = [];
    const stepCount = 4;
    const spacingX = 1.15;

    for (let i = 0; i < stepCount; i++) {
      const pGroup = new THREE.Group();
      const posX = (i - 1.5) * spacingX;
      const posY = (i - 1.5) * 0.45;
      const posZ = -(i - 1.5) * 0.4;
      pGroup.position.set(posX, posY, posZ);

      // Monolithic Block
      const blockGeo = new THREE.BoxGeometry(0.55, 1.6 + i * 0.25, 0.55);
      const blockMesh = new THREE.Mesh(blockGeo, darkStoneMat.clone());
      pGroup.add(blockMesh);

      // Bronze Inlay Cap
      const capGeo = new THREE.BoxGeometry(0.58, 0.08, 0.58);
      const capMesh = new THREE.Mesh(capGeo, bronzeMat);
      capMesh.position.y = (1.6 + i * 0.25) / 2 + 0.04;
      pGroup.add(capMesh);

      // Floating Beacon Crystal on top
      const beaconGeo = new THREE.OctahedronGeometry(0.18, 0);
      const beaconMesh = new THREE.Mesh(beaconGeo, bronzeMat.clone());
      beaconMesh.position.y = (1.6 + i * 0.25) / 2 + 0.35;
      pGroup.add(beaconMesh);

      // Point Light for active beacon
      const pLight = new THREE.PointLight(0xd0b783, 0, 3.5);
      pLight.position.copy(beaconMesh.position);
      pGroup.add(pLight);

      // Mini Gyro Ring around Beacon
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 12, 32), bronzeMat);
      ring.position.copy(beaconMesh.position);
      ring.rotation.x = Math.PI / 3;
      pGroup.add(ring);

      masterGroup.add(pGroup);
      pillars.push({ group: pGroup, beacon: beaconMesh, pointLight: pLight });
    }

    // Connecting Bronze Conduit Lines between pillars
    for (let i = 0; i < stepCount - 1; i++) {
      const p1 = pillars[i].beacon.getWorldPosition(new THREE.Vector3());
      const p2 = pillars[i + 1].beacon.getWorldPosition(new THREE.Vector3());
      const distance = p1.distanceTo(p2) || 1.3;

      const conduitGeo = new THREE.CylinderGeometry(0.015, 0.015, distance, 8);
      const conduit = new THREE.Mesh(conduitGeo, bronzeMat);
      conduit.position.set((i - 1) * spacingX, (i - 1) * 0.45 + 1.2, -(i - 1) * 0.4);
      conduit.rotation.z = -0.35;
      masterGroup.add(conduit);
    }

    // Ambient & Directional Lighting
    const amb = new THREE.AmbientLight(0x111c2a, 1.8);
    scene.add(amb);

    const dirKey = new THREE.DirectionalLight(0xf2e4c8, 2.5);
    dirKey.position.set(4, 7, 5);
    scene.add(dirKey);

    const dirFill = new THREE.DirectionalLight(0x42618a, 1.3);
    dirFill.position.set(-5, -2, -3);
    scene.add(dirFill);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = Math.max(-1, Math.min(1, nx));
      mouseY = Math.max(-1, Math.min(1, ny));
      targetTiltY = mouseX * 0.22;
      targetTiltX = -mouseY * 0.14;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ScrollTrigger to softly shift camera as section scrolls
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        masterGroup.rotation.y = -0.25 + self.progress * 0.5;
      },
    });

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Intersection Observer
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Render loop
    const clock = new THREE.Clock();
    let currentTargetCamX = 0;

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const currentActive = activeStepRef.current;

      // Mouse Lerp
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      masterGroup.rotation.x = 0.15 + currentTiltX;
      masterGroup.rotation.y += (currentTiltY - masterGroup.rotation.y * 0.1) * 0.02;

      // Focus camera slightly on active step
      const targetCamX = (currentActive - 1.5) * 0.35;
      currentTargetCamX += (targetCamX - currentTargetCamX) * 0.05;
      camera.position.x = currentTargetCamX;

      // Update pillars based on active step
      pillars.forEach((p, idx) => {
        const isCurrent = idx === currentActive;
        const isPast = idx < currentActive;

        if (isCurrent) {
          p.beacon.material = activeMat;
          p.pointLight.intensity = 2.8 + Math.sin(elapsed * 3) * 0.6;
          p.group.position.y = (idx - 1.5) * 0.45 + Math.sin(elapsed * 1.5) * 0.04 + 0.1;
          p.beacon.rotation.y = elapsed * 1.2;
        } else if (isPast) {
          p.beacon.material = bronzeMat;
          p.pointLight.intensity = 1.0;
          p.group.position.y = (idx - 1.5) * 0.45;
          p.beacon.rotation.y = elapsed * 0.4;
        } else {
          p.beacon.material = darkStoneMat;
          p.pointLight.intensity = 0;
          p.group.position.y = (idx - 1.5) * 0.45;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scrollTriggerInstance.kill();

      pillars.forEach((p) => {
        p.beacon.geometry.dispose();
      });
      darkStoneMat.dispose();
      bronzeMat.dispose();
      activeMat.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="methodology-3d-wrapper" aria-hidden="true">
      <div ref={mountRef} className="methodology-3d-canvas" />
      <div className="methodology-3d-glow" />
    </div>
  );
};
