import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Farm3D({ 
  timeOfDay = "Afternoon", 
  weather = "Sunny",       
  selectedFieldId = null,
  onSelectField = () => {}
}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  
  const animatedObjects = useRef({
    windmills: [],
    crops: [],
    drones: [],
    animals: [],
    weatherParticles: null,
    lightningLight: null
  });

  const fieldsData = [
    { id: "f1", name: "Wheat Fields", crop: "Wheat", color: 0xcfa655, pos: [-4, 0, -4] },
    { id: "f2", name: "Corn Farm", crop: "Corn", color: 0x40621d, pos: [0, 0, -4] },
    { id: "f3", name: "Rice Paddles", crop: "Rice", color: 0x08151c, pos: [4, 0, -4] }, // Flooded dark reflective base
    { id: "f4", name: "Vegetable Patch", crop: "Tomato & Carrot", color: 0x18120e, pos: [-4, 0, 0] }, // Dark soil base
    { id: "f5", name: "Mango Orchard", crop: "Mango", color: 0x121a10, pos: [0, 0, 0] },
    { id: "f6", name: "Sugarcane Valley", crop: "Sugarcane", color: 0x3d5a28, pos: [4, 0, 0] }
  ];

  useEffect(() => {
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 350;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0c10);
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    camera.position.set(0, 8, 14);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    ambientLight.name = "ambient";
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 0.7);
    dirLight.name = "directional";
    dirLight.position.set(5, 15, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Hemisphere light simulates sky color from above and ground color from below for natural ambient occlusion
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.45);
    hemiLight.name = "hemisphere";
    scene.add(hemiLight);

    // Lightning thundershower flash source
    const lightningLight = new THREE.PointLight(0xffffff, 0, 100);
    lightningLight.position.set(0, 20, 0);
    scene.add(lightningLight);
    animatedObjects.current.lightningLight = lightningLight;

    // 4. Ground
    const baseGeo = new THREE.BoxGeometry(16, 0.4, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x141812, roughness: 0.95 }); // Organic dark earth
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = true;
    scene.add(baseMesh);

    // Water canal running down middle
    const canalGeo = new THREE.BoxGeometry(1.0, 0.1, 16);
    const canalMat = new THREE.MeshStandardMaterial({ color: 0x0c1a24, roughness: 0.05, metalness: 0.95 }); // Reflective dark slate water
    const canalMesh = new THREE.Mesh(canalGeo, canalMat);
    canalMesh.position.set(2.0, 0.02, 0);
    scene.add(canalMesh);

    // Create plots
    fieldsData.forEach(field => {
      const plotGroup = new THREE.Group();
      plotGroup.position.set(field.pos[0], 0.02, field.pos[2]);
      plotGroup.name = `field_${field.id}`;
      plotGroup.userData = field;

      const plotGeo = new THREE.BoxGeometry(3.0, 0.1, 3.0);
      const plotMat = new THREE.MeshStandardMaterial({ color: field.color, roughness: 0.8 });
      const plotMesh = new THREE.Mesh(plotGeo, plotMat);
      plotMesh.receiveShadow = true;
      plotGroup.add(plotMesh);

      // Procedural crops inside plot
      if (field.crop === "Wheat") {
        for (let j = 0; j < 18; j++) {
          const stemGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.55, 4);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0xcfa655, roughness: 0.9 });
          const stem = new THREE.Mesh(stemGeo, stemMat);
          stem.position.set((Math.random() - 0.5) * 2.3, 0.28, (Math.random() - 0.5) * 2.3);
          plotGroup.add(stem);
          animatedObjects.current.crops.push(stem);
        }
      } else if (field.crop === "Sugarcane") {
        for (let j = 0; j < 14; j++) {
          const stemGeo = new THREE.CylinderGeometry(0.025, 0.03, 1.1, 4);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d5a28, roughness: 0.95 });
          const stem = new THREE.Mesh(stemGeo, stemMat);
          stem.position.set((Math.random() - 0.5) * 2.3, 0.55, (Math.random() - 0.5) * 2.3);
          plotGroup.add(stem);
          animatedObjects.current.crops.push(stem);
        }
      } else if (field.crop === "Corn") {
        for (let j = 0; j < 12; j++) {
          const rx = (Math.random() - 0.5) * 2.2;
          const rz = (Math.random() - 0.5) * 2.2;
          
          const stalkGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.85, 4);
          const stalkMat = new THREE.MeshStandardMaterial({ color: 0x384c20, roughness: 0.9 });
          const stalk = new THREE.Mesh(stalkGeo, stalkMat);
          stalk.position.set(rx, 0.42, rz);
          plotGroup.add(stalk);
          animatedObjects.current.crops.push(stalk);

          // Yellow cob
          const cobGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 4);
          const cobMat = new THREE.MeshStandardMaterial({ color: 0xfab139, roughness: 0.5 });
          const cob = new THREE.Mesh(cobGeo, cobMat);
          cob.position.set(rx + 0.05, 0.5, rz);
          cob.rotation.z = Math.PI / 4;
          plotGroup.add(cob);
        }
      } else if (field.crop === "Rice") {
        // Draw flooded shoots on reflective base
        for (let j = 0; j < 25; j++) {
          const shootGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.35, 3);
          const shootMat = new THREE.MeshStandardMaterial({ color: 0x4f8f35, roughness: 0.9 });
          const shoot = new THREE.Mesh(shootGeo, shootMat);
          shoot.position.set((Math.random() - 0.5) * 2.4, 0.17, (Math.random() - 0.5) * 2.4);
          shoot.rotation.x = (Math.random() - 0.5) * 0.15;
          shoot.rotation.z = (Math.random() - 0.5) * 0.15;
          plotGroup.add(shoot);
          animatedObjects.current.crops.push(shoot);
        }
      } else if (field.crop === "Tomato & Carrot") {
        for (let j = 0; j < 9; j++) {
          const rx = (Math.random() - 0.5) * 2.2;
          const rz = (Math.random() - 0.5) * 2.2;
          
          const leafGeo = new THREE.SphereGeometry(0.18, 5, 5);
          const leafMat = new THREE.MeshStandardMaterial({ color: 0x224c30, roughness: 0.9 });
          const bush = new THREE.Mesh(leafGeo, leafMat);
          bush.position.set(rx, 0.18, rz);
          plotGroup.add(bush);

          const fruitGeo = new THREE.SphereGeometry(0.06, 4, 4);
          const fruitMat = new THREE.MeshStandardMaterial({ color: 0xda3f21, roughness: 0.5 });
          const fruit = new THREE.Mesh(fruitGeo, fruitMat);
          fruit.position.set(rx + (Math.random() - 0.5) * 0.1, 0.22, rz + (Math.random() - 0.5) * 0.1);
          plotGroup.add(fruit);
        }
      } else if (field.crop === "Mango") {
        const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 1.2, 5);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422d1b, roughness: 0.95 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.6;
        plotGroup.add(trunk);

        const leavesGeo = new THREE.SphereGeometry(0.55, 7, 7);
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x11331c, roughness: 0.9 });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);
        leaves.position.y = 1.3;
        plotGroup.add(leaves);

        for (let f = 0; f < 5; f++) {
          const fruitGeo = new THREE.SphereGeometry(0.05, 4, 4);
          const fruitMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.6 });
          const mango = new THREE.Mesh(fruitGeo, fruitMat);
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.45;
          mango.position.set(radius * Math.sin(angle), 1.0 + Math.random() * 0.4, radius * Math.cos(angle));
          plotGroup.add(mango);
        }
      }

      scene.add(plotGroup);
    });

    // 5. Infrastructure: Windmill
    const windmill = new THREE.Group();
    windmill.position.set(-6, 0, -6);
    const towerGeo = new THREE.CylinderGeometry(0.15, 0.3, 5.0, 5);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0x8a929b, metalness: 0.8, roughness: 0.25 }); // Steel metallic
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 2.5;
    windmill.add(tower);

    const blades = new THREE.Group();
    blades.position.set(0, 5.0, 0.25);
    for (let b = 0; b < 3; b++) {
      const bladeGeo = new THREE.BoxGeometry(0.08, 1.8, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, metalness: 0.1, roughness: 0.5 }); // Matte white
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.y = 0.9;
      const pivot = new THREE.Group();
      pivot.rotation.z = (b * Math.PI * 2) / 3;
      pivot.add(blade);
      blades.add(pivot);
    }
    windmill.add(blades);
    scene.add(windmill);
    animatedObjects.current.windmills.push(blades);

    // 5.5 Infrastructure: Solar Panel Grid
    const solarGrid = new THREE.Group();
    solarGrid.position.set(-6, 0.02, 6);
    
    // Panel stands
    const standGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.9, roughness: 0.1 });
    
    // Panel faces
    const panelGeo = new THREE.BoxGeometry(1.6, 0.05, 0.8);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1d3557, metalness: 0.9, roughness: 0.05 }); // reflective solar cells
    
    for (let s = 0; s < 3; s++) {
      const singlePanel = new THREE.Group();
      singlePanel.position.set((s - 1) * 2.0, 0, 0);
      
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = 0.4;
      singlePanel.add(stand);
      
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, 0.8, 0);
      panel.rotation.x = Math.PI / 6; // tilted towards sun
      singlePanel.add(panel);
      
      solarGrid.add(singlePanel);
    }
    scene.add(solarGrid);

    // 6. Drone Patrol
    const drone = new THREE.Group();
    drone.position.set(0, 4.5, 0);
    const droneGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
    const droneMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.95, roughness: 0.1 }); // metallic black drone
    const droneMesh = new THREE.Mesh(droneGeo, droneMat);
    drone.add(droneMesh);
    scene.add(drone);
    animatedObjects.current.drones.push(drone);

    // 7. Weather Particles (Rain / Snow)
    let weatherCount = 0;
    let particleGeo;
    let particleMat;

    if (weather === "Rain" || weather === "Storm") {
      weatherCount = 1200; // Increased count for realism
      particleGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(weatherCount * 3);
      for (let i = 0; i < weatherCount; i++) {
        pos[i*3] = (Math.random() - 0.5) * 16;
        pos[i*3+1] = Math.random() * 12;
        pos[i*3+2] = (Math.random() - 0.5) * 16;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      // Small size and transparency creates realistic thin rain streaks
      particleMat = new THREE.PointsMaterial({ color: 0xc4dce8, size: 0.04, transparent: true, opacity: 0.55 });
    } else if (weather === "Winter") {
      weatherCount = 500;
      particleGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(weatherCount * 3);
      for (let i = 0; i < weatherCount; i++) {
        pos[i*3] = (Math.random() - 0.5) * 16;
        pos[i*3+1] = Math.random() * 12;
        pos[i*3+2] = (Math.random() - 0.5) * 16;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      // Soft small snowflakes
      particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.75 });
    }

    if (weatherCount > 0) {
      const pSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(pSystem);
      animatedObjects.current.weatherParticles = pSystem;
    }

    // 8. Event listeners
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 350;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 9. Animation Loop
    let animationId;
    const tick = () => {
      animationId = requestAnimationFrame(tick);
      const elapsed = clockRef.current.getElapsedTime();

      // Mouse camera control
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (8 - mouseY * 3 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate windmill blades
      animatedObjects.current.windmills.forEach(b => {
        b.rotation.z += 0.02;
      });

      // Sway crops
      const sway = Math.sin(elapsed * 2.5) * 0.05;
      animatedObjects.current.crops.forEach(c => {
        c.rotation.z = sway;
      });

      // Patrol Drone floating pathway
      animatedObjects.current.drones.forEach(d => {
        d.position.y = 4.0 + Math.sin(elapsed * 2) * 0.25;
        d.position.x = Math.sin(elapsed * 0.4) * 4;
        d.position.z = Math.cos(elapsed * 0.4) * 4;
      });

      // Weather animation ticks
      const parts = animatedObjects.current.weatherParticles;
      if (parts) {
        const positions = parts.geometry.attributes.position.array;
        const len = positions.length / 3;
        for (let i = 0; i < len; i++) {
          positions[i * 3 + 1] -= (weather === "Winter" ? 0.05 : 0.22);
          if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 12;
          }
        }
        parts.geometry.attributes.position.needsUpdate = true;
      }

      // Lightning storm flash simulation
      if (weather === "Storm" && animatedObjects.current.lightningLight) {
        if (Math.random() > 0.985) {
          animatedObjects.current.lightningLight.intensity = 8;
          setTimeout(() => {
            if (animatedObjects.current.lightningLight) {
              animatedObjects.current.lightningLight.intensity = 0;
            }
          }, 80);
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      scene.clear();
    };
  }, [weather]);

  // Lighting parameters updates matching time of day presets
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const ambientLight = scene.getObjectByName("ambient");
    const dirLight = scene.getObjectByName("directional");

    let skyColor, ambientInt, dirInt;

    switch (timeOfDay) {
      case "Morning":
        skyColor = 0xe2d4c9; // Desaturated dawn rose
        ambientInt = 0.55;
        dirInt = 0.5;
        break;
      case "Evening":
        skyColor = 0x3a2e45; // Deep desaturated twilight purple
        ambientInt = 0.45;
        dirInt = 0.35;
        break;
      case "Night":
        skyColor = 0x03060f; // Deep space navy slate
        ambientInt = 0.2;
        dirInt = 0.15;
        break;
      case "Afternoon":
      default:
        skyColor = 0xbecfdc; // Realistic overcast soft blue
        ambientInt = 0.65;
        dirInt = 0.8;
        break;
    }

    if (weather === "Storm") {
      skyColor = 0x1c2028; // Charcoal storm gray
      ambientInt = 0.25;
      dirInt = 0.1;
    } else if (weather === "Fog") {
      skyColor = 0xbcc2cc; // Soft misty gray
      ambientInt = 0.7;
      dirInt = 0.15;
    } else if (weather === "Winter") {
      skyColor = 0xd0d6df; // Cold winter sky gray
      ambientInt = 0.65;
      dirInt = 0.45;
    }

    scene.background.setHex(skyColor);
    scene.fog.color.setHex(skyColor);

    if (ambientLight) ambientLight.intensity = ambientInt;
    if (dirLight) {
      dirLight.intensity = dirInt;
      if (timeOfDay === "Morning") dirLight.position.set(-8, 6, -3);
      else if (timeOfDay === "Evening") dirLight.position.set(8, 3, -3);
      else dirLight.position.set(2, 12, 2);
    }
  }, [timeOfDay, weather]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
