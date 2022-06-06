<script setup>
import ArtModal from '../components/ArtModal';
import helpers from '../helpers';

const customClassNames = [];

const showArtModal = ref(false);
const isFront = ref(true);
const buttonText = computed(() => `${isFront.value ? 'View' : '← View'} ${isFront.value ? 'Back →' : 'Front'}`);
const expandedArt = ref(null);

const changeCardSide = () => {
    isFront.value = !isFront.value;
};

const expandArt = ({ data, el }) => {
    const className = `square-${data.art_index}-${window.innerWidth}-${window.innerHeight}`;
    if (!customClassNames.includes(className)) {
        const { distanceFromCenterX, distanceFromCenterY } = helpers.calculateDistanceFromCenterpointXY(el);
        // create a custom transition class to make it look like the modal is appearing from the art square
        const style = document.createElement('style');
        style.innerHTML = `
            .${className}-enter-active,
            .${className}-leave-active {
                transition: all 0.5s ease;
            }

            .${className}-enter-from,
            .${className}-leave-to {
                transform: translateX(${distanceFromCenterX}px) translateY(${distanceFromCenterY}px) scale(0.2);
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
        customClassNames.push(className);
    }
    data.transitionClassName = className;
    expandedArt.value = data;
    showArtModal.value = true;
};

const onArtModalClosed = () => {
    expandedArt.value = null;
};

const onArtModalOpen = () => {
    nextTick(() => {
        expandedArt.value.thumbnail = expandedArt.value.src;
    });
};
</script>

<template>
    <div>
        <Head>
            <Title>Sana's Space Birthday Card</Title>
        </Head>

        <div class="card-container">
            <div
                class="wrapper"
            >
                <ArtSquare
                    v-for="index in 35"
                    :key="index"
                    :index="index"
                    :is-front="isFront"
                    @expand="expandArt"
                />
            </div>
            <div class="card-nav">
                <Transition name="slide-fade" mode="out-in">
                    <button @click="changeCardSide" :key="buttonText">{{ buttonText }}</button>
                </Transition>
            </div>
        </div>

        <ArtModal
            v-model="showArtModal"
            @closed="onArtModalClosed"
            @before-open="onArtModalOpen"
            :transition="expandedArt?.transitionClassName"
        >
            <template v-slot:title>
                Submitted by
                <strong
                    v-if="expandedArt"
                    class="font-bold text-slate-300 break-normal"
                    v-html="helpers.transformName(expandedArt.name)"
                />
            </template>
            <div
                class="px-2"
            >
                <a
                    :href="expandedArt?.full_src"
                    target="_blank"
                >
                    <img
                        :src="expandedArt?.thumbnail"
                        alt=""
                        class="w-[80vh] mx-auto block"
                    />
                </a>
                <p
                    v-if="expandedArt?.message"
                    class="max-w-[80vw] whitespace-pre-wrap break-words pt-3 text-xl"
                >{{ expandedArt.message }}</p>
            </div>
        </ArtModal>

        <div class="video-container">
            <video-background
                src="/cam1.mp4"
                class="z-[1]"
                :style="{ opacity: isFront ? 1 : 0 }"
            />
            <video-background
                src="/cam2.mp4"
            />
        </div>
    </div>
</template>

<style lang="scss">
.video-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    filter: blur(2px);
    @apply mx-auto flex items-center justify-center;

    $zoom: 1.2;

    .vue-responsive-videobg {
        width: calc(640px * #{$zoom}) !important;
        height: calc(640px * (1080/1920) * #{$zoom}) !important;
        transition: opacity 0.5s, margin-top 0.5s;
        position: absolute !important;
        margin-top: -4%;

        .video-wrapper {
            @apply mx-auto;
        }
    }

    @media only screen
    and (min-width: 768px) {
        .vue-responsive-videobg {
            width: calc(768px * #{$zoom}) !important;
            height: calc(768px * (1080/1920) * #{$zoom}) !important;
        }
    }

    @media only screen
    and (min-width: 1024px) {
        .vue-responsive-videobg {
            width: calc(1024px * #{$zoom}) !important;
            height: calc(1024px * (1080/1920) * #{$zoom}) !important;
        }
    }

    @media only screen
    and (min-width: 1280px) {
        .vue-responsive-videobg {
            width: calc(1280px * #{$zoom}) !important;
            height: calc(1280px * (1080/1920) * #{$zoom}) !important;
        }
    }

    @media only screen
    and (min-width: 1536px) {
        .vue-responsive-videobg {
            width: calc(1536px * #{$zoom}) !important;
            height: calc(1536px * (1080/1920) * #{$zoom}) !important;
        }
    }

    @media only screen
    and (min-width: 1920px) {
        .vue-responsive-videobg {
            width: calc(1920px * #{$zoom}) !important;
            height: calc(1920px * (1080/1920) * #{$zoom}) !important;
            margin-top: -5%;
        }
    }

    @media only screen
    and (min-width: 2274px) {
        .vue-responsive-videobg {
            margin-top: -4%;
        }
    }

    @media only screen
    and (min-width: 2560px) {
        .vue-responsive-videobg {
            width: calc(1920px * #{$zoom}) !important;
            height: calc(1920px * (1080/1920) * #{$zoom}) !important;
        }
    }

    @media only screen
    and (min-width: 3100px) {
        .vue-responsive-videobg {
            margin-top: -3%;
        }
    }

    @media only screen
    and (min-width: 4100px) {
        .vue-responsive-videobg {
            margin-top: -2.5%;
        }
    }

    @media only screen
    and (min-width: 4800px) {
        .vue-responsive-videobg {
            margin-top: -2%;
        }
    }
}
</style>

<style lang="scss" scoped>
.card-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .card-nav {
        @apply absolute bottom-0 w-full text-center;
        @apply bg-gradient-to-t from-slate-700;
        height: 13%;
        z-index: 100;

        button {
            @apply text-5xl pt-3;
            color: #fff;
            font-family: "Kanit", sans-serif;
            text-shadow: 0 1px 0 #e4adad, 0 2px 0 #e1a6a6, 0 3px 0 #df9e9e, 0 4px 0 #dc9696, 0 5px 0 #da8f8f, 0 6px 0 #d78787, 0 7px 0 #d58080, 0 8px 0 #d27878, 0 0 5px rgba(237, 154, 154, .05), 0 -1px 3px rgba(237,154,154,.2), 0 9px 9px rgba(237,154,154, .5),0 12px 12px rgba(237, 154, 154, .5), 0 15px 15px rgba(237,154,154, .5);
        }
    }

    .wrapper {
        @apply shadow-pretty mx-auto relative flex;
        max-width: 1025px;
        max-height: 80%;
        flex-wrap: wrap;
        width: 80%;
        color: #d2d2d2;
        background: white url('~/assets/img/card_background.jpg') no-repeat;
        background-size: cover;
        transition: width 0.3s;
    }

    @media only screen
    and (min-width: 680px) {
        .wrapper {
            width: 53%;
        }
    }
}
</style>
