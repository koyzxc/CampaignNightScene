// main.js — Campfire Night Scene (Activities 2.1–2.3)
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

// === Scene Setup ===
const scene = new THREE.Scene()
scene.fog = new THREE.Fog('#0a0a1f', 2, 25)

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(6, 3, 8)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// === Ground ===
const groundMat = new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 1 })
const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

// === LIGHTS (Activity 2.1) ===

// Ambient Light — overall night glow
const ambientLight = new THREE.AmbientLight(0x223344, 0.3)
scene.add(ambientLight)

// Directional Light — moonlight
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.15)
moonLight.position.set(5, 10, -5)
moonLight.castShadow = true
moonLight.shadow.mapSize.set(1024, 1024)
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 20
scene.add(moonLight)

// Hemisphere Light — subtle sky reflection
const hemiLight = new THREE.HemisphereLight(0x4477ff, 0x222200, 0.1)
scene.add(hemiLight)

// Point Light — campfire flicker
const fireLight = new THREE.PointLight(0xffa040, 1.5, 12, 2)
fireLight.position.set(0, 1, 0)
fireLight.castShadow = true
fireLight.shadow.mapSize.set(512, 512)
scene.add(fireLight)

// === Tent Light (updated bulb inside tent) ===
const tentBulb = new THREE.PointLight(0xffcc88, 3.5, 6, 2) // brighter intensity & warm color
tentBulb.position.set(3, 0.9, -2) // centered inside tent
tentBulb.castShadow = true
scene.add(tentBulb)

// optional: small glowing sphere to represent the bulb
const bulbGeo = new THREE.SphereGeometry(0.08, 16, 16)
const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffeeaa, emissive: 0xffdd88, emissiveIntensity: 2 })
const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat)
bulbMesh.position.copy(tentBulb.position)
scene.add(bulbMesh)

// === OBJECTS (Activity 2.3) ===

// Campfire Logs
const logMaterial = new THREE.MeshStandardMaterial({ color: '#552a00', roughness: 0.8 })
for (let i = 0; i < 5; i++) {
  const log = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), logMaterial)
  log.position.set(0, 0.1, 0)
  log.rotation.z = Math.PI / 2
  log.rotation.y = (i / 5) * Math.PI
  log.castShadow = true
  scene.add(log)
}

// Tent
const tentMat = new THREE.MeshStandardMaterial({ 
  color: '#444477', 
  roughness: 0.9,
  transparent: true, 
  opacity: 0.95 // slightly translucent so light shows through
})
const tent = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.2, 4), tentMat)
tent.position.set(3, 0.6, -2)
tent.rotation.y = Math.PI / 4
tent.castShadow = true
scene.add(tent)

// Rocks around fire
const rockMat = new THREE.MeshStandardMaterial({ color: '#666666', roughness: 1 })
for (let i = 0; i < 8; i++) {
  const angle = (i / 8) * Math.PI * 2
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2), rockMat)
  rock.position.set(Math.cos(angle) * 1.2, 0.15, Math.sin(angle) * 1.2)
  rock.castShadow = true
  scene.add(rock)
}

// Trees
const trunkMat = new THREE.MeshStandardMaterial({ color: '#4b2e05' })
const leafMat = new THREE.MeshStandardMaterial({ color: '#0a3d00' })
for (let i = 0; i < 6; i++) {
  const x = Math.random() * 20 - 10
  const z = Math.random() * 20 - 10
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), trunkMat)
  trunk.position.set(x, 1, z)
  const leaves = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 8), leafMat)
  leaves.position.set(x, 2.5, z)
  trunk.castShadow = true
  leaves.castShadow = true
  scene.add(trunk, leaves)
}

// === ANIMATION (Activity 2.2) ===
const clock = new THREE.Clock()

function animate() {
  const elapsed = clock.getElapsedTime()
  // Fire flicker
  fireLight.intensity = 1.5 + Math.sin(elapsed * 10) * 0.3
  fireLight.position.y = 1 + Math.sin(elapsed * 5) * 0.05

  // Gentle bulb flicker (small variation)
  tentBulb.intensity = 3.5 + Math.sin(elapsed * 3) * 0.2

  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
