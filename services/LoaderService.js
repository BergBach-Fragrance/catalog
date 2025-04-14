import { storeConfig } from '../config/config.js';

export class LoaderService {

    static initLoader() {
        const loaderConfig = storeConfig.site.loader;
        const loaderContainer = document.getElementById('lottie-loader');
        const loaderText = document.querySelector('.loader-text');

        if (loaderContainer && loaderConfig.animationUrl) {
            lottie.loadAnimation({
                container: loaderContainer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: loaderConfig.animationUrl
            });
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