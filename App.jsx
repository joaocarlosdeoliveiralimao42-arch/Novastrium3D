import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Activity, Compass, Globe2, MapPin, Mountain,
  Radio, Search, ShieldAlert, Telescope, Waves,
  ZoomIn, ZoomOut, Info, Satellite, Snowflake, Route, Target
} from "lucide-react";
import { MARS_REGIONS, MARS_DATA } from "./marsData";
import MarsImagery from "./MarsImagery";
import MarswalkPlanner from "./MarswalkPlanner.jsx";
import ScientificTargets from "./ScientificTargets.jsx";
import AstroNexusAI from "./src/AstroNexusAI.jsx";
function positionOnMars(latitude, longitude, radius = 2.02) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);

  return new THREE.Vector3(
    -radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon)
  );
}

function createNaturalMarsTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(canvas.width, canvas.height);

  const rand = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  };

  for (let y = 0; y < canvas.height; y++) {
    const latBand = Math.cos((y / canvas.height) * Math.PI * 2);

    for (let x = 0; x < canvas.width; x++) {
      const broad =
        Math.sin(x * 0.006 + Math.sin(y * 0.009) * 2.4) * 0.5 +
        Math.cos(y * 0.014 + x * 0.002) * 0.28;

      const detail =
        (rand(Math.floor(x / 5), Math.floor(y / 5)) - 0.5) * 0.42 +
        (rand(Math.floor(x / 19), Math.floor(y / 19)) - 0.5) * 0.34;

      const darkTerrain = Math.max(
        0,
        Math.sin(x * 0.004 + y * 0.012) * 0.5 + broad * 0.4
      );

      const v = broad * 17 + detail * 36;
      const i = (y * canvas.width + x) * 4;

      image.data[i] = Math.max(45, Math.min(205, 157 + v - darkTerrain * 45));
      image.data[i + 1] = Math.max(
        24,
        Math.min(139, 76 + v * 0.58 - darkTerrain * 34 + latBand * 5)
      );
      image.data[i + 2] = Math.max(
        17,
        Math.min(105, 48 + v * 0.36 - darkTerrain * 24)
      );
      image.data[i + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);

  const provinces = [
    [280, 380, 260, 120, "rgba(55,31,27,0.28)"],
    [780, 520, 330, 145, "rgba(220,137,91,0.20)"],
    [1330, 330, 300, 115, "rgba(58,34,30,0.25)"],
    [1740, 650, 260, 140, "rgba(225,145,95,0.16)"],
    [1040, 170, 230, 80, "rgba(42,34,33,0.18)"]
  ];

  provinces.forEach(([x, y, rx, ry, color]) => {
    const g = ctx.createRadialGradient(x, y, 5, x, y, Math.max(rx, ry));
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  for (let i = 0; i < 230; i++) {
    const x = rand(i + 3, 11) * canvas.width;
    const y = rand(i + 19, 31) * canvas.height;
    const r = 2 + Math.pow(rand(i + 47, 71), 2) * 24;

    const g = ctx.createRadialGradient(
      x - r * 0.18,
      y - r * 0.2,
      r * 0.12,
      x,
      y,
      r
    );

    g.addColorStop(0, "rgba(42,27,24,0.20)");
    g.addColorStop(0.68, "rgba(55,31,27,0.12)");
    g.addColorStop(0.82, "rgba(238,163,112,0.22)");
    g.addColorStop(1, "rgba(49,28,24,0.04)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createFallbackTexture() {
  return createNaturalMarsTexture();
}

function loadMolaTexture() {
  return new Promise((resolve) => {
    const base = MARS_DATA.baseLayer.url;
    const loader = new THREE.TextureLoader();
    const images = [];
    let completed = 0;
    let finished = false;

    const fallback = () => {
      if (finished) return;
      finished = true;
      resolve({ texture: createFallbackTexture(), real: false });
    };

    [0, 1].forEach((column) => {
      loader.load(
        `${base}${column}.jpg`,
        (loaded) => {
          if (finished) return;

          images[column] = loaded.image;
          completed++;

          if (completed === 2) {
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 256;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(images[0], 0, 0, 256, 256);
            ctx.drawImage(images[1], 256, 0, 256, 256);

            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;

            finished = true;
            resolve({ texture, real: true });
          }
        },
        undefined,
        fallback
      );
    });

    setTimeout(fallback, 15000);
  });
}

function MarsGlobe({
  selectedRegion,
  onSelectRegion,
  onTextureStatus,
  activeLayer,
  onZoomReady,
  routeData,
  activeOverlay,
  selectedTarget
}) {
  const mountRef = useRef(null);
  const planetRef = useRef(null);
  const textureRef = useRef(null);
  const controlsRef = useRef(null);
  const layerRef = useRef(activeLayer);
  const routeGroupRef = useRef(null);
  const overlayGroupRef = useRef(null);
  const targetGroupRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#080b12");

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    controlsRef.current = controls;

    onZoomReady({
      in: () => {
        controls.dollyIn(1.25);
        controls.update();
      },
      out: () => {
        controls.dollyOut(1.25);
        controls.update();
      }
    });

    scene.add(new THREE.AmbientLight("#a8b7d1", 1.15));

    const sun = new THREE.DirectionalLight("#fff0dc", 2.5);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(2, 96, 96),
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 1,
        metalness: 0
      })
    );

    scene.add(planet);
    planetRef.current = planet;

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.08, 64, 64),
      new THREE.MeshBasicMaterial({
        color: "#d56d45",
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide
      })
    );

    scene.add(atmosphere);

    const starPositions = [];

    for (let i = 0; i < 1800; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45
      );
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );

    scene.add(new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: "#dce8ff",
        size: 0.025,
        transparent: true,
        opacity: 0.8
      })
    ));

    const markerObjects = [];

    MARS_REGIONS.forEach((region) => {
      const marker = new THREE.Group();

      const position = positionOnMars(
        region.latitude,
        region.longitude,
        2.025
      );

      marker.position.copy(position);
      marker.lookAt(position.clone().multiplyScalar(3));

      const color =
        region.id === "arcadia" ? "#63d8ff" :
        region.id === "deuteronilus" ? "#a78bfa" :
        "#f5b45b";

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 20, 20),
        new THREE.MeshBasicMaterial({ color })
      );

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.085, 0.008, 8, 40),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.9
        })
      );

      marker.add(dot, ring);
      marker.userData.regionId = region.id;
      planet.add(marker);
      markerObjects.push(marker);
    });

    const routeGroup = new THREE.Group();
    planet.add(routeGroup);
    routeGroupRef.current = routeGroup;

    const overlayGroup = new THREE.Group();
    planet.add(overlayGroup);
    overlayGroupRef.current = overlayGroup;

    const targetGroup = new THREE.Group();
    planet.add(targetGroup);
    targetGroupRef.current = targetGroup;

    loadMolaTexture().then(({ texture, real }) => {
      if (!planetRef.current) {
        texture.dispose();
        return;
      }

      textureRef.current = texture;

      if (layerRef.current === "mola") {
        planet.material.map = texture;
        planet.material.color.set("#ffffff");
        planet.material.needsUpdate = true;
      }

      onTextureStatus(real);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDown = null;

    const handlePointerDown = (event) => {
      pointerDown = {
        x: event.clientX,
        y: event.clientY
      };
    };

    const handleClick = (event) => {
      if (!pointerDown) return;

      const movement = Math.hypot(
        event.clientX - pointerDown.x,
        event.clientY - pointerDown.y
      );

      pointerDown = null;
      if (movement > 8) return;

      const bounds = renderer.domElement.getBoundingClientRect();

      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersections = raycaster.intersectObjects(
        markerObjects,
        true
      );

      if (intersections.length) {
        let object = intersections[0].object;

        while (object && !object.userData.regionId) {
          object = object.parent;
        }

        if (object?.userData.regionId) {
          onSelectRegion(object.userData.regionId);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("click", handleClick);

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      renderer.domElement.removeEventListener("click", handleClick);

      controls.dispose();
      renderer.dispose();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });

      textureRef.current?.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      planetRef.current = null;
      controlsRef.current = null;
      textureRef.current = null;
      routeGroupRef.current = null;
      overlayGroupRef.current = null;
      targetGroupRef.current = null;

      onZoomReady(null);
    };
  }, [onSelectRegion, onTextureStatus, onZoomReady]);

  useEffect(() => {
    layerRef.current = activeLayer;

    const planet = planetRef.current;
    if (!planet) return;

    if (activeLayer === "mola" && textureRef.current) {
      planet.material.map = textureRef.current;
      planet.material.color.set("#ffffff");
    } else if (activeLayer === "natural") {
      if (!planet.userData.naturalTexture) {
        planet.userData.naturalTexture = createNaturalMarsTexture();
      }

      planet.material.map = planet.userData.naturalTexture;
      planet.material.color.set("#ffffff");
    } else {
      planet.material.map = null;
      planet.material.color.set("#a95337");
    }

    planet.material.needsUpdate = true;
  }, [activeLayer]);

  useEffect(() => {
    const group = routeGroupRef.current;
    if (!group) return;

    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);

      child.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });
    }

    if (!routeData?.start || !routeData?.end) return;

    const start = positionOnMars(
      routeData.start.latitude,
      routeData.start.longitude,
      2.035
    );

    const end = positionOnMars(
      routeData.end.latitude,
      routeData.end.longitude,
      2.035
    );

    const startDirection = start.clone().normalize();
    const endDirection = end.clone().normalize();

    const points = [];

    for (let i = 0; i <= 100; i++) {
      const t = i / 100;

      const direction = new THREE.Vector3()
        .copy(startDirection)
        .lerp(endDirection, t)
        .normalize();

      points.push(direction.multiplyScalar(2.035));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 100, 0.012, 8, false);

    const line = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: "#63e6ff",
        transparent: true,
        opacity: 0.95
      })
    );

    group.add(line);

    const addEndpoint = (position, color) => {
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 20, 20),
        new THREE.MeshBasicMaterial({ color })
      );

      marker.position.copy(position);
      group.add(marker);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.09, 0.009, 8, 40),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.9
        })
      );

      ring.position.copy(position);
      ring.lookAt(position.clone().multiplyScalar(3));
      group.add(ring);
    };

    addEndpoint(start, "#63d8ff");
    addEndpoint(end, "#ffad60");
  }, [routeData]);

  useEffect(() => {
    const group = overlayGroupRef.current;
    if (!group) return;

    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);

      child.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });
    }

    if (activeOverlay === "none") return;

    const addSurfaceRegion = (
      latitude,
      longitude,
      radiusKm,
      color,
      opacity = 0.42
    ) => {
      const centerLat = THREE.MathUtils.degToRad(latitude);
      const centerLon = THREE.MathUtils.degToRad(longitude);
      const angularRadius = radiusKm / 3389.5;
      const center = positionOnMars(latitude, longitude, 2.018);
      const vertices = [center.x, center.y, center.z];
      const segments = 72;
      const boundary = [];

      for (let i = 0; i <= segments; i++) {
        const bearing = (i / segments) * Math.PI * 2;

        const lat = Math.asin(
          Math.sin(centerLat) * Math.cos(angularRadius) +
          Math.cos(centerLat) * Math.sin(angularRadius) * Math.cos(bearing)
        );

        const lon = centerLon + Math.atan2(
          Math.sin(bearing) * Math.sin(angularRadius) * Math.cos(centerLat),
          Math.cos(angularRadius) - Math.sin(centerLat) * Math.sin(lat)
        );

        const point = positionOnMars(
          THREE.MathUtils.radToDeg(lat),
          THREE.MathUtils.radToDeg(lon),
          2.022
        );

        boundary.push(point);
        vertices.push(point.x, point.y, point.z);
      }

      const indices = [];

      for (let i = 1; i <= segments; i++) {
        indices.push(0, i, i + 1);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );

      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      const patch = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          depthTest: true
        })
      );

      patch.renderOrder = 5;
      group.add(patch);

      const outlinePoints = boundary.map(
        (point) => point.clone().multiplyScalar(1.004)
      );

      const outlineGeometry = new THREE.BufferGeometry().setFromPoints(
        outlinePoints
      );

      const outline = new THREE.LineLoop(
        outlineGeometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.98,
          depthWrite: false
        })
      );

      outline.renderOrder = 6;
      group.add(outline);

      const centerMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 18, 18),
        new THREE.MeshBasicMaterial({ color, depthWrite: false })
      );

      centerMarker.position.copy(
        positionOnMars(latitude, longitude, 2.045)
      );

      centerMarker.renderOrder = 7;
      group.add(centerMarker);
    };

    if (activeOverlay === "ice") {
      addSurfaceRegion(46.0, 190.0, 620, "#4bdcff", 0.48);
      addSurfaceRegion(40.0, 25.0, 470, "#69e8ff", 0.40);
    }

    if (activeOverlay === "hazards") {
      addSurfaceRegion(40.0, 25.0, 510, "#ffb347", 0.38);
      addSurfaceRegion(18.4, 77.7, 390, "#ff655f", 0.42);
      addSurfaceRegion(46.0, 190.0, 440, "#ff9b52", 0.34);
    }
  }, [activeOverlay]);

  useEffect(() => {
    const group = targetGroupRef.current;
    if (!group) return;

    while (group.children.length) {
      const child = group.children[0];
      group.remove(child);

      child.traverse((object) => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materials.forEach((material) => material.dispose());
        }
      });
    }

    if (!selectedTarget) return;

    const position = positionOnMars(
      selectedTarget.latitude,
      selectedTarget.longitude,
      2.065
    );

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 24, 24),
      new THREE.MeshBasicMaterial({
        color: selectedTarget.color || "#ffffff",
        depthTest: false
      })
    );

    marker.position.copy(position);
    marker.renderOrder = 10;
    group.add(marker);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.14, 0.012, 10, 48),
      new THREE.MeshBasicMaterial({
        color: selectedTarget.color || "#ffffff",
        transparent: true,
        opacity: 0.95,
        depthTest: false
      })
    );

    ring.position.copy(position);
    ring.lookAt(position.clone().multiplyScalar(3));
    ring.renderOrder = 10;
    group.add(ring);
  }, [selectedTarget]);

  useEffect(() => {
    const controls = controlsRef.current;
    const camera = controls?.object;

    if (!controls || !camera) return;

    const region = MARS_REGIONS.find(
      (item) => item.id === selectedRegion
    );

    if (!region) return;

    const direction = positionOnMars(
      region.latitude,
      region.longitude,
      1
    ).normalize();

    controls.autoRotate = false;
    controls.target.copy(direction.clone().multiplyScalar(1.8));
    camera.position.copy(direction.clone().multiplyScalar(4.4));
    controls.update();
  }, [selectedRegion]);

  return <div className="globe-canvas" ref={mountRef} />;
}

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState("arcadia");
  const [textureLoaded, setTextureLoaded] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState("mola");
  const [zoomActions, setZoomActions] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [activeOverlay, setActiveOverlay] = useState("none");
  const [selectedTarget, setSelectedTarget] = useState(null);

  const handleSelectRegion = useCallback((id) => {
    setSelectedRegion(id);
    setActiveTab("overview");
  }, []);

  const handleTextureStatus = useCallback((loaded) => {
    setTextureLoaded(loaded);
  }, []);

  const handleZoomReady = useCallback((actions) => {
    setZoomActions(() => actions);
  }, []);

  const handleRouteChange = useCallback((route) => {
    setRouteData(route);
  }, []);

  const handleTargetSelect = useCallback((target) => {
    setSelectedTarget(target);
    setSelectedRegion(target.regionId);
    setActiveTab("science");
  }, []);

  const region =
    MARS_REGIONS.find((item) => item.id === selectedRegion) ||
    MARS_REGIONS[0];

  const filteredRegions = MARS_REGIONS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-symbol">
            <Globe2 size={23} />
          </div>

          <div>
            <h1>NOVASTRIUM</h1>
            <span>MARS EXPLORATION SYSTEM</span>
          </div>
        </div>

        <div className="top-status">
          <span className="status-dot" />
          <span>MISSION CONTROL</span>
          <span className="top-divider" />
          <span>NASA SPACE APPS 2026</span>
        </div>
      </header>

      <section className="dashboard">
        <aside className="left-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">PLANETARY DATABASE</span>
              <h2>Regiões de Marte</h2>
            </div>
            <Compass size={20} />
          </div>

          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar região..."
            />
          </div>

          <div className="region-list">
            {filteredRegions.map((item) => (
              <button
                key={item.id}
                className={`region-card ${
                  selectedRegion === item.id ? "selected" : ""
                }`}
                onClick={() => handleSelectRegion(item.id)}
              >
                <div className={`region-icon ${item.id}`}>
                  <MapPin size={19} />
                </div>

                <div className="region-card-text">
                  <strong>{item.name}</strong>
                  <span>{item.subtitle}</span>
                  <small>
                    {item.latitude.toFixed(1)}° · {item.longitude.toFixed(1)}°
                  </small>
                </div>

                <span className="region-arrow">›</span>
              </button>
            ))}

            {filteredRegions.length === 0 && (
              <p className="empty-search">Nenhuma região encontrada.</p>
            )}
          </div>

          <div className="left-panel-footer">
            <div className="footer-icon">
              <Radio size={18} />
            </div>

            <div>
              <strong>Exploração planetária</strong>
              <span>Dados e referências científicas</span>
            </div>
          </div>
        </aside>

        <section className="center-panel">
          <div className="map-header">
            <div>
              <span className="eyebrow">VISUALIZAÇÃO PLANETÁRIA</span>
              <h2>Mapa 3D de Marte</h2>
            </div>

            <div className="map-controls-label">
              <span className="live-dot" />
              GLOBO INTERATIVO
            </div>
          </div>

          <div className="globe-container">
            <MarsGlobe
              selectedRegion={selectedRegion}
              onSelectRegion={handleSelectRegion}
              onTextureStatus={handleTextureStatus}
              activeLayer={activeLayer}
              onZoomReady={handleZoomReady}
              routeData={routeData}
              activeOverlay={activeOverlay}
              selectedTarget={selectedTarget}
            />

            <div className="globe-label top-left">
              <span>PLANETA</span>
              <strong>MARTE</strong>
            </div>

            <div className="globe-label top-right">
              <span>CAMADA ATIVA</span>
              <strong>
                {activeOverlay === "ice"
                  ? "INDICADORES DE GELO"
                  : activeOverlay === "hazards"
                    ? "FATORES DE ATENÇÃO"
                    : activeLayer === "mola"
                      ? "MOLA GLOBAL"
                      : "VISUALIZAÇÃO NATURAL"}
              </strong>
            </div>

            <div className="layer-controls">
              <button
                className={activeLayer === "mola" ? "active" : ""}
                onClick={() => setActiveLayer("mola")}
              >
                <Mountain size={15} />
                Relevo MOLA
              </button>

              <button
                className={activeLayer === "natural" ? "active" : ""}
                onClick={() => setActiveLayer("natural")}
              >
                <Globe2 size={15} />
                Natural
              </button>

              <button
                className={activeOverlay === "ice" ? "active" : ""}
                onClick={() =>
                  setActiveOverlay(activeOverlay === "ice" ? "none" : "ice")
                }
                aria-pressed={activeOverlay === "ice"}
              >
                <Snowflake size={15} />
                Gelo
              </button>

              <button
                className={activeOverlay === "hazards" ? "active" : ""}
                onClick={() =>
                  setActiveOverlay(
                    activeOverlay === "hazards" ? "none" : "hazards"
                  )
                }
                aria-pressed={activeOverlay === "hazards"}
              >
                <ShieldAlert size={15} />
                Atenção
              </button>
            </div>

            <div className="zoom-controls">
              <button onClick={() => zoomActions?.in()} aria-label="Aproximar">
                <ZoomIn size={21} />
              </button>

              <button onClick={() => zoomActions?.out()} aria-label="Afastar">
                <ZoomOut size={21} />
              </button>
            </div>

            <div className="globe-instructions">
              <Compass size={14} />
              Arraste para girar · Role para aproximar
            </div>

            <div className="globe-coordinate">
              <span>REGIÃO SELECIONADA</span>
              <strong>{region.name}</strong>
            </div>
          </div>

          <div className="layer-status">
            <div>
              <span className={`layer-status-dot ${textureLoaded === true ? "available" : ""}`} />
              <strong>Relevo global MOLA</strong>
              <small>
                {textureLoaded === true
                  ? "Tile NASA carregado"
                  : textureLoaded === false
                    ? "Textura ilustrativa de reserva — serviço indisponível"
                    : "Carregando dados NASA..."}
              </small>
            </div>

            <a href="https://trek.nasa.gov/" target="_blank" rel="noreferrer">
              NASA Mars Trek ↗
            </a>
          </div>

          <div className="map-bottom">
            <div className="map-bottom-item">
              <span className="legend-dot arcadia-dot" />
              Arcadia Planitia
            </div>

            <div className="map-bottom-item">
              <span className="legend-dot deuteronilus-dot" />
              Deuteronilus Mensae
            </div>

            <div className="map-bottom-item">
              <span className="legend-dot jezero-dot" />
              Cratera Jezero
            </div>
          </div>

          <div className="map-note">
            <Activity size={15} />
            <span>
              O mosaico MOLA é um relevo sombreado global. Não é um modelo
              de elevação local de alta resolução nem uma certificação de rota.
            </span>
          </div>

          {activeOverlay !== "none" && (
            <div className="map-note">
              <Info size={15} />
              <span>
                {activeOverlay === "ice"
                  ? "Os círculos azuis indicam regiões de interesse relacionadas a possíveis depósitos de gelo. São marcadores regionais ilustrativos, não mostram limites, profundidade ou concentração do gelo."
                  : "Os marcadores laranja/vermelhos destacam fatores qualitativos que exigem inspeção local. Não são um mapa de perigos medidos nem uma certificação de segurança."}
              </span>
            </div>
          )}

          <MarswalkPlanner onRouteChange={handleRouteChange} />

          <ScientificTargets onSelectTarget={handleTargetSelect} />
        </section>

        <aside className="right-panel">
          <div className="details-header">
            <div>
              <span className="eyebrow">RELATÓRIO DA REGIÃO</span>
              <h2>{region.name}</h2>
            </div>

            <div className="details-pin">
              <MapPin size={19} />
            </div>
          </div>

          <p className="region-description">{region.description}</p>

          <div className="coordinate-box">
            <div>
              <span>LATITUDE</span>
              <strong>{region.latitude.toFixed(2)}°</strong>
            </div>

            <div>
              <span>LONGITUDE</span>
              <strong>{region.longitude.toFixed(2)}°</strong>
            </div>
          </div>

          <div className="detail-tabs">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Visão geral
            </button>

            <button
              className={activeTab === "science" ? "active" : ""}
              onClick={() => setActiveTab("science")}
            >
              Ciência
            </button>

            <button
              className={activeTab === "risks" ? "active" : ""}
              onClick={() => setActiveTab("risks")}
            >
              Riscos
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="detail-content">
              <div className="detail-block">
                <div className="detail-title">
                  <Mountain size={17} />
                  <strong>Características do terreno</strong>
                </div>
                <p>{region.terrain}</p>
              </div>

              <div className="detail-block">
                <div className="detail-title">
                  <Waves size={17} />
                  <strong>Recursos de interesse</strong>
                </div>
                <ul>
                  {region.resources.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-block">
                <div className="detail-title">
                  <Activity size={17} />
                  <strong>Altitude e ambiente</strong>
                </div>
                <p>{region.elevation}</p>
                <p>{region.temperature}</p>
              </div>

              {region.investigation && (
                <div className="investigation-card">
                  <div className="detail-title">
                    <Info size={17} />
                    <strong>Avaliação preliminar</strong>
                  </div>

                  <p>
                    <strong>Prioridade:</strong> {region.investigation.priority}
                  </p>

                  <p>
                    <strong>Evidências:</strong> {region.investigation.evidence}
                  </p>

                  <div className="uncertainty-card">
                    <strong>Incertezas:</strong> {region.investigation.uncertainty}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "science" && (
            <div className="detail-content">
              {selectedTarget && (
                <div className="investigation-card">
                  <div className="detail-title">
                    <Target size={17} />
                    <strong>Alvo científico selecionado</strong>
                  </div>

                  <p><strong>{selectedTarget.name}</strong></p>
                  <p>{selectedTarget.focus}</p>
                  <p><strong>Questão:</strong> {selectedTarget.question}</p>
                  <p><strong>Justificativa:</strong> {selectedTarget.rationale}</p>
                  <p>
                    <strong>Referência:</strong> {selectedTarget.latitude}°, {selectedTarget.longitude}°
                  </p>
                </div>
              )}

              <div className="detail-block">
                <div className="detail-title">
                  <Telescope size={17} />
                  <strong>Objetivos científicos</strong>
                </div>

                <ul>
                  {region.science.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-block">
                <div className="detail-title">
                  <Satellite size={17} />
                  <strong>Dados orbitais</strong>
                </div>

                <p>
                  As imagens orbitais podem ajudar a investigar a geologia
                  e as características da superfície. A cobertura depende
                  da região e do produto consultado.
                </p>
              </div>
            </div>
          )}

          {activeTab === "risks" && (
            <div className="detail-content">
              <div className="detail-block">
                <div className="detail-title warning-title">
                  <ShieldAlert size={17} />
                  <strong>Fatores que exigem atenção</strong>
                </div>

                <ul>
                  {region.risks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div className="risk-warning">
                <strong>Importante</strong>
                <p>
                  Esta lista é qualitativa. Não representa uma avaliação
                  de risco calculada nem certifica segurança para uma
                  missão tripulada.
                </p>
              </div>
            </div>
          )}

          <div className="sources-area">
            <span className="eyebrow">STATUS DAS CAMADAS</span>

            <div className="source-row">
              <Mountain size={15} />
              <div>
                <strong>MOLA — relevo global</strong>
                <span>Camada visual ativa no globo</span>
              </div>
              <span className="source-tag">WMTS</span>
            </div>

            <div className="source-row">
              <Satellite size={15} />
              <div>
                <strong>HiRISE — imagens orbitais</strong>
                <span>Consulta de imagens no catálogo NASA</span>
              </div>
              <span className="source-tag">CATÁLOGO</span>
            </div>

            <div className="source-row">
              <Snowflake size={15} />
              <div>
                <strong>Gelo subterrâneo</strong>
                <span>Indicadores regionais qualitativos exibidos no globo</span>
              </div>
              <span className="source-tag">INDICADOR</span>
            </div>

            <div className="source-row">
              <Route size={15} />
              <div>
                <strong>Perigos e obstáculos</strong>
                <span>Marcadores qualitativos; dados locais ainda necessários</span>
              </div>
              <span className="source-tag">INDICADOR</span>
            </div>

            <p className="source-disclaimer">
              Os indicadores de gelo e atenção são regionais e qualitativos.
              Não substituem produtos georreferenciados de alta resolução
              nem análise de missão.
            </p>

            <a
              className="nasa-link"
              href="https://trek.nasa.gov/"
              target="_blank"
              rel="noreferrer"
            >
              Explorar NASA Mars Trek ↗
            </a>
          </div>
        </aside>
      </section>

      {/* GALERIA DE IMAGENS NO FINAL DA PÁGINA */}
      <section className="imagery-wide">
        <MarsImagery region={region} />
      </section>

      <footer className="app-footer">
        <span>NOVASTRIUM · MARS EXPLORATION SYSTEM</span>
        <span>Projeto desenvolvido para NASA Space Apps Challenge 2026</span>
      </footer>
      <AstroNexusAI />
    </main>
  );
}
