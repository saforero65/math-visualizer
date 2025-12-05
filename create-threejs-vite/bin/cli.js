#!/usr/bin/env node

import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banner
console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║         🎨 Creador de Proyectos Three.js + Vite           ║
╚═══════════════════════════════════════════════════════════╝
`));

// Preguntas interactivas
const answers = await inquirer.prompt([
    {
        type: 'input',
        name: 'projectName',
        message: '📁 Nombre del proyecto:',
        validate: (input) => input.trim() !== '' || 'El nombre no puede estar vacío',
        filter: (input) => input.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    },
    {
        type: 'input',
        name: 'description',
        message: '📝 Descripción del proyecto:',
        default: 'Proyecto Three.js con Vite'
    },
    {
        type: 'confirm',
        name: 'includeShaders',
        message: '🎭 ¿Incluir soporte para shaders GLSL?',
        default: true
    },
    {
        type: 'confirm',
        name: 'includeGui',
        message: '🎛️  ¿Incluir lil-gui para controles de debug?',
        default: true
    },
    {
        type: 'list',
        name: 'template',
        message: '🎯 Selecciona un template:',
        choices: [
            { name: '📦 Básico - Cubo simple con OrbitControls', value: 'basic' },
            { name: '🌊 Superficie Matemática - Animación tipo onda', value: 'math-surface' },
            { name: '🌍 Planeta - Esfera con texturas', value: 'planet' },
            { name: '✨ Partículas - Sistema de partículas', value: 'particles' },
            { name: '📄 Vacío - Solo la estructura base', value: 'empty' }
        ]
    },
    {
        type: 'confirm',
        name: 'installDeps',
        message: '📦 ¿Instalar dependencias automáticamente?',
        default: true
    },
    {
        type: 'confirm',
        name: 'initGit',
        message: '🔧 ¿Inicializar repositorio Git?',
        default: true
    }
]);

const projectPath = path.join(process.cwd(), answers.projectName);

// Verificar si ya existe
if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`\n❌ El directorio "${answers.projectName}" ya existe.\n`));
    process.exit(1);
}

console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.yellow(`📦 Creando proyecto: ${chalk.green(answers.projectName)}`));
console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

const spinner = ora('Creando estructura de directorios...').start();

// Crear directorios
fs.mkdirSync(projectPath, { recursive: true });
fs.mkdirSync(path.join(projectPath, 'src', 'shaders'), { recursive: true });
fs.mkdirSync(path.join(projectPath, 'static'), { recursive: true });

spinner.succeed('Estructura de directorios creada');

// ============================================================================
// ARCHIVOS DEL PROYECTO
// ============================================================================

// package.json
spinner.start('Creando package.json...');
const packageJson = {
    name: answers.projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    description: answers.description,
    scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
    },
    devDependencies: {
        "vite": "^6.2.2",
        "vite-plugin-restart": "^0.4.2",
        ...(answers.includeShaders && { "vite-plugin-glsl": "^1.3.3" })
    },
    dependencies: {
        "three": "^0.174.0",
        ...(answers.includeGui && { "lil-gui": "^0.20.0" })
    }
};
fs.writeFileSync(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
);
spinner.succeed('package.json creado');

// vite.config.js
spinner.start('Creando vite.config.js...');
const viteConfig = `import restart from 'vite-plugin-restart'
${answers.includeShaders ? "import glsl from 'vite-plugin-glsl'" : ''}

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server: {
        host: true,
        open: true
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    plugins: [
        restart({ restart: ['../static/**'] })${answers.includeShaders ? ',\n        glsl()' : ''}
    ]
}
`;
fs.writeFileSync(path.join(projectPath, 'vite.config.js'), viteConfig);
spinner.succeed('vite.config.js creado');

// index.html
spinner.start('Creando index.html...');
const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${answers.projectName}</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>">
</head>
<body>
    <canvas class="webgl"></canvas>
    <script type="module" src="./script.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(projectPath, 'src', 'index.html'), indexHtml);
spinner.succeed('index.html creado');

// style.css
spinner.start('Creando style.css...');
const styleCss = `* {
    margin: 0;
    padding: 0;
}

html,
body {
    overflow: hidden;
    background: #000;
}

.webgl {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}
`;
fs.writeFileSync(path.join(projectPath, 'src', 'style.css'), styleCss);
spinner.succeed('style.css creado');

// script.js según template
spinner.start('Creando script.js...');
let scriptContent = '';

switch (answers.template) {
    case 'math-surface':
        scriptContent = generateMathSurfaceTemplate(answers.includeGui);
        break;
    case 'planet':
        scriptContent = generatePlanetTemplate(answers.includeGui);
        break;
    case 'particles':
        scriptContent = generateParticlesTemplate(answers.includeGui);
        break;
    case 'empty':
        scriptContent = generateEmptyTemplate();
        break;
    default:
        scriptContent = generateBasicTemplate(answers.includeGui);
}

fs.writeFileSync(path.join(projectPath, 'src', 'script.js'), scriptContent);
spinner.succeed('script.js creado');

// Shaders de ejemplo
if (answers.includeShaders) {
    spinner.start('Creando shaders de ejemplo...');

    const vertexShader = `uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
}
`;

    const fragmentShader = `uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vec3 color = vec3(vUv, abs(sin(uTime)));
    gl_FragColor = vec4(color, 1.0);
}
`;

    fs.writeFileSync(path.join(projectPath, 'src', 'shaders', 'vertex.glsl'), vertexShader);
    fs.writeFileSync(path.join(projectPath, 'src', 'shaders', 'fragment.glsl'), fragmentShader);
    spinner.succeed('Shaders de ejemplo creados');
}

// .gitignore
spinner.start('Creando .gitignore...');
const gitignore = `node_modules
dist
.DS_Store
*.local
.vscode
`;
fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignore);
spinner.succeed('.gitignore creado');

// README.md
spinner.start('Creando README.md...');
const readme = `# ${answers.projectName}

${answers.description}

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
\`\`\`

## 📁 Estructura

\`\`\`
${answers.projectName}/
├── src/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── shaders/        # Shaders GLSL
├── static/             # Assets estáticos (texturas, modelos, etc.)
├── package.json
└── vite.config.js
\`\`\`

## 🛠️ Tecnologías

- [Three.js](https://threejs.org/) v0.174 - Librería 3D WebGL
- [Vite](https://vitejs.dev/) - Build tool ultrarrápido
${answers.includeGui ? '- [lil-gui](https://lil-gui.georgealways.com/) - Controles de debug' : ''}
${answers.includeShaders ? '- [vite-plugin-glsl](https://github.com/UstymUkhman/vite-plugin-glsl) - Importar shaders GLSL' : ''}

## 📚 Recursos

- [Three.js Docs](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Three.js Journey](https://threejs-journey.com/)

---
Creado con 💜 usando create-threejs-vite
`;
fs.writeFileSync(path.join(projectPath, 'README.md'), readme);
spinner.succeed('README.md creado');

// Git init
if (answers.initGit) {
    spinner.start('Inicializando repositorio Git...');
    try {
        execSync('git init', { cwd: projectPath, stdio: 'ignore' });
        spinner.succeed('Repositorio Git inicializado');
    } catch (e) {
        spinner.warn('No se pudo inicializar Git (¿está instalado?)');
    }
}

// Instalar dependencias
if (answers.installDeps) {
    spinner.start('Instalando dependencias (esto puede tardar un momento)...');
    try {
        execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
        spinner.succeed('Dependencias instaladas');
    } catch (e) {
        spinner.fail('Error instalando dependencias');
        console.log(chalk.yellow('  Puedes instalarlas manualmente con: npm install'));
    }
}

// Mensaje final
console.log(chalk.blue('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
console.log(chalk.green('✅ ¡Proyecto creado exitosamente!'));
console.log(chalk.blue('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

console.log(`📂 Ubicación: ${chalk.cyan(projectPath)}\n`);

console.log(chalk.yellow('Próximos pasos:\n'));
console.log(chalk.cyan(`  cd ${answers.projectName}`));
if (!answers.installDeps) {
    console.log(chalk.cyan('  npm install'));
}
console.log(chalk.cyan('  npm run dev'));

console.log(chalk.green('\n¡Happy coding! 🎉\n'));

// ============================================================================
// FUNCIONES GENERADORAS DE TEMPLATES
// ============================================================================

function generateBasicTemplate(includeGui) {
    return `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
${includeGui ? "import GUI from 'lil-gui'" : ''}
import './style.css'

/**
 * 📦 Template Básico - Three.js + Vite
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Escena
const scene = new THREE.Scene()

// Tamaños
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

${includeGui ? `// Debug GUI
const gui = new GUI()
` : ''}
// Objeto
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ 
    color: 0x00ff88,
    metalness: 0.3,
    roughness: 0.4
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

${includeGui ? `// GUI controls
gui.add(mesh.position, 'y', -3, 3, 0.01).name('Posición Y')
gui.add(material, 'metalness', 0, 1, 0.01)
gui.add(material, 'roughness', 0, 1, 0.01)
gui.add(material, 'wireframe')
gui.addColor(material, 'color')
` : ''}
// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

// Cámara
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 3)
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animación
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()
    
    // Rotar el cubo
    mesh.rotation.y = elapsedTime * 0.5
    mesh.rotation.x = elapsedTime * 0.3
    
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()
`;
}

function generateMathSurfaceTemplate(includeGui) {
    return `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
${includeGui ? "import GUI from 'lil-gui'" : ''}
import './style.css'

/**
 * 🌊 Superficie 3D Matemática Animada
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Escena
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// Tamaños
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Parámetros configurables
const params = {
    speed: 0.03,
    amplitude: 1.0,
    frequency: 1.0,
    wireframe: true,
    color: '#00ffff',
    showGrid: true,
    showAxes: true
}

${includeGui ? `// GUI
const gui = new GUI()
const surfaceFolder = gui.addFolder('Superficie')
surfaceFolder.add(params, 'speed', 0.01, 0.1, 0.01).name('Velocidad')
surfaceFolder.add(params, 'amplitude', 0.1, 3, 0.1).name('Amplitud')
surfaceFolder.add(params, 'frequency', 0.5, 3, 0.1).name('Frecuencia')
surfaceFolder.add(params, 'wireframe').name('Wireframe').onChange(v => material.wireframe = v)
surfaceFolder.addColor(params, 'color').name('Color').onChange(v => material.color.set(v))

const helpersFolder = gui.addFolder('Helpers')
helpersFolder.add(params, 'showGrid').name('Grid').onChange(v => grid.visible = v)
helpersFolder.add(params, 'showAxes').name('Ejes').onChange(v => axes.visible = v)
` : ''}

// Cámara
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(6, 5, 6)
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Luces
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight)
scene.add(new THREE.AmbientLight(0x404040))

// Helpers
const axes = new THREE.AxesHelper(4)
scene.add(axes)

const grid = new THREE.GridHelper(10, 20, 0x444444, 0x222222)
scene.add(grid)

// Geometría de la superficie
const size = 6
const segments = 80
const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
geometry.rotateX(-Math.PI / 2)

const material = new THREE.MeshStandardMaterial({
    wireframe: params.wireframe,
    color: params.color,
    metalness: 0.1,
    roughness: 0.8,
    side: THREE.DoubleSide
})

const surface = new THREE.Mesh(geometry, material)
scene.add(surface)

let t = 0

// Función matemática f(x, z, t)
function f(x, z, t) {
    const r = Math.sqrt(x * x + z * z) + 0.0001
    return params.amplitude * Math.sin(params.frequency * r - t) / r
}

// Actualizar superficie
function updateSurface() {
    const pos = geometry.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const z = pos.getZ(i)
        const y = f(x, z, t)
        pos.setY(i, y)
    }
    pos.needsUpdate = true
    geometry.computeVertexNormals()
}

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animación
function animate() {
    requestAnimationFrame(animate)
    t += params.speed
    updateSurface()
    controls.update()
    renderer.render(scene, camera)
}

animate()
`;
}

function generatePlanetTemplate(includeGui) {
    return `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
${includeGui ? "import GUI from 'lil-gui'" : ''}
import './style.css'

/**
 * 🌍 Template Planeta
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Escena
const scene = new THREE.Scene()

// Tamaños
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Parámetros
const params = {
    rotationSpeed: 0.001,
    atmosphereColor: '#4da6ff',
    showAtmosphere: true
}

${includeGui ? `// GUI
const gui = new GUI()
gui.add(params, 'rotationSpeed', 0, 0.01, 0.001).name('Velocidad rotación')
gui.addColor(params, 'atmosphereColor').name('Color atmósfera').onChange(v => {
    atmosphereMaterial.uniforms.glowColor.value.set(v)
})
gui.add(params, 'showAtmosphere').name('Atmósfera').onChange(v => atmosphere.visible = v)
` : ''}

// Texturas procedurales
const textureLoader = new THREE.TextureLoader()

// Planeta
const planetGeometry = new THREE.SphereGeometry(1, 64, 64)
const planetMaterial = new THREE.MeshStandardMaterial({
    color: 0x2233ff,
    metalness: 0.1,
    roughness: 0.8
})
const planet = new THREE.Mesh(planetGeometry, planetMaterial)
scene.add(planet)

// Atmósfera (glow effect)
const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64)
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: \`
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    \`,
    fragmentShader: \`
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
    \`,
    uniforms: {
        glowColor: { value: new THREE.Color(params.atmosphereColor) }
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
})
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
scene.add(atmosphere)

// Estrellas de fondo
const starsGeometry = new THREE.BufferGeometry()
const starsCount = 5000
const positions = new Float32Array(starsCount * 3)
for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100
}
starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 })
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffffff, 2)
sunLight.position.set(5, 3, 5)
scene.add(sunLight)

// Cámara
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 3
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1.5
controls.maxDistance = 10

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animación
function animate() {
    requestAnimationFrame(animate)
    
    planet.rotation.y += params.rotationSpeed
    atmosphere.rotation.y += params.rotationSpeed * 0.5
    
    controls.update()
    renderer.render(scene, camera)
}

animate()
`;
}

function generateParticlesTemplate(includeGui) {
    return `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
${includeGui ? "import GUI from 'lil-gui'" : ''}
import './style.css'

/**
 * ✨ Sistema de Partículas
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Escena
const scene = new THREE.Scene()

// Tamaños
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Parámetros
const params = {
    count: 10000,
    size: 0.02,
    radius: 5,
    branches: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}

let geometry = null
let material = null
let points = null

function generateGalaxy() {
    // Limpiar partículas anteriores
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(params.count * 3)
    const colors = new Float32Array(params.count * 3)

    const colorInside = new THREE.Color(params.insideColor)
    const colorOutside = new THREE.Color(params.outsideColor)

    for (let i = 0; i < params.count; i++) {
        const i3 = i * 3

        const radius = Math.random() * params.radius
        const spinAngle = radius * params.spin
        const branchAngle = (i % params.branches) / params.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
        const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius
        const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / params.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)
}

generateGalaxy()

${includeGui ? `// GUI
const gui = new GUI()
gui.add(params, 'count', 100, 100000, 100).onFinishChange(generateGalaxy)
gui.add(params, 'size', 0.001, 0.1, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'radius', 0.01, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(params, 'branches', 2, 20, 1).onFinishChange(generateGalaxy)
gui.add(params, 'spin', -5, 5, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomness', 0, 2, 0.001).onFinishChange(generateGalaxy)
gui.add(params, 'randomnessPower', 1, 10, 0.001).onFinishChange(generateGalaxy)
gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy)
` : ''}

// Cámara
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 3)
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animación
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()
    
    if (points) {
        points.rotation.y = elapsedTime * 0.1
    }
    
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()
`;
}

function generateEmptyTemplate() {
    return `import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import './style.css'

/**
 * 📄 Template Vacío - Tu lienzo en blanco
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Escena
const scene = new THREE.Scene()

// Tamaños
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Cámara
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controles
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animación
const clock = new THREE.Clock()

function animate() {
    const elapsedTime = clock.getElapsedTime()
    
    // Tu código aquí ✨
    
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

animate()
`;
}
