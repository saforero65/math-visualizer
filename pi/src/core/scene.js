import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

/**
 * Crear y configurar la escena Three.js
 */
export function createScene() {
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050510)

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // Cámara
    const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(0, 0, 6)
    scene.add(camera)

    // Controles
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = false
    controls.autoRotateSpeed = 0.5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // Luces
    const ambientLight = new THREE.AmbientLight(0x404060, 0.8)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1)
    mainLight.position.set(5, 10, 5)
    scene.add(mainLight)

    // Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0x4a1a7a, 0x1a0a2e)
    gridHelper.rotation.x = Math.PI / 2
    gridHelper.position.z = -0.1
    scene.add(gridHelper)

    return {
        canvas,
        scene,
        camera,
        controls,
        renderer,
        sizes,
        gridHelper
    }
}

/**
 * Posiciones de cámara para cada fase
 */
export const cameraTargets = {
    phase1: new THREE.Vector3(0, 0, 6),
    phase2: new THREE.Vector3(4, 2, 4),
    final: new THREE.Vector3(3, 1.5, 3)
}

/**
 * Manejar redimensionamiento de ventana
 */
export function handleResize(sceneContext) {
    const { camera, renderer, sizes } = sceneContext

    return () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
}
