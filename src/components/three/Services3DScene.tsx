import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Services3DScene.css';

gsap.registerPlugin(ScrollTrigger);

interface Services3DSceneProps {
  activeServiceIndex: number;
}

export const Services3DScene: React.FC<Services3DSceneProps> = ({ activeServiceIndex }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(activeServiceIndex);
  activeIndexRef.current = activeServiceIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    let isDisposed = false;
    let animationFrameId: number;
    let isVisible = true;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.5, 6.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Materials
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x111c2a,
      roughness: 0.38,
      metalness: 0.25,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc8a86b,
      roughness: 0.2,
      metalness: 0.88,
    });

    const activeFacetMat = new THREE.MeshStandardMaterial({
      color: 0xe2cc9c,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x5a441e,
      emissiveIntensity: 0.4,
    });

    // Hexagonal Architectural Crystal Facets (6 facets for 6 services)
    const facetMeshes: THREE.Mesh[] = [];
    const facetAngleStep = (Math.PI * 2) / 6;

    for (let i = 0; i < 6; i++) {
      const angle = i * facetAngleStep;
      const facetGroup = new THREE.Group();
      facetGroup.rotation.y = angle;

      // Facet Pillar Block
      const blockGeo = new THREE.BoxGeometry(0.35, 2.4, 0.5);
      const mesh = new THREE.Mesh(blockGeo, darkStoneMat.clone());
      mesh.position.set(0, 0, 1.45);
      mesh.rotation.x = 0.08;
      facetGroup.add(mesh);

      // Bronze Cap
      const capGeo = new THREE.BoxGeometry(0.38, 0.08, 0.52);
      const cap = new THREE.Mesh(capGeo, bronzeMat);
      cap.position.set(0, 1.24, 1.45);
      facetGroup.add(cap);

      // Inlaid Bronze Needle
      const needleGeo = new THREE.BoxGeometry(0.04, 2.2, 0.52);
      const needle = new THREE.Mesh(needleGeo, bronzeMat);
      needle.position.set(0, 0, 1.45);
      facetGroup.add(needle);

      rootGroup.add(facetGroup);
      facetMeshes.push(mesh);
    }

    // Central Monolith Core
    const coreGeo = new THREE.CylinderGeometry(0.65, 0.85, 2.9, 6);
    const coreMesh = new THREE.Mesh(coreGeo, darkStoneMat);
    rootGroup.add(coreMesh);

    // Bronze Gyro Rings encircling core
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.02, 16, 64), bronzeMat);
    ring1.rotation.x = Math.PI / 2;
    rootGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.015, 16, 64), bronzeMat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    rootGroup.add(ring2);

    // Ambient Lighting
    const ambLight = new THREE.AmbientLight(0x131f32, 1.8);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xf5e8c7, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4a6a96, 1.2);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const corePoint = new THREE.PointLight(0xd0b783, 3.5, 4.5);
    corePoint.position.set(0, 0, 0);
    rootGroup.add(corePoint);

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
      targetTiltY = mouseX * 0.25;
      targetTiltX = -mouseY * 0.15;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ScrollTrigger to rotate assembly slightly on scroll
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        rootGroup.position.y = -0.3 + self.progress * 0.6;
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
    let currentRotationY = 0;

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Target rotation Y based on active service
      const targetAngleY = -activeIndexRef.current * facetAngleStep;
      currentRotationY += (targetAngleY - currentRotationY) * 0.06;

      // Mouse Lerp
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      rootGroup.rotation.y = currentRotationY + currentTiltY + Math.sin(elapsed * 0.4) * 0.03;
      rootGroup.rotation.x = 0.2 + currentTiltX;

      // Subtle Ring rotation
      ring1.rotation.z = elapsed * 0.3;
      ring2.rotation.z = -elapsed * 0.25;

      // Highlight active facet mesh
      facetMeshes.forEach((mesh, idx) => {
        if (idx === activeIndexRef.current) {
          mesh.material = activeFacetMat;
          mesh.scale.set(1.1, 1.05, 1.1);
        } else {
          mesh.material = darkStoneMat;
          mesh.scale.set(1, 1, 1);
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

      facetMeshes.forEach((m) => {
        m.geometry.dispose();
      });
      coreGeo.dispose();
      darkStoneMat.dispose();
      bronzeMat.dispose();
      activeFacetMat.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="services-3d-wrapper" aria-hidden="true">
      <div ref={mountRef} className="services-3d-canvas" />
      <div className="services-3d-glow" />
    </div>
  );
};
