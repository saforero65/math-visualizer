import * as THREE from 'three'
import { getGradientColor, spiritualColors } from '../materials/colors.js'

/**
 * Crear línea de contorno del polígono con degradado
 */
export function createPolygonOutline(sides, radius) {
    const points = []

    for (let i = 0; i <= sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        points.push(new THREE.Vector3(x, y, 0))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const colors = new Float32Array((sides + 1) * 3)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 3,
        transparent: true,
        opacity: 1
    })

    return new THREE.Line(geometry, material)
}

/**
 * Crear líneas radiales desde el centro hacia cada vértice (como pizza 🍕)
 */
export function createPolygonRadials(sides, radius) {
    const group = new THREE.Group()

    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, 0)
        ]

        const colors = new Float32Array(6)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            linewidth: 2,
            transparent: true,
            opacity: 0.4
        })

        const line = new THREE.Line(geometry, material)
        line.userData.index = i
        group.add(line)
    }

    return group
}

/**
 * Actualizar colores de las líneas radiales con animación
 */
export function updateRadialColors(polygonRadials, timeOffset) {
    if (!polygonRadials) return

    const sides = polygonRadials.children.length

    polygonRadials.children.forEach((line, i) => {
        const colors = line.geometry.attributes.color
        const t = ((i / sides) + timeOffset) % 1

        // Color del centro (más oscuro/sutil)
        const centerColor = new THREE.Color(spiritualColors.cosmic)
        centerColor.multiplyScalar(0.3)

        // Color del vértice (brillante)
        const vertexColor = getGradientColor(t)

        colors.setXYZ(0, centerColor.r, centerColor.g, centerColor.b)
        colors.setXYZ(1, vertexColor.r, vertexColor.g, vertexColor.b)
        colors.needsUpdate = true
    })
}

/**
 * Actualizar colores del polígono con animación
 */
export function updatePolygonColors(polygonOutline, polygonRadials, timeOffset) {
    if (!polygonOutline) return

    const colors = polygonOutline.geometry.attributes.color
    const sides = colors.count - 1

    for (let i = 0; i <= sides; i++) {
        const t = ((i / sides) + timeOffset) % 1
        const color = getGradientColor(t)
        colors.setXYZ(i, color.r, color.g, color.b)
    }

    colors.needsUpdate = true
    updateRadialColors(polygonRadials, timeOffset)
}

/**
 * Calcular perímetro del polígono inscrito
 */
export function calculatePolygonPerimeter(sides, radius) {
    const sideLength = 2 * radius * Math.sin(Math.PI / sides)
    return sides * sideLength
}

/**
 * Aproximación de π usando el perímetro
 */
export function approximatePi(sides, radius) {
    const perimeter = calculatePolygonPerimeter(sides, radius)
    return perimeter / (2 * radius)
}
