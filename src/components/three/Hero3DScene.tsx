import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeFallback } from './ThreeFallback';
import './Hero3DScene.css';

gsap.registerPlugin(ScrollTrigger);

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvasTest = document.createElement('canvas');
      const gl = canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    let isDisposed = false;
    let animationFrameId: number;
    let isVisible = true;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080b12, 0.045);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 7.2);

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Materials
    // 1. Dark Basalt / Graphite Stone
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x121b29,
      roughness: 0.42,
      metalness: 0.28,
    });

    // 2. Brushed Bronze / Gold Accent
    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8a86b,
      roughness: 0.22,
      metalness: 0.88,
    });

    // 3. Highlight Dark Metallic
    const darkMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c283a,
      roughness: 0.35,
      metalness: 0.65,
    });

    // --- ARCHITECTURAL PORTAL GEOMETRIES ---

    // Plinth / Stepped Base
    const baseStep1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 1.6), stoneMaterial);
    baseStep1.position.y = -1.9;
    masterGroup.add(baseStep1);

    const baseBronzeTrim1 = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.03, 1.64), bronzeMaterial);
    baseBronzeTrim1.position.y = -1.82;
    masterGroup.add(baseBronzeTrim1);

    const baseStep2 = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.16, 1.3), stoneMaterial);
    baseStep2.position.y = -1.74;
    masterGroup.add(baseStep2);

    const baseBronzeTrim2 = new THREE.Mesh(new THREE.BoxGeometry(3.14, 0.03, 1.34), bronzeMaterial);
    baseBronzeTrim2.position.y = -1.65;
    masterGroup.add(baseBronzeTrim2);

    // Monumental Twin Pillars
    const columnGeo = new THREE.BoxGeometry(0.48, 3.1, 0.68);
    const columnBronzeTrimGeo = new THREE.BoxGeometry(0.52, 0.08, 0.72);

    // Left Column
    const leftColumn = new THREE.Mesh(columnGeo, stoneMaterial);
    leftColumn.position.set(-1.18, 0, 0);
    masterGroup.add(leftColumn);

    const leftColBaseCap = new THREE.Mesh(columnBronzeTrimGeo, bronzeMaterial);
    leftColBaseCap.position.set(-1.18, -1.5, 0);
    masterGroup.add(leftColBaseCap);

    const leftColTopCap = new THREE.Mesh(columnBronzeTrimGeo, bronzeMaterial);
    leftColTopCap.position.set(-1.18, 1.5, 0);
    masterGroup.add(leftColTopCap);

    // Left Column Vertical Bronze Inlay
    const leftColInlay = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.8, 0.7), bronzeMaterial);
    leftColInlay.position.set(-1.18, 0, 0);
    masterGroup.add(leftColInlay);

    // Right Column
    const rightColumn = new THREE.Mesh(columnGeo, stoneMaterial);
    rightColumn.position.set(1.18, 0, 0);
    masterGroup.add(rightColumn);

    const rightColBaseCap = new THREE.Mesh(columnBronzeTrimGeo, bronzeMaterial);
    rightColBaseCap.position.set(1.18, -1.5, 0);
    masterGroup.add(rightColBaseCap);

    const rightColTopCap = new THREE.Mesh(columnBronzeTrimGeo, bronzeMaterial);
    rightColTopCap.position.set(1.18, 1.5, 0);
    masterGroup.add(rightColTopCap);

    // Right Column Vertical Bronze Inlay
    const rightColInlay = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.8, 0.7), bronzeMaterial);
    rightColInlay.position.set(1.18, 0, 0);
    masterGroup.add(rightColInlay);

    // Entablature / Architrave (Monumental Top)
    const architraveLower = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.22, 1.2), stoneMaterial);
    architraveLower.position.y = 1.68;
    masterGroup.add(architraveLower);

    const architraveBronze = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.04, 1.24), bronzeMaterial);
    architraveBronze.position.y = 1.8;
    masterGroup.add(architraveBronze);

    const architraveMain = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.32, 1.4), darkMetalMaterial);
    architraveMain.position.y = 1.98;
    masterGroup.add(architraveMain);

    const pedimentBronze = new THREE.Mesh(new THREE.BoxGeometry(3.58, 0.05, 1.44), bronzeMaterial);
    pedimentBronze.position.y = 2.16;
    masterGroup.add(pedimentBronze);

    // --- CENTRAL EQUILIBRIUM & ORBITAL GYRO SYSTEM ---
    const innerCoreGroup = new THREE.Group();
    innerCoreGroup.position.set(0, 0, 0);
    masterGroup.add(innerCoreGroup);

    // Central Faceted Monolith / Diamond Prism
    const prismGeo = new THREE.OctahedronGeometry(0.55, 0);
    const prismMesh = new THREE.Mesh(prismGeo, stoneMaterial);
    prismMesh.scale.set(0.9, 1.5, 0.9);
    innerCoreGroup.add(prismMesh);

    // Core Bronze Wireframe Cage
    const wireframeGeo = new THREE.WireframeGeometry(prismGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xd0b783,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.65,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframeLine.scale.set(0.92, 1.52, 0.92);
    innerCoreGroup.add(wireframeLine);

    // Dual Bronze Orbital Gyro-Rings
    const ring1Geo = new THREE.TorusGeometry(1.02, 0.022, 16, 80);
    const ring1 = new THREE.Mesh(ring1Geo, bronzeMaterial);
    ring1.rotation.x = Math.PI / 4;
    innerCoreGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.22, 0.018, 16, 80);
    const ring2 = new THREE.Mesh(ring2Geo, bronzeMaterial);
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 6;
    innerCoreGroup.add(ring2);

    // Floating Atmospheric Gold Dust Particles
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xd0b783,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    masterGroup.add(particleSystem);

    // --- LIGHTING SETUP ---
    // Ambient Twilight
    const ambientLight = new THREE.AmbientLight(0x131f30, 1.6);
    scene.add(ambientLight);

    // Directional Key Light (Warm Gold Sun)
    const keyLight = new THREE.DirectionalLight(0xf2e4c8, 2.6);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Directional Rim/Fill Light (Architectural Cool Graphite Blue)
    const rimLight = new THREE.DirectionalLight(0x4a6a96, 1.4);
    rimLight.position.set(-6, -2, -3);
    scene.add(rimLight);

    // Inner Core Glow Point Light
    const coreLight = new THREE.PointLight(0xd0b783, 3.2, 5.5);
    coreLight.position.set(0, 0, 0);
    innerCoreGroup.add(coreLight);

    // Top Down Spotlight on Portal Arch
    const topLight = new THREE.PointLight(0xb99a65, 1.8, 6.0);
    topLight.position.set(0, 3.2, 1.5);
    scene.add(topLight);

    // --- INTERACTION & ANIMATION VARIABLES ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = -0.15; // Subtle natural 3/4 architectural angle
    let currentRotationX = 0;
    let currentRotationY = -0.15;
    let scrollProgress = 0;

    // Mouse Tracking
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);

      mouseX = Math.max(-1, Math.min(1, normX));
      mouseY = Math.max(-1, Math.min(1, normY));

      targetRotationY = -0.15 + mouseX * 0.28;
      targetRotationX = -mouseY * 0.18;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Touch Interaction
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaX = (e.touches[0].clientX - touchStartX) / window.innerWidth;
        const deltaY = (e.touches[0].clientY - touchStartY) / window.innerHeight;
        targetRotationY = -0.15 + deltaX * 0.4;
        targetRotationX = -deltaY * 0.25;
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // --- GSAP SCROLLTRIGGER INTEGRATION ---
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });

    // Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Intersection Observer to pause rendering when offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // --- RENDER LOOP ---
    let clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp for Mouse Parallax
      currentRotationX += (targetRotationX - currentRotationX) * 0.045;
      currentRotationY += (targetRotationY - currentRotationY) * 0.045;

      // Base Structure Rotation + Scroll Progression
      masterGroup.rotation.y = currentRotationY + scrollProgress * 0.8;
      masterGroup.rotation.x = currentRotationX + scrollProgress * 0.2;
      masterGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.06 - scrollProgress * 0.9;
      masterGroup.position.z = -scrollProgress * 1.5;

      // Inner Core & Gyro Continuous Ambient Movement
      innerCoreGroup.rotation.y = elapsedTime * 0.25;
      ring1.rotation.z = elapsedTime * 0.35;
      ring1.rotation.x = Math.PI / 4 + Math.sin(elapsedTime * 0.5) * 0.15;
      ring2.rotation.z = -elapsedTime * 0.28;
      ring2.rotation.y = Math.PI / 3 + Math.cos(elapsedTime * 0.4) * 0.12;

      // Ambient Gold Dust Drift
      particleSystem.rotation.y = elapsedTime * 0.03;

      // Dynamic Core Light Pulse
      coreLight.intensity = 2.8 + Math.sin(elapsedTime * 2.2) * 0.5;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // --- CLEANUP ---
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scrollTriggerInstance.kill();

      // Dispose Geometries & Materials
      [baseStep1, baseBronzeTrim1, baseStep2, baseBronzeTrim2, leftColumn, leftColBaseCap, leftColTopCap, leftColInlay, rightColumn, rightColBaseCap, rightColTopCap, rightColInlay, architraveLower, architraveBronze, architraveMain, pedimentBronze, prismMesh, wireframeLine, ring1, ring2, particleSystem].forEach(
        (obj) => {
          if (obj.geometry) obj.geometry.dispose();
        }
      );

      stoneMaterial.dispose();
      bronzeMaterial.dispose();
      darkMetalMaterial.dispose();
      wireframeMat.dispose();
      particleMat.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return <ThreeFallback />;
  }

  return (
    <div className="three-scene-wrapper">
      <div ref={mountRef} className="three-scene-canvas" />
      <div className={`three-loader-fade ${isLoaded ? 'loaded' : ''}`} />
      <div className="three-ambient-accent" />
    </div>
  );
};
