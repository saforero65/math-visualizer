/**
 * Estilos CSS para la UI
 */
export function injectStyles() {
    const style = document.createElement('style')
    style.textContent = `
    #pi-info {
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(12, 12, 18, 0.85);
        padding: 20px 24px;
        border-radius: 12px;
        font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        z-index: 100;
        min-width: 220px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
    
    .phase-indicator {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 2px;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 12px;
        text-transform: uppercase;
    }
    
    .pi-display {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    .pi-symbol-small {
        font-size: 28px;
        font-weight: 300;
        font-style: italic;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .pi-approx {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.3);
    }
    
    #pi-value {
        font-size: 28px;
        font-weight: 500;
        font-family: 'SF Mono', 'Fira Code', monospace;
        color: #fff;
        letter-spacing: -0.5px;
    }
    
    .stats {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
    }
    
    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .stat-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
        font-weight: 400;
    }
    
    .stat-value {
        font-size: 13px;
        font-family: 'SF Mono', 'Fira Code', monospace;
        color: rgba(255, 255, 255, 0.8);
    }
    
    #error-value {
        transition: color 0.3s ease;
    }
    
    .formula-section {
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    #formula-display {
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
        line-height: 1.8;
    }
    
    #formula-display .katex {
        font-size: 1em;
        color: rgba(255, 255, 255, 0.7);
    }
    
    #final-text {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Georgia', serif;
        color: #fff;
        opacity: 0;
        transition: opacity 2s;
        z-index: 200;
        pointer-events: none;
        padding: 40px 60px;
        border-radius: 24px;
        background: rgba(5, 5, 16, 0.7);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    #final-text.visible {
        opacity: 1;
    }
    
    #final-text .pi-symbol {
        font-size: 120px;
        background: linear-gradient(45deg, #ffd700, #f72585, #9d4edd, #4cc9f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)); }
        to { filter: drop-shadow(0 0 40px rgba(247, 37, 133, 0.6)); }
    }
    
    #final-text .message {
        font-size: 20px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 20px;
        line-height: 1.8;
        font-weight: 300;
    }
    
    .lil-gui {
        --background-color: rgba(12, 12, 18, 0.85) !important;
        --widget-color: rgba(255, 255, 255, 0.1) !important;
        --hover-color: rgba(255, 255, 255, 0.15) !important;
        --focus-color: rgba(255, 255, 255, 0.2) !important;
        --number-color: rgba(255, 255, 255, 0.7) !important;
        --string-color: rgba(255, 255, 255, 0.7) !important;
    }
    
    /* ========================================
       RESPONSIVE - MOBILE
       ======================================== */
    
    @media (max-width: 768px) {
        #pi-info {
            top: auto;
            bottom: 20px;
            left: 10px;
            right: 10px;
            min-width: auto;
            padding: 16px 20px;
            border-radius: 16px;
        }
        
        .phase-indicator { font-size: 9px; margin-bottom: 8px; }
        .pi-display { margin-bottom: 12px; padding-bottom: 12px; gap: 6px; }
        .pi-symbol-small { font-size: 22px; }
        .pi-approx { font-size: 16px; }
        #pi-value { font-size: 22px; }
        
        .stats {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .stat-row {
            flex: 1;
            min-width: 80px;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
        }
        
        .stat-label { font-size: 10px; }
        .stat-value { font-size: 14px; font-weight: 500; }
        .formula-section { padding-top: 12px; }
        
        #formula-display {
            font-size: 12px;
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }
        
        #formula-display > div { margin-bottom: 0 !important; }
        #final-text .pi-symbol { font-size: 80px; }
        #final-text .message { font-size: 16px; padding: 0 10px; white-space: nowrap; }
        #final-text { padding: 30px 40px; border-radius: 20px; }
        .lil-gui { display: none !important; }
    }
    
    /* Controles táctiles */
    #touch-controls {
        display: none;
        position: fixed;
        top: 20px;
        right: 20px;
        gap: 12px;
        z-index: 9999;
        flex-direction: row;
    }
    
    @media (max-width: 768px), (pointer: coarse) {
        #touch-controls { display: flex !important; }
    }
    
    .control-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.25);
        background: rgba(12, 12, 18, 0.9);
        backdrop-filter: blur(20px);
        color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        -webkit-tap-highlight-color: transparent;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    
    .control-btn:active {
        transform: scale(0.92);
        background: rgba(255, 255, 255, 0.1);
    }
    
    .control-btn svg { width: 28px; height: 28px; }
    .control-btn.playing .icon-play { display: none; }
    .control-btn.playing .icon-pause { display: block !important; }
    
    @media (max-width: 480px) {
        #pi-info { left: 8px; right: 8px; bottom: 12px; padding: 14px 16px; }
        .pi-symbol-small { font-size: 20px; }
        #pi-value { font-size: 20px; }
        .stats { gap: 8px; }
        .stat-row { min-width: 70px; }
        #final-text .pi-symbol { font-size: 60px; }
        #final-text .message { font-size: 13px; }
        #final-text { padding: 24px 28px; max-width: 90vw; }
    }
    
    @media (max-height: 500px) and (orientation: landscape) {
        #pi-info {
            top: 10px;
            bottom: auto;
            left: 10px;
            right: auto;
            max-width: 200px;
            padding: 12px 16px;
        }
        .pi-display { margin-bottom: 8px; padding-bottom: 8px; }
        .pi-symbol-small { font-size: 18px; }
        #pi-value { font-size: 18px; }
        .stats { gap: 4px; margin-bottom: 8px; }
        .formula-section { display: none; }
        #final-text .pi-symbol { font-size: 50px; }
        #final-text .message { font-size: 12px; }
    }
`
    document.head.appendChild(style)
}
