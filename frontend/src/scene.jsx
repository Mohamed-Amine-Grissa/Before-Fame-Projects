/* ——— ThreeScene · Tesla WebGL hero background ——— */
/* Three.js particle field + morphing geometry + amber road tunnel */

import { useEffect, useRef } from "react";
import * as THREE from "three";

const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ThreeScene({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;";
    mount.appendChild(renderer.domElement);

    // ── Scene ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0b);
    scene.fog = new THREE.FogExp2(0x0a0a0b, 0.012);

    // ── Camera ─────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 1.6, 14);
    camera.lookAt(0, 0, 0);

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(6, 10, 8);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xc0d0ff, 0.4); // cool fill
    dirLight2.position.set(-8, -4, 6);
    scene.add(dirLight2);

    const emberLight = new THREE.PointLight(0xe82127, 2.2, 18); // Tesla red
    emberLight.position.set(-2, 1.5, 4);
    scene.add(emberLight);

    // ── Particle field ─────────────────────────────────────────
    const PARTICLE_COUNT = 2400;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 90;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 70 - 5;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf4f1ec,
      size: 0.065,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Icosahedron (metallic centrepiece) ─────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xa8a9ad,
      metalness: 0.82,
      roughness: 0.18,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(4.5, 0.5, -2);
    scene.add(ico);

    // Edges overlay — structural feel
    const edgesGeo = new THREE.EdgesGeometry(icoGeo);
    const edgesMat = new THREE.LineBasicMaterial({ color: 0x3a3a40, transparent: true, opacity: 0.55 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMat);
    ico.add(edges); // child of ico → inherits rotation

    // ── Secondary geometry — torus knot ───────────────────────
    const knotGeo = new THREE.TorusKnotGeometry(0.9, 0.25, 96, 12, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x3a3a40,
      metalness: 0.95,
      roughness: 0.1,
      wireframe: false,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(-5, -0.5, -3);
    scene.add(knot);

    // ── Road perspective lines (vanishing point tunnel) ────────
    const roadLineMat = new THREE.LineBasicMaterial({ color: 0x2a2a2e, transparent: true, opacity: 0.7 });
    const vanishPt = new THREE.Vector3(0, -3.5, -40);
    const ROAD_LINE_GEO = [];
    for (let i = -6; i <= 6; i++) {
      const g = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2.5, -2.8, 10),
        vanishPt,
      ]);
      scene.add(new THREE.Line(g, roadLineMat));
      ROAD_LINE_GEO.push(g);
    }

    // ── Amber dashes (scrolling road markings) ─────────────────
    const dashMat = new THREE.MeshStandardMaterial({
      color: 0xe34e2c,
      emissive: 0xe34e2c,
      emissiveIntensity: 1.2,
    });
    const DASH_COUNT = 10;
    const dashes = Array.from({ length: DASH_COUNT }, (_, d) => {
      const g = new THREE.PlaneGeometry(0.09, 0.65);
      const m = new THREE.Mesh(g, dashMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(0, -2.75, 8 - d * 3.5);
      scene.add(m);
      return m;
    });

    // ── Mouse tracking ──────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Resize ─────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── RAF loop ───────────────────────────────────────────────
    let raf;
    let paused = false;
    const clock = new THREE.Clock();

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const loop = () => {
      if (paused) return;
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      if (!REDUCED) {
        // Particle drift
        particles.rotation.y = t * 0.025;
        particles.rotation.x = Math.sin(t * 0.007) * 0.08;

        // Icosahedron spin
        ico.rotation.y = t * 0.14;
        ico.rotation.x = t * 0.06;
        ico.position.y = 0.5 + Math.sin(t * 0.5) * 0.3;

        // Torus knot slow tumble
        knot.rotation.x = t * 0.11;
        knot.rotation.z = t * 0.07;

        // Amber road dashes scroll toward viewer
        dashes.forEach((d, i) => {
          const span = DASH_COUNT * 3.5;
          d.position.z = ((8 - i * 3.5 + t * 5) % span) - 10;
        });

        // Ember light orbit + pulse
        emberLight.intensity = 1.8 + Math.sin(t * 2.6) * 0.5;
        emberLight.position.x = Math.sin(t * 0.38) * 5 - 2;
        emberLight.position.z = Math.cos(t * 0.38) * 4 + 3;

        // Camera mouse parallax (smooth lerp)
        camera.position.x += (mouse.x * 1.8 - camera.position.x) * 0.035;
        camera.position.y += (-mouse.y * 0.9 + 1.6 - camera.position.y) * 0.035;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    loop();

    // ── Cleanup / dispose ──────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);

      [pGeo, icoGeo, edgesGeo, knotGeo, ...ROAD_LINE_GEO].forEach(g => g.dispose());
      [pMat, icoMat, edgesMat, knotMat, roadLineMat, dashMat].forEach(m => m.dispose());
      dashes.forEach(d => d.geometry.dispose());
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      aria-hidden="true"
    />
  );
}
