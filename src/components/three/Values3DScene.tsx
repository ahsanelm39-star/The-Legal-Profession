import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Values3DScene.css';

gsap.registerPlugin(ScrollTrigger);

interface Values3DSceneProps {
  activeValueIndex: number;
}

export const Values3DScene: React.FC<Values3DSceneProps> = ({ activeValueIndex }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef<number>(activeValueIndex);
  activeIndexRef.current = activeValueIndex;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    let isDisposed = false;
    let animationFrameId: number;
    let isVisible = true;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.8);

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

    // Master Sculptural Triad Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Materials
    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: 0x111c2a,
      roughness: 0.4,
      metalness: 0.28,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xc8a86b,
      roughness: 0.22,
      metalness: 0.88,
    });

    const activeGlowMat = new THREE.MeshStandardMaterial({
      color: 0xe5ce9e,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x6e5223,
      emissiveIntensity: 0.55,
    });

    // 1. Ring of Trust (Outer Grand Ring)
    const trustRingGeo = new THREE.TorusGeometry(1.65, 0.045, 20, 80);
    const trustRing = new THREE.Mesh(trustRingGeo, bronzeMat.clone());
    trustRing.rotation.x = Math.PI / 4;
    masterGroup.add(trustRing);

    // 2. Ring of Precision (Inner Gyro Ring)
    const precRingGeo = new THREE.TorusGeometry(1.25, 0.038, 20, 80);
    const precRing = new THREE.Mesh(precRingGeo, bronzeMat.clone());
    precRing.rotation.y = Math.PI / 3;
    precRing.rotation.x = -Math.PI / 5;
    masterGroup.add(precRing);

    // 3. Monolith of Responsibility (Central Faceted Diamond Prism)
    const respPrismGeo = new THREE.OctahedronGeometry(0.75, 0);
    const respPrism = new THREE.Mesh(respPrismGeo, darkStoneMat.clone());
    respPrism.scale.set(0.85, 1.45, 0.85);
    masterGroup.add(respPrism);

    // Bronze Wireframe Cage around central diamond
    const wireGeo = new THREE.WireframeGeometry(respPrismGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xd0b783,
      transparent: true,
      opacity: 0.65,
    });
    const wireSegments = new THREE.LineSegments(wireGeo, wireMat);
    wireSegments.scale.set(0.88, 1.48, 0.88);
    masterGroup.add(wireSegments);

    // Ambient Lights
    const amb = new THREE.AmbientLight(0x131f32, 1.8);
    scene.add(amb);

    const dirKey = new THREE.DirectionalLight(0xf5e8c7, 2.6);
    dirKey.position.set(4, 6, 5);
    scene.add(dirKey);

    const dirFill = new THREE.DirectionalLight(0x42618a, 1.2);
    dirFill.position.set(-5, -2, -3);
    scene.add(dirFill);

    const coreLight = new THREE.PointLight(0xd0b783, 3.2, 5.0);
    coreLight.position.set(0, 0, 0);
    masterGroup.add(coreLight);

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
      targetTiltY = mouseX * 0.28;
      targetTiltX = -mouseY * 0.16;
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ScrollTrigger to rotate assembly
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        masterGroup.rotation.y = self.progress * 1.5;
        masterGroup.position.y = (self.progress - 0.5) * 0.4;
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

    const animate = () => {
      if (isDisposed) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const activeIdx = activeIndexRef.current;

      // Mouse Lerp
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      currentTiltY += (targetTiltY - currentTiltY) * 0.05;

      masterGroup.rotation.x = currentTiltX;
      masterGroup.rotation.z = Math.sin(elapsed * 0.3) * 0.04;

      // Continuous ambient rotation
      trustRing.rotation.z = elapsed * 0.25;
      precRing.rotation.z = -elapsed * 0.32;
      respPrism.rotation.y = elapsed * 0.2;
      wireSegments.rotation.y = elapsed * 0.2;

      // Highlight active element based on active value
      // 0 = Trust (trustRing)
      // 1 = Precision (precRing)
      // 2 = Responsibility (respPrism)
      if (activeIdx === 0) {
        trustRing.material = activeGlowMat;
        precRing.material = bronzeMat;
        respPrism.material = darkStoneMat;
        trustRing.scale.set(1.08, 1.08, 1.08);
        precRing.scale.set(1, 1, 1);
        respPrism.scale.set(0.85, 1.45, 0.85);
        coreLight.intensity = 3.6 + Math.sin(elapsed * 2.5) * 0.6;
      } else if (activeIdx === 1) {
        trustRing.material = bronzeMat;
        precRing.material = activeGlowMat;
        respPrism.material = darkStoneMat;
        trustRing.scale.set(1, 1, 1);
        precRing.scale.set(1.1, 1.1, 1.1);
        respPrism.scale.set(0.85, 1.45, 0.85);
        coreLight.intensity = 3.6 + Math.sin(elapsed * 2.5) * 0.6;
      } else {
        trustRing.material = bronzeMat;
        precRing.material = bronzeMat;
        respPrism.material = activeGlowMat;
        trustRing.scale.set(1, 1, 1);
        precRing.scale.set(1, 1, 1);
        respPrism.scale.set(0.95, 1.6, 0.95);
        coreLight.intensity = 4.2 + Math.sin(elapsed * 2.5) * 0.8;
      }

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

      trustRingGeo.dispose();
      precRingGeo.dispose();
      respPrismGeo.dispose();
      wireGeo.dispose();
      darkStoneMat.dispose();
      bronzeMat.dispose();
      activeGlowMat.dispose();
      wireMat.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="values-3d-wrapper" aria-hidden="true">
      <div ref={mountRef} className="values-3d-canvas" />
      <div className="values-3d-glow" />
    </div>
  );
};
