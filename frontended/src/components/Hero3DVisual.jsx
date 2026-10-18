import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Zap, Trophy, Brain, Target, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero3DVisual({ onStartPractice, onExploreTests }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scene
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 460;
    const height = currentMount.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    currentMount.appendChild(renderer.domElement);

    // CENTRAL 3D MATHEMATICAL CRYSTAL (Octahedron + Wireframe cage + Icosahedron Core)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Faceted Gemstone Core
    const coreGeo = new THREE.OctahedronGeometry(6.2, 0);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      emissive: 0x1e1b4b,
      specular: 0x38bdf8,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Outer Wireframe Cage (Icosahedron)
    const cageGeo = new THREE.IcosahedronGeometry(8.6, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainGroup.add(cageMesh);

    // 3. Orbiting Dual Rings (Gimbal mathematical rings)
    const ring1Geo = new THREE.TorusGeometry(10.5, 0.14, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 4;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(12, 0.12, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.55,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3;
    mainGroup.add(ring2);

    // 4. Floating Vertex Node Spheres
    const nodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
    const nodesGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(Math.cos(angle) * 10.5, Math.sin(angle) * 10.5, 0);
      ring1.add(nodeMesh);
    }
    mainGroup.add(nodesGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight1.position.set(10, 15, 15);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0xa855f7, 3, 40);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // Interactive mouse rotation drag/hover
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseSpeed = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        mouseSpeed = { x: deltaX * 0.005, y: deltaY * 0.005 };
        mainGroup.rotation.y += mouseSpeed.x;
        mainGroup.rotation.x += mouseSpeed.y;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        const dt = clock.getDelta();
        const time = clock.getElapsedTime();

        if (!isDragging) {
          mainGroup.rotation.y += 0.4 * dt;
          mainGroup.rotation.x += 0.2 * dt;
        }

        ring1.rotation.z += 0.5 * dt;
        ring2.rotation.x += 0.4 * dt;

        // Subtle breathing / pulsating scale
        const scale = 1 + Math.sin(time * 1.5) * 0.03;
        coreMesh.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-3d-showcase">
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="hero-canvas-wrapper"
        title="Interactive 3D Structure — Drag to rotate"
      />

      {/* Floating HUD Badge 1: Top-Right XP & ELO */}
      <div className="hud-badge hud-top-right">
        <div className="hud-icon-wrap" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>
          <Trophy size={18} />
        </div>
        <div>
          <span className="hud-label">NATIONAL ELO</span>
          <strong className="hud-val" style={{ color: "#34d399" }}>2,150 • Grandmaster</strong>
        </div>
        <span className="hud-tag">TOP 1%</span>
      </div>

      {/* Floating HUD Badge 2: Left Active Problem Solving */}
      <div className="hud-badge hud-left-mid">
        <div className="hud-icon-wrap" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}>
          <Brain size={18} />
        </div>
        <div>
          <span className="hud-label">COGNITIVE SPEED</span>
          <strong className="hud-val" style={{ color: "#67e8f9" }}>1.2s Avg Response</strong>
        </div>
      </div>

      {/* Floating HUD Badge 3: Bottom Placement Ready */}
      <div className="hud-badge hud-bottom-center">
        <div className="hud-icon-wrap" style={{ background: "rgba(168, 85, 247, 0.2)", color: "#c084fc" }}>
          <Sparkles size={18} />
        </div>
        <div>
          <span className="hud-label">AI QUESTION ENGINE</span>
          <strong className="hud-val">Adaptive Difficulty Active</strong>
        </div>
        <span className="hud-pulse" />
      </div>

      {/* Interactive Quick Practice Card Overlay */}
      <div className="hero-interactive-card">
        <div className="interactive-card-header">
          <span className="card-badge"><Zap size={14} /> LIVE PRACTICE PREVIEW</span>
          <span className="card-timer">⏱ 00:15</span>
        </div>

        <p className="interactive-card-q">
          If 15% of a number is 45, what is the number?
        </p>

        <div className="interactive-card-options">
          <button className="sample-opt" onClick={onStartPractice}>
            <span>A</span> 150
          </button>
          <button className="sample-opt" onClick={onStartPractice}>
            <span>B</span> 250
          </button>
          <button className="sample-opt correct-hint" onClick={onStartPractice}>
            <span>C</span> 300 <Target size={14} />
          </button>
          <button className="sample-opt" onClick={onStartPractice}>
            <span>D</span> 350
          </button>
        </div>

        <div className="interactive-card-footer">
          <span><ShieldCheck size={14} /> Quantitative Aptitude</span>
          <button className="start-chip" onClick={onStartPractice}>
            Try Full Test →
          </button>
        </div>
      </div>
    </div>
  );
}
