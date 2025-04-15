// Nueva clase LoaderService usando SpinKit
import { storeConfig } from '../config/config.js';

export class LoaderService {
    static initLoader() {
        const loaderConfig = storeConfig.site.loader;
        const loaderContainer = document.getElementById('lottie-loader') || document.getElementById('loader-container');
        const loaderText = document.querySelector('.loader-text');
        
        if (loaderContainer) {
            // Limpiar contenedor
            loaderContainer.innerHTML = '';
            
            // Crear animación perfume con SpinKit modificado
            const spinnerHTML = `
                <div class="perfume-loader">
                    <div class="bottle">
                        <div class="cap"></div>
                        <div class="neck"></div>
                        <div class="body">
                            <div class="liquid"></div>
                            <div class="shine"></div>
                        </div>
                    </div>
                </div>
                <style>
                    .perfume-loader {
                        width: 100px;
                        height: 150px;
                        margin: 0 auto;
                        position: relative;
                    }
                    .bottle {
                        position: relative;
                        animation: pulse 2s infinite;
                    }
                    .cap {
                        width: 30px;
                        height: 20px;
                        background: #9f8170;
                        border-radius: 5px;
                        margin: 0 auto;
                    }
                    .neck {
                        width: 15px;
                        height: 15px;
                        background: #b99784;
                        margin: 0 auto;
                    }
                    .body {
                        width: 70px;
                        height: 100px;
                        background: rgba(220, 204, 223, 0.7);
                        border-radius: 15px;
                        margin: 0 auto;
                        overflow: hidden;
                        position: relative;
                    }
                    .liquid {
                        width: 100%;
                        height: 0%;
                        background: #c896e0;
                        position: absolute;
                        bottom: 0;
                        animation: fillEmpty 3s infinite ease-in-out;
                    }
                    .shine {
                        width: 10px;
                        height: 30px;
                        background: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 20px;
                        right: 15px;
                        opacity: 0;
                        animation: shine 3s infinite ease-in-out;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }
                    @keyframes fillEmpty {
                        0% { height: 0%; }
                        50% { height: 60%; }
                        100% { height: 0%; }
                    }
                    @keyframes shine {
                        0% { opacity: 0; }
                        50% { opacity: 0.7; }
                        100% { opacity: 0; }
                    }
                </style>
            `;
            
            loaderContainer.innerHTML = spinnerHTML;
        }

        if (loaderText && loaderConfig.loadingText) {
            loaderText.textContent = loaderConfig.loadingText;
        }
    }

    static showLoader() {
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) {
            loaderOverlay.style.display = 'flex';
        } else {
            console.warn("No se encontró .loader-overlay en el DOM.");
        }
    }       

    static hideLoader() {
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) loaderOverlay.style.display = 'none';
    }
}


// import { storeConfig } from '../config/config.js';

// export class LoaderService {

//     static initLoader() {
//         const loaderConfig = storeConfig.site.loader;
//         const loaderContainer = document.getElementById('lottie-loader');
//         const loaderText = document.querySelector('.loader-text');

//         if (loaderContainer && loaderConfig.animationUrl) {
//             lottie.loadAnimation({
//                 container: loaderContainer,
//                 renderer: 'svg',
//                 loop: true,
//                 autoplay: true,
//                 path: loaderConfig.animationUrl
//             });
//         }

//         if (loaderText && loaderConfig.loadingText) {
//             loaderText.textContent = loaderConfig.loadingText;
//         }
//     }

//     static showLoader() {
//         const loaderOverlay = document.querySelector('.loader-overlay');
//         if (loaderOverlay) {
//             loaderOverlay.style.display = 'flex';
//         } else {
//             console.warn("No se encontró .loader-overlay en el DOM.");
//         }
//     }       

//     static hideLoader() {
//         const loaderOverlay = document.querySelector('.loader-overlay');
//         if (loaderOverlay) loaderOverlay.style.display = 'none';
//     }
// }