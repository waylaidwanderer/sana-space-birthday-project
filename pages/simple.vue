<script setup>
import cardData from '../assets/data.json';
import helpers from '../helpers';

const cards = ref([]);

cards.value = cardData
    .filter(card => card.message)
    .map((card) => {
        if (card.art_index) {
            card.thumbnail = `/art/thumbnails/${card.art_index.toString().padStart(2, '0')}.png`;
            card.src = `/art/full/${card.art_index.toString().padStart(2, '0')}.jpg`;
        }
        return card;
    });
</script>

<template>
    <div class="bg-[#191e2f]">
        <div
            v-for="(card, index) in cards"
            :key="index"
        >
            <div class="header text-center text-3xl pt-10 pb-5">
                Submitted by
                <strong
                    v-if="card"
                    class="font-bold text-slate-300"
                    v-html="helpers.transformName(card.name)"
                />
            </div>
            <div class="flex mx-auto w-3/5 pb-10">
                <a
                    v-if="card.src"
                    :href="card.src"
                    target="_blank"
                    class="block w-28 h-28 mr-3"
                >
                    <img
                        :src="card.thumbnail"
                        alt=""
                        class="w-28 h-28"
                    />
                </a>
                <p
                    v-if="card.message"
                    class="whitespace-pre-wrap break-words text-xl"
                >{{ card.message }}</p>
            </div>
            <hr v-if="index !== cards.length - 1"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
* {
    font-family: "Itim", sans-serif;
}

img {
    max-width: initial;
}

.header {
    font-family: "Kalam", sans-serif;
    font-weight: 300;
}

$break-color: rgb(200, 200, 200);
$page-color: #191e2f;

hr {
    background-color: transparent;
    border: 0;
    border-top: 1px solid $break-color;
    height: 1px;
    margin: 2rem auto;
    text-align: center;
    @apply w-3/5;

    &:before {
        background-color: $page-color;
        color: darken($break-color, 20%);
        content: '\25C8';
        display: inline-block;
        font-size: 20px;
        left: 50%;
        letter-spacing: 0;
        line-height: 1;
        text-indent: -1px;
        text-rendering: geometricPrecision;
        transform: translateY(-53%);
        width: 15px;
    }
}
</style>
