import * as THREE from "./vendor/three/three.module.js";

const sceneHost = document.querySelector("#atlas-scene");
const loading = document.querySelector("#atlas-loading");
const fallback = document.querySelector("#atlas-fallback");
const dock = document.querySelector("#atlas-dock");
const detail = document.querySelector("#atlas-detail");
const detailKicker = document.querySelector("#atlas-detail-kicker");
const detailTitle = document.querySelector("#atlas-detail-title");
const detailPath = document.querySelector("#atlas-detail-path");
const detailCopy = document.querySelector("#atlas-detail-copy");
const detailLink = document.querySelector("#atlas-detail-link");
const subtitle = document.querySelector("#atlas-subtitle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const systemItems = [
  {
    id: "houses",
    title: "Дома",
    kicker: "Основа системы",
    description: "Карточка дома связывает адрес, помещения, услуги, договоры, работы, документы и ответственных сотрудников.",
    path: "Адрес → Дом → Помещения → История",
    href: "index.html#about",
    color: 0x51c8ff,
    position: [-4.7, 2.1, 0.4]
  },
  {
    id: "residents",
    title: "Жители",
    kicker: "Личный контур",
    description: "Житель обращается через MAX и получает доступ только к подтверждённым лицевым счетам и своим данным.",
    path: "MAX → Подтверждение → Личный кабинет",
    href: "residents.html",
    color: 0x75e6bd,
    position: [-5.2, -1.4, -0.9]
  },
  {
    id: "requests",
    title: "Обращения",
    kicker: "Единая диспетчерская",
    description: "Сообщения, голос, фотографии и история диалога превращаются в понятную заявку с адресом и приоритетом.",
    path: "Сообщение → Диалог → Заявка → Контроль",
    href: "residents.html",
    color: 0xffc473,
    position: [-2.1, -3.7, 1.3]
  },
  {
    id: "works",
    title: "Работы",
    kicker: "Исполнение",
    description: "Задача получает исполнителя, срок, чек-лист, фотографии результата и проверку перед закрытием.",
    path: "Заявка → Исполнитель → Фото → Акт",
    href: "updates.html",
    color: 0xff8f78,
    position: [2.1, -3.7, -0.4]
  },
  {
    id: "payments",
    title: "Расчёты",
    kicker: "Финансовая история",
    description: "Начисления, оплаты, реестры и получатели собираются в одной проверяемой истории лицевого счёта.",
    path: "Источник → Проверка → Лицевой счёт",
    href: "index.html#about",
    color: 0x75e6bd,
    position: [5.1, -1.5, 0.9]
  },
  {
    id: "documents",
    title: "Документы",
    kicker: "Память дома",
    description: "Договоры, акты, решения, фотографии и технические материалы сохраняются рядом с объектом и задачей.",
    path: "Дом → Документ → Основание → Срок",
    href: "updates.html",
    color: 0xb89cff,
    position: [4.8, 2.0, -0.6]
  },
  {
    id: "law",
    title: "Правила",
    kicker: "База знаний",
    description: "Федеральные, региональные и местные нормы связаны с рабочими процессами и памятками для жителей.",
    path: "Вопрос → Норма → Решение → Действие",
    href: "knowledge.html",
    color: 0x51c8ff,
    position: [2.6, 4.0, 0.8]
  },
  {
    id: "gis",
    title: "ГИС ЖКХ",
    kicker: "Обязательные данные",
    description: "Полнота сведений, подготовка публикаций и контроль выгрузок формируются из единого набора данных.",
    path: "AlexOS → Проверка → ГИС ЖКХ",
    href: "knowledge.html",
    color: 0xffc473,
    position: [-1.4, 4.5, -1.1]
  },
  {
    id: "max",
    title: "MAX",
    kicker: "Канал связи",
    description: "Бот принимает обращения, подтверждает вход и связывает человека с его домом и лицевыми счетами.",
    path: "Человек → MAX → AlexOS → Сотрудник",
    href: "https://max.ru/id4246008141_bot",
    color: 0x59a9ff,
    position: [-3.3, 0.2, 3.1]
  },
  {
    id: "control",
    title: "Контроль",
    kicker: "Прозрачный результат",
    description: "Сроки, ответственные, доказательства выполнения и история изменений позволяют увидеть путь решения целиком.",
    path: "Срок → Проверка → Результат → История",
    href: "updates.html",
    color: 0xff8f78,
    position: [3.5, 0.4, 3.0]
  }
];

const houseItems = [
  {
    id: "roof",
    title: "Крыша",
    kicker: "Общее имущество",
    description: "Осмотры, протечки, сезонные работы и выполненные ремонты должны сохраняться в истории дома.",
    path: "Крыша → Осмотр → Работа → Акт",
    href: "basics.html#property",
    color: 0xff8f78,
    position: [0, 3.8, 0]
  },
  {
    id: "heating",
    title: "Отопление",
    kicker: "Инженерная система",
    description: "Состояние системы, обращения по качеству и граница ответственности зависят от схемы оборудования дома.",
    path: "Система → Радиатор → Проверка → Результат",
    href: "basics.html#heat",
    color: 0xffc473,
    position: [3.8, 0.4, 0.5]
  },
  {
    id: "water",
    title: "Вода и подвал",
    kicker: "Инженерные сети",
    description: "Стояки, отключающие устройства, подвальные сети и протечки связываются с заявками и осмотрами.",
    path: "Протечка → Локализация → Исполнитель → Фото",
    href: "basics.html#water",
    color: 0x51c8ff,
    position: [-3.7, -1.2, 0.7]
  },
  {
    id: "entrance",
    title: "Подъезд",
    kicker: "Общее пространство",
    description: "Освещение, уборка, двери и повреждения фиксируются по месту, подъезду и этажу.",
    path: "Подъезд → Этаж → Обращение → Работа",
    href: "residents.html",
    color: 0x75e6bd,
    position: [0, -1.0, 2.4]
  },
  {
    id: "yard",
    title: "Двор",
    kicker: "Территория дома",
    description: "Снег, ветки, ямы, освещение и благоустройство направляются ответственному исполнителю по границе территории.",
    path: "Место → Ответственный → Задача → Контроль",
    href: "basics.html#waste",
    color: 0x75e6bd,
    position: [4.2, -2.2, 2.4]
  }
];

const connections = [
  ["houses", "residents"], ["houses", "works"], ["houses", "documents"],
  ["residents", "requests"], ["residents", "max"], ["requests", "works"],
  ["requests", "control"], ["works", "control"], ["payments", "houses"],
  ["documents", "law"], ["law", "gis"], ["gis", "houses"],
  ["max", "requests"], ["payments", "control"]
];

let renderer;
let scene;
let camera;
let constellation;
let house;
let currentMode = "system";
let hoveredMesh = null;
let selectedId = null;
let dragging = false;
let dragMoved = false;
let pointerStart = { x: 0, y: 0 };
let pointerLast = { x: 0, y: 0 };
let cameraDistance = 15;
let targetDistance = 15;
let pointerParallax = { x: 0, y: 0 };
const pickables = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const timer = new THREE.Timer();
timer.connect(document);
const animatedNodes = [];

function makeTextSprite(text, color = "#bdeaff", scale = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(4, 13, 28, 0.82)";
  context.strokeStyle = "rgba(112, 201, 255, 0.34)";
  context.lineWidth = 3;
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(8, 18, 496, 92, 20);
  } else {
    context.rect(8, 18, 496, 92);
  }
  context.fill();
  context.stroke();
  context.fillStyle = color;
  context.font = "700 38px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 65, 450);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(3.2 * scale, 0.8 * scale, 1);
  sprite.renderOrder = 20;
  return sprite;
}

function createGlowNode(item, mode, radius = 0.38) {
  const group = new THREE.Group();
  group.position.fromArray(item.position);

  const material = new THREE.MeshStandardMaterial({
    color: item.color,
    emissive: item.color,
    emissiveIntensity: 0.7,
    roughness: 0.3,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 2), material);
  mesh.userData.item = item;
  mesh.userData.mode = mode;
  group.add(mesh);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.55, 0.018, 8, 72),
    new THREE.MeshBasicMaterial({ color: item.color, transparent: true, opacity: 0.62 })
  );
  ring.rotation.x = Math.PI / 2.5;
  group.add(ring);

  const label = makeTextSprite(item.title, "#eaf7ff", mode === "house" ? 0.88 : 1);
  label.position.y = radius + 0.72;
  group.add(label);

  mesh.userData.ring = ring;
  mesh.userData.baseScale = 1;
  pickables.push(mesh);
  animatedNodes.push(mesh);
  return group;
}

function createStarField() {
  const count = window.innerWidth < 700 ? 700 : 1400;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const radius = 22 + Math.random() * 42;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    const tint = Math.random();
    colors[i * 3] = 0.32 + tint * 0.15;
    colors[i * 3 + 1] = 0.62 + tint * 0.22;
    colors[i * 3 + 2] = 0.86 + tint * 0.14;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ size: 0.075, vertexColors: true, transparent: true, opacity: 0.78, sizeAttenuation: true })
  );
}

function createConstellation() {
  const group = new THREE.Group();
  const itemById = new Map(systemItems.map((item) => [item.id, item]));

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.25, 2),
    new THREE.MeshStandardMaterial({
      color: 0x0b4268,
      emissive: 0x158bc4,
      emissiveIntensity: 1.05,
      roughness: 0.25,
      metalness: 0.65,
      wireframe: true
    })
  );
  core.userData.core = true;
  group.add(core);

  const coreShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 2),
    new THREE.MeshStandardMaterial({ color: 0x75e6bd, emissive: 0x1aa577, emissiveIntensity: 0.9, roughness: 0.2 })
  );
  group.add(coreShell);

  const orbitA = new THREE.Mesh(
    new THREE.TorusGeometry(2.0, 0.018, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x51c8ff, transparent: true, opacity: 0.38 })
  );
  orbitA.rotation.x = Math.PI / 2.9;
  group.add(orbitA);

  const orbitB = orbitA.clone();
  orbitB.rotation.set(Math.PI / 2, 0.6, 0.8);
  group.add(orbitB);

  const coreLabel = makeTextSprite("AlexOS", "#ffffff", 1.18);
  coreLabel.position.set(0, -1.9, 0);
  group.add(coreLabel);

  systemItems.forEach((item) => group.add(createGlowNode(item, "system")));

  const linePositions = [];
  connections.forEach(([from, to]) => {
    linePositions.push(...itemById.get(from).position, ...itemById.get(to).position);
  });
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({ color: 0x4db7e8, transparent: true, opacity: 0.24 })
  );
  group.add(lines);
  group.userData.core = core;
  group.userData.coreShell = coreShell;
  group.userData.orbitA = orbitA;
  group.userData.orbitB = orbitB;
  return group;
}

function box(width, height, depth, color, emissive = 0x000000) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.35, roughness: 0.58, metalness: 0.08 })
  );
}

function createHouse() {
  const group = new THREE.Group();
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8.5, 72),
    new THREE.MeshStandardMaterial({ color: 0x071b27, roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.35;
  group.add(ground);

  const foundation = box(6.4, 0.55, 3.7, 0x102d3d);
  foundation.position.y = -2.0;
  group.add(foundation);

  const body = box(6.1, 4.6, 3.4, 0x123851, 0x082a42);
  body.position.y = 0.35;
  group.add(body);

  for (let floor = 0; floor < 3; floor += 1) {
    for (let column = 0; column < 5; column += 1) {
      const windowMesh = box(0.62, 0.62, 0.08, (floor + column) % 3 === 0 ? 0xffc473 : 0x5acfff, (floor + column) % 3 === 0 ? 0xff8a3d : 0x1e9fc8);
      windowMesh.position.set(-2.35 + column * 1.17, -0.95 + floor * 1.35, 1.75);
      group.add(windowMesh);
    }
  }

  const door = box(0.92, 1.65, 0.12, 0x75e6bd, 0x1d8b68);
  door.position.set(0, -1.27, 1.8);
  group.add(door);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4.25, 1.55, 4),
    new THREE.MeshStandardMaterial({ color: 0x7a3542, emissive: 0x361620, emissiveIntensity: 0.4, roughness: 0.65 })
  );
  roof.position.y = 3.4;
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = 0.66;
  group.add(roof);

  const chimney = box(0.5, 1.25, 0.5, 0x233f4f);
  chimney.position.set(1.4, 4.0, -0.4);
  group.add(chimney);

  const path = box(1.25, 0.05, 4.6, 0x395266);
  path.position.set(0, -2.28, 3.85);
  group.add(path);

  for (let i = 0; i < 4; i += 1) {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8), new THREE.MeshStandardMaterial({ color: 0x72503b }));
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.48, 1.4, 10), new THREE.MeshStandardMaterial({ color: 0x1e735f, emissive: 0x0e3c32, emissiveIntensity: 0.3 }));
    crown.position.y = 0.9;
    tree.add(trunk, crown);
    tree.position.set(i < 2 ? -4.3 : 4.3, -1.9, i % 2 ? 2.2 : -1.8);
    group.add(tree);
  }

  houseItems.forEach((item) => group.add(createGlowNode(item, "house", 0.3)));
  group.visible = false;
  group.rotation.y = -0.28;
  return group;
}

function renderDock() {
  const items = currentMode === "system" ? systemItems : houseItems;
  dock.replaceChildren();
  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.title;
    button.dataset.itemId = item.id;
    button.classList.toggle("active", selectedId === item.id);
    button.addEventListener("click", () => selectItem(item));
    dock.append(button);
  });
}

function selectItem(item) {
  selectedId = item.id;
  detailKicker.textContent = item.kicker;
  detailTitle.textContent = item.title;
  detailPath.textContent = item.path;
  detailCopy.textContent = item.description;
  detailLink.href = item.href;
  detailLink.target = item.href.startsWith("http") ? "_blank" : "";
  detailLink.rel = item.href.startsWith("http") ? "noopener" : "";
  detail.hidden = false;
  renderDock();
}

function closeDetail() {
  selectedId = null;
  detail.hidden = true;
  renderDock();
}

function setMode(mode) {
  currentMode = mode;
  constellation.visible = mode === "system";
  house.visible = mode === "house";
  const compact = window.innerWidth < 820;
  targetDistance = mode === "system"
    ? (compact ? 29 : 16.5)
    : (compact ? 28 : 14.5);
  subtitle.textContent = mode === "system"
    ? "От сообщения жителя до выполненной работы и истории дома"
    : "Инженерные системы, общее имущество, двор и обращения в одном объекте";
  document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  closeDetail();
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  pointerParallax.x = pointer.x;
  pointerParallax.y = pointer.y;
}

function raycast(event, activate = false) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(pickables.filter((mesh) => mesh.userData.mode === currentMode), false)[0];
  const nextHovered = hit?.object || null;
  if (hoveredMesh !== nextHovered) {
    hoveredMesh = nextHovered;
    renderer.domElement.style.cursor = hoveredMesh ? "pointer" : dragging ? "grabbing" : "grab";
  }
  if (activate && hit?.object?.userData?.item) selectItem(hit.object.userData.item);
}

function bindInteraction() {
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    dragMoved = false;
    pointerStart = { x: event.clientX, y: event.clientY };
    pointerLast = { ...pointerStart };
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) {
      raycast(event);
      return;
    }
    const dx = event.clientX - pointerLast.x;
    const dy = event.clientY - pointerLast.y;
    if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) dragMoved = true;
    const activeGroup = currentMode === "system" ? constellation : house;
    activeGroup.rotation.y += dx * 0.006;
    activeGroup.rotation.x = THREE.MathUtils.clamp(activeGroup.rotation.x + dy * 0.003, -0.38, 0.38);
    pointerLast = { x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener("pointerup", (event) => {
    if (!dragMoved) raycast(event, true);
    dragging = false;
    canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = hoveredMesh ? "pointer" : "grab";
  });
  canvas.addEventListener("pointercancel", () => { dragging = false; });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const compact = window.innerWidth < 820;
    targetDistance = THREE.MathUtils.clamp(targetDistance + event.deltaY * 0.012, compact ? 18 : 9, compact ? 36 : 21);
  }, { passive: false });
}

function animate() {
  requestAnimationFrame(animate);
  timer.update();
  const elapsed = timer.getElapsed();
  cameraDistance = THREE.MathUtils.lerp(cameraDistance, targetDistance, 0.055);
  camera.position.z = cameraDistance;
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, reducedMotion ? 0 : pointerParallax.x * 0.5, 0.035);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, reducedMotion ? 0 : pointerParallax.y * 0.28, 0.035);
  camera.lookAt(0, 0, 0);

  if (!reducedMotion && !dragging) {
    if (constellation.visible) constellation.rotation.y += 0.00075;
    if (house.visible) house.rotation.y += 0.00032;
  }

  const core = constellation.userData.core;
  const shell = constellation.userData.coreShell;
  core.rotation.x = elapsed * 0.11;
  core.rotation.y = elapsed * 0.16;
  shell.rotation.x = -elapsed * 0.12;
  shell.rotation.y = elapsed * 0.2;
  constellation.userData.orbitA.rotation.z = elapsed * 0.08;
  constellation.userData.orbitB.rotation.z = -elapsed * 0.06;

  animatedNodes.forEach((mesh, index) => {
    const isHovered = mesh === hoveredMesh;
    const isSelected = mesh.userData.item.id === selectedId && mesh.userData.mode === currentMode;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 1.8 + index) * 0.035;
    const targetScale = (isHovered || isSelected ? 1.34 : 1) * pulse;
    mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.13);
    mesh.userData.ring.rotation.z += isHovered ? 0.018 : 0.004;
    mesh.material.emissiveIntensity = THREE.MathUtils.lerp(mesh.material.emissiveIntensity, isHovered || isSelected ? 1.65 : 0.7, 0.12);
  });

  renderer.render(scene, camera);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const compact = window.innerWidth < 820;
  constellation.position.set(compact ? 0 : 1.15, compact ? -0.65 : -0.38, 0);
  house.position.set(compact ? 0 : 0.8, compact ? -0.65 : -0.35, 0);
  if (!dragging) {
    targetDistance = currentMode === "system"
      ? (compact ? 29 : 16.5)
      : (compact ? 28 : 14.5);
  }
}

function showFallback() {
  loading.classList.add("done");
  fallback.hidden = false;
  document.querySelector(".atlas-modes").hidden = true;
  dock.hidden = true;
}

function init() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  } catch (error) {
    showFallback();
    return;
  }

  renderer.setClearColor(0x030711, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.domElement.setAttribute("aria-label", "Интерактивная трёхмерная карта AlexOS");
  renderer.domElement.style.cursor = "grab";
  sceneHost.append(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030711, 0.022);
  camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, cameraDistance);

  scene.add(new THREE.AmbientLight(0x86bfff, 1.0));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(4, 8, 10);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x37d6ba, 34, 24, 2);
  rimLight.position.set(-6, -2, 7);
  scene.add(rimLight);
  scene.add(createStarField());

  constellation = createConstellation();
  house = createHouse();
  scene.add(constellation, house);

  resize();
  bindInteraction();
  renderDock();
  window.addEventListener("resize", resize);
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  document.querySelector("#atlas-detail-close").addEventListener("click", closeDetail);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDetail();
  });

  renderer.render(scene, camera);
  requestAnimationFrame(() => loading.classList.add("done"));
  window.__alexosAtlas = { renderer, scene, camera, setMode };
  animate();
}

init();
