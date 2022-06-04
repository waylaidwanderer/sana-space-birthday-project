<script setup>
import { MailIcon, ZoomInIcon, MailOpenIcon } from '@heroicons/vue/outline';
import cardData from '../assets/data.json';
const frontArtList = [
    36, 37, 38, 39, 40, 41, 42,
    43, 44, null, null, null, 48, 49,
    45, null, null, null, null, null, 46,
    57, 47, null, null, null, 0, 58,
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
    if (realIndex.value === null) {
        return {};
    }
    const artData = cardData.find(data => data.art_index === realIndex.value);
    return {
        ...artData,
        thumbnail: `/art/thumbnails/${realIndex.value.toString().padStart(2, '0')}.png`,
        src: `/art/${realIndex.value.toString().padStart(2, '0')}.jpg`,
    };
});

const viewArt = () => {
    if (realIndex.value === null) {
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
                v-if="realIndex !== null"
                class="icon-overlay"
            >
                <MailOpenIcon v-if="realIndex === 0" class="w-10 h-10 text-slate-200 block"/>
                <ZoomInIcon v-else class="w-10 h-10 text-slate-200 block"/>
            </div>
            <Transition name="fade" mode="out-in">
                <div v-if="isFront" >
                    <img :src="imageData.thumbnail" alt="">
                    <div
                        v-if="imageData.message"
                        class="absolute bottom-0 right-0 bg-neutral-600 bg-opacity-50 rounded-tl-sm"
                    >
                        <MailIcon class="w-5 h-5 text-yellow-400 block"/>
                    </div>
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
