<script setup>
// Credits: star field design from https://codepen.io/sarazond/pen/LYGbwj
import cardData from '../assets/data.json';
import helpers from '../helpers';

const customClassNames = [];

const showModal = ref(false);
const cards = reactive([]);
const viewedCards = ref([]);
const currentCard = ref(null);
const currentCardName = ref('');
const infoTextIndex = ref(1);
const showMessagesWithArt = ref(null);

const randomNumber = (min, max) =>  Math.random() * (max - min) + min;

const onStarClick = (card, index, event) => {
    const className = `star-${index}-${window.innerWidth}-${window.innerHeight}`;
    if (!customClassNames.includes(className)) {
        const { distanceFromCenterX, distanceFromCenterY } = helpers.calculateDistanceFromCenterpointXY(event.target);
        // create a custom transition class to make it look like the modal is appearing from the art square
        const style = document.createElement('style');
        style.innerHTML = `
            .${className}-enter-active,
            .${className}-leave-active {
                transition: all 0.5s ease;
            }

            .${className}-enter-from,
            .${className}-leave-to {
                transform: translateX(${distanceFromCenterX}px) translateY(${distanceFromCenterY}px) scale(0);
            }
        `;
        document.getElementsByTagName('head')[0].appendChild(style);
        customClassNames.push(className);
    }
    card.transitionClassName = className;

    if (!viewedCards.value.includes(card.name)) {
        viewedCards.value.push(card.name);
    }
    currentCard.value = card;
    currentCardName.value = card.name;

    try {
        window.localStorage.setItem('history', JSON.stringify({
            viewedCards: viewedCards.value,
            currentCardName: currentCardName.value,
        }));
    } catch (err) {
        // ignore write error
    }

    nextTick(() => {
        showModal.value = true;
    });
};

const onArtModalClosed = () => {
    currentCard.value = null;
};

const clearViewingHistory = () => {
    if (!confirm('Are you sure you want to clear the viewing history?')) {
        return;
    }

    viewedCards.value = [];
    currentCardName.value = '';

    try {
        window.localStorage.removeItem('history')
    } catch (err) {
        // ignore access error
    }
};

onBeforeMount(() => {
    try {
        const localStorage = JSON.parse(window.localStorage.getItem('history'));
        viewedCards.value = localStorage.viewedCards;
        currentCardName.value = localStorage.currentCardName;
    } catch (err) {
        // ignore read/parsing error
    }

    cardData
        .filter(card => card.message)
        .map((card) => {
            let src = null;
            if (card.art_index) {
                src = `/art/thumbnails/${card.art_index.toString().padStart(2, '0')}.png`;
            }
            card.src = src;
            return card;
        })
        .forEach((card) => {
            let left, top;
            // pretty lazy way to attempt to make sure stars aren't placed too close to one another, but hey, it works
            for (let i = 0; i < 1000; i++) {
                left = randomNumber(2, 98);
                top = randomNumber(2, 98);
                // quick attempt to keep middle (where the text is) somewhat clear
                if (left > 30 && left < 70 && top > 40 && top < 70) {
                    continue;
                }
                const existsStarTooClose = cards.find(listCard => Math.abs(listCard.left - left) <= 2 && Math.abs(listCard.top - top) <= 2);
                if (!existsStarTooClose) {
                    break;
                }
            }
            cards.push({
                ...card,
                left,
                top,
            });
        });

    setInterval(() => {
        if (infoTextIndex.value === 1) {
            infoTextIndex.value = 2;
        } else if (infoTextIndex.value === 2) {
            infoTextIndex.value = 1;
        }
    }, 6500);
});
</script>

<template>
    <div>
        <div class="absolute top-0 left-0 mt-3 ml-3 text-xs">
            <NuxtLink to="/" class="mb-3 block text-sm font-bold">← Back</NuxtLink>
            <div class="mb-1">
                <input
                    v-model="showMessagesWithArt"
                    type="checkbox"
                    id="show-messages-with-art"
                />
                <label
                    for="show-messages-with-art"
                    class="ml-1 cursor-pointer"
                >Show Messages With Art</label>
            </div>
            <button class="block underline" @click="clearViewingHistory">Clear Viewing History</button>
        </div>

        <div class="stars-container">
            <Head>
                <Title>Sana's Space Birthday Messages</Title>
            </Head>
            <div class="stars"></div>
            <div class="stars2"></div>
            <div class="stars3">
                <div
                    v-for="(card, index) in cards"
                    :key="index"
                    class="star"
                    :class="{
                        viewed: viewedCards.includes(card.name),
                        current: currentCardName === card.name,
                        hidden: !showMessagesWithArt && card.art_index
                    }"
                    :style="{ left: `${card.left}%`, top: `${card.top}%`, 'animation-delay': `${index * 33}ms` }"
                    @click="onStarClick(card, index, $event)"
                />
            </div>
            <div class="title">
                <span>We Love You Sana</span>
                <br/>
                <span>Happy Birthday!</span>
                <br/>
                <Transition name="fade" mode="out-in">
                    <span v-if="infoTextIndex === 1" class="info">(pick a star)</span>
                    <span v-else-if="infoTextIndex === 2" class="info">(stars shiny wonderful wow)</span>
                </Transition>
            </div>
        </div>

        <MessagesModal
            v-model="showModal"
            @closed="onArtModalClosed"
            :transition="currentCard?.transitionClassName"
        >
            <template v-slot:title>
                Submitted by
                <strong
                    v-if="currentCard"
                    class="font-bold text-slate-300"
                    v-html="helpers.transformName(currentCard.name)"
                />
            </template>
            <div
                v-if="currentCard"
                class="flex flex-col md:flex-row items-center md:items-start pr-2"
            >
                <img
                    v-if="currentCard.src"
                    :src="currentCard.src"
                    alt=""
                    class="block w-28 h-28 mr-3 mb-3 md:mb-0"
                />
                <p
                    class="w-full whitespace-pre-wrap break-words text-xl"
                >{{ currentCard.message }}</p>
            </div>
        </MessagesModal>
    </div>
</template>

<style lang="scss" scoped>
@function multiple-box-shadow($n) {
    $value: '#{random(2000)}px #{random(2000)}px #FFF';
    @for $i from 2 through $n {
        $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
    }
    @return unquote($value);
}

$shadows-small: multiple-box-shadow(700);
$shadows-medium: multiple-box-shadow(200);
$shadows-big: multiple-box-shadow(100);

.stars-container {
    height: 100vh;
    overflow: hidden;
}

.stars3 {
    .star {
        z-index: 10;
        position: absolute;
        height: 7px;
        width: 7px;
        background: white;
        cursor: pointer;
        opacity: 0.9;
        animation: starGlow 5s linear infinite;
        transition: all 0.5s ease;

        &.viewed {
            opacity: 0.4;
            @apply bg-amber-500;
            z-index: 9;
        }

        &:hover {
            opacity: 1;
            transform: scale(3) !important;
        }

        &.current {
            opacity: 0.7;
            transform: scale(2);
        }
    }
}

.stars {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: $shadows-small;
    animation: animStar 300s linear infinite;
    opacity: 0.3;

    &:after {
        content: " ";
        position: absolute;
        top: 2000px;
        width: 1px;
        height: 1px;
        background: transparent;
        box-shadow: $shadows-small;
    }
}

.stars2 {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: $shadows-medium;
    animation: animStar 600s linear infinite;
    opacity: 0.5;

    &:after {
        content: " ";
        position: absolute;
        top: 2000px;
        width: 2px;
        height: 2px;
        background: transparent;
        box-shadow: $shadows-medium;
    }
}

.title {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;

    color: #FFF;
    text-align: center;
    font-family: 'Kalam', sans-serif;
    font-weight: 300;
    @apply md:text-7xl sm:text-4xl;
    letter-spacing: 10px;

    margin-top: -60px;
    padding-left: 10px;

    span {
        background: linear-gradient(90deg, rgba(255,62,164,1) 0%, rgba(245,233,239,1) 49%, rgba(245,233,239,1) 51%, rgba(76,67,229,1) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;

        &.info {
            @apply sm:text-base md:text-2xl;
            transition: all 0.3s ease;
        }
    }
}

@keyframes animStar {
    from {
        transform: translateY(0px);
    }
    to {
        transform: translateY(-2000px);
    }
}

@keyframes starGlow {
    0% {
        box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.05);
    }
    50% {
        box-shadow: 0 0 13px 4px rgba(255, 255, 255, 0.5);
    }
    100% {
        box-shadow: 0 0 10px 4px rgba(255, 255, 255, 0.06);
    }
}
</style>
