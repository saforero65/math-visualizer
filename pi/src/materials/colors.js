import * as THREE from 'three'

/**
 * Paleta de colores espirituales/místicos
 */
export const spiritualColors = {
    cosmic: 0x9d4edd,      // Violeta cósmico
    divine: 0xf72585,      // Rosa divino
    ethereal: 0x4cc9f0,    // Cyan etéreo
    golden: 0xffd700,      // Dorado sagrado
    aurora: 0x7fff00,      // Verde aurora
    nebula: 0xff6b6b,      // Rojo nebulosa
    astral: 0x4361ee,      // Azul astral
}

/**
 * Materiales predefinidos
 */
export const outlineMaterial = new THREE.LineBasicMaterial({
    color: spiritualColors.ethereal,
    linewidth: 3,
    transparent: true,
    opacity: 1
})

export const circleRefMaterial = new THREE.LineBasicMaterial({
    color: spiritualColors.golden,
    linewidth: 2,
    transparent: true,
    opacity: 0.6
})

export const axisMaterial = new THREE.LineBasicMaterial({
    color: spiritualColors.golden,
    transparent: true,
    opacity: 0.9
})

/**
 * Interpolar color según posición en gradiente espiritual
 * @param {number} t - Valor entre 0 y 1
 * @returns {THREE.Color}
 */
export function getGradientColor(t) {
    const color = new THREE.Color()

    if (t < 0.25) {
        color.lerpColors(
            new THREE.Color(spiritualColors.ethereal),
            new THREE.Color(spiritualColors.cosmic),
            t * 4
        )
    } else if (t < 0.5) {
        color.lerpColors(
            new THREE.Color(spiritualColors.cosmic),
            new THREE.Color(spiritualColors.divine),
            (t - 0.25) * 4
        )
    } else if (t < 0.75) {
        color.lerpColors(
            new THREE.Color(spiritualColors.divine),
            new THREE.Color(spiritualColors.golden),
            (t - 0.5) * 4
        )
    } else {
        color.lerpColors(
            new THREE.Color(spiritualColors.golden),
            new THREE.Color(spiritualColors.ethereal),
            (t - 0.75) * 4
        )
    }

    return color
}
