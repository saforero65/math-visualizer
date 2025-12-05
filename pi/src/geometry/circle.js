import * as THREE from 'three'
import { axisMaterial, spiritualColors } from '../materials/colors.js'

/**
 * Crear círculo de referencia con degradado dorado/rosa
 */
export function createCircleReference(radius) {
    const points = []
    const segments = 128

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        points.push(new THREE.Vector3(x, y, 0))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const colors = new Float32Array((segments + 1) * 3)
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        linewidth: 2,
        transparent: true,
        opacity: 0.5
    })

    return new THREE.Line(geometry, material)
}

/**
 * Actualizar colores del círculo de referencia con animación
 */
export function updateCircleColors(circleOutline, timeOffset) {
    if (!circleOutline) return

    const colors = circleOutline.geometry.attributes.color
    const segments = colors.count - 1

    for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const color = new THREE.Color()
        const wave = Math.sin((t * Math.PI * 4) + timeOffset * 3) * 0.5 + 0.5
        color.lerpColors(
            new THREE.Color(spiritualColors.golden),
            new THREE.Color(spiritualColors.divine),
            wave
        )
        colors.setXYZ(i, color.r, color.g, color.b)
    }

    colors.needsUpdate = true
}

/**
 * Crear eje de revolución (eje Y)
 */
export function createAxis(radius) {
    const points = [
        new THREE.Vector3(0, -radius * 1.8, 0),
        new THREE.Vector3(0, radius * 1.8, 0)
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return new THREE.Line(geometry, axisMaterial)
}
