<script setup>
import { MailIcon, ZoomInIcon, MailOpenIcon } from '@heroicons/vue/outline';
import cardData from '../assets/data.json';
const frontArtList = [
    36, 37, 38, 39, 40, 41, 42,
    43, 44, null, null, null, 48, 49,
    45, null, null, null, null, null, 46,
    57, 47, null, 'youtube', null, 0, 58,
    50, 51, 52, 53, 54, 55, 56,
];

const props = defineProps({
    index: Number,
    isFront: Boolean,
});
const emit = defineEmits(['expand'])

const square = ref(null);
const realIndex = computed(() => {
    if (props.isFront) {
        return frontArtList[props.index - 1];
    }
    return props.index;
});
const imageData = computed(() => {
    if (realIndex.value === null || realIndex.value === 'youtube') {
        return {};
    }
    if (realIndex.value === 0) {
        return {
            thumbnail: `/art/thumbnails/00.gif`,
        };
    }
    const artData = cardData.find(data => data.art_index === realIndex.value);
    return {
        ...artData,
        thumbnail: `/art/thumbnails/${realIndex.value.toString().padStart(2, '0')}.png`,
        src: `/art/${realIndex.value.toString().padStart(2, '0')}.jpg`,
        full_src: `/art/full/${realIndex.value.toString().padStart(2, '0')}.jpg`,
    };
});

const viewArt = () => {
    if (realIndex.value === null || realIndex.value === 'youtube') {
        return true;
    }
    if (realIndex.value === 0) {
        return navigateTo({
            path: '/messages',
        });
    }
    emit('expand', {
        data: imageData.value,
        el: square.value,
    });
    return true;
};
</script>

<template>
    <div
        @click="viewArt"
        class="square"
        :class="{ exists: Boolean(imageData.thumbnail) }"
        ref="square"
    >
        <div class="content">
            <div
                v-if="realIndex !== null && realIndex !== 'youtube'"
                class="icon-overlay"
            >
                <MailOpenIcon v-if="realIndex === 0" class="w-10 h-10 text-slate-200 block"/>
                <ZoomInIcon v-else class="w-10 h-10 text-slate-200 block"/>
            </div>
            <Transition name="fade" mode="out-in">
                <div v-if="isFront">
                    <template v-if="realIndex === 'youtube'">
                        <a
                            href="https://www.youtube.com/watch?v=5QjLshtQGuQ"
                            target="_blank"
                            class="text-[#FF0000] hover:text-red-600 transition duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24"
                                 fill="currentColor"
                                 class="drop-shadow w-5 h-5 sm:h-10 sm:w-10 lg:w-16 lg:h-16"
                            >
                                <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"></path>
                            </svg>
                        </a>
                    </template>
                    <template v-else>
                        <img :src="imageData.thumbnail" alt="">
                        <div
                                v-if="imageData.message"
                                class="absolute bottom-0 right-0 bg-neutral-600 bg-opacity-50 rounded-tl-sm"
                        >
                            <MailIcon class="w-5 h-5 text-yellow-400 block"/>
                        </div>
                    </template>
                </div>
                <div v-else>
                    <img :src="imageData.thumbnail" alt="">
                    <div
                        v-if="imageData.message"
                        class="absolute bottom-0 right-0 bg-neutral-600 bg-opacity-50 rounded-tl-sm"
                    >
                        <MailIcon class="w-5 h-5 text-yellow-400 block"/>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.square {
    position: relative;
    flex-basis: 14.28571428571429%;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    .icon-overlay {
        @apply absolute flex items-center justify-center left-0 top-0 w-full h-full opacity-0 hover:opacity-100 bg-slate-900 bg-opacity-50;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
        z-index: 1;
    }

    &.exists:hover {
        cursor: pointer;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        transform: scale(1.2);
        z-index: 10;
    }

    &::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .content {
        position: absolute;
        top: 0; left: 0;
        height: 100%;
        width: 100%;

        display: flex;               /* added for centered text */
        justify-content: center;     /* added for centered text */
        align-items: center;         /* added for centered text */

        img {
            background: white;
        }
    }
}
</style>
