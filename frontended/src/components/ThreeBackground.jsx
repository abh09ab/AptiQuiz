import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const currentMount = mountRef.current;
    if (!currentMount) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060812, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    currentMount.appendChild(renderer.domElement);

    // 1. ROTATING 3D MATHEMATICAL STRUCTURE (Wireframe Icosahedron & Neural Nodes)
    const icosahedronGeo = new THREE.IcosahedronGeometry(28, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const icosahedron = new THREE.Mesh(icosahedronGeo, wireframeMat);
    icosahedron.position.set(38, -4, -15);
    scene.add(icosahedron);

    // Inner Glowing Polyhedron
    const innerGeo = new THREE.DodecahedronGeometry(18, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const innerPoly = new THREE.Mesh(innerGeo, innerMat);
    icosahedron.add(innerPoly);

    // Orbiting Torus Ring
    const torusGeo = new THREE.TorusGeometry(36, 0.4, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    torusRing.rotation.x = Math.PI / 3;
    icosahedron.add(torusRing);

    // 2. FLOATING MATHEMATICAL PARTICLES FIELD
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8); // Cyan
    const color2 = new THREE.Color(0xa78bfa); // Violet
    const color3 = new THREE.Color(0x10b981); // Emerald

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 240;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160;

      const mixed = Math.random() < 0.4 ? color1 : Math.random() < 0.7 ? color2 : color3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. SPATIAL PERSPECTIVE GRID
    const gridHelper = new THREE.GridHelper(260, 26, 0x8b5cf6, 0x1e293b);
    gridHelper.position.y = -55;
    gridHelper.position.z = -10;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.16;
    scene.add(gridHelper);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 200);
    pointLight1.position.set(40, 20, 20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 200);
    pointLight2.position.set(-40, -20, 10);
    scene.add(pointLight2);

    // MOUSE PARALLAX
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      targetX = (event.clientX - windowHalfX) * 0.012;
      targetY = (event.clientY - windowHalfY) * 0.012;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // RESIZE LISTENER
    const handleResize = () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Slow elegant geometric rotation
      icosahedron.rotation.x = elapsedTime * 0.12;
      icosahedron.rotation.y = elapsedTime * 0.18;

      innerPoly.rotation.x = -elapsedTime * 0.2;
      innerPoly.rotation.y = -elapsedTime * 0.15;

      torusRing.rotation.z = elapsedTime * 0.25;

      // Particle subtle drift
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      // Subtle grid wave
      gridHelper.position.z = -10 + Math.sin(elapsedTime * 0.3) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      icosahedronGeo.dispose();
      wireframeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="three-background-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    />
  );
}
