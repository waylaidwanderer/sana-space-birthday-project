import { VueFinalModal } from 'vue-final-modal';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('vue-final-modal', VueFinalModal);
});
