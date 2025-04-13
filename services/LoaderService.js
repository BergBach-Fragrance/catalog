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
            console.log("Mostrando loader...");
            loaderOverlay.style.display = 'flex';
        }
    }    

    static hideLoader() {
        const loaderOverlay = document.querySelector('.loader-overlay');
        if (loaderOverlay) loaderOverlay.style.display = 'none';
    }

    static showProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        let progress = 0;

        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 1;
                progressBar.style.width = `${progress}%`;
            } else {
                clearInterval(interval);
            }
        }, 10);
    }
}