import { VueFinalModal, vfmPlugin } from 'vue-final-modal';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('vue-final-modal', VueFinalModal);
    nuxtApp.vueApp.use(vfmPlugin);
});
