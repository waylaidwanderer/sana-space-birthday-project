import VideoBackground from 'vue-responsive-video-background-player';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('video-background', VideoBackground);
});
