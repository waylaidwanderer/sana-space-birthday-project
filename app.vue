<script setup>
import cardBackgroundImg from '~/assets/img/card_background.jpg';

onBeforeMount(() => {
    // preload all images
    const cardBackground = new Image();
    cardBackground.src = cardBackgroundImg;
    for (let i = 58; i >= 1; i--) {
        const thumbnail = new Image();
        thumbnail.src = `/art/thumbnails/${i.toString().padStart(2, '0')}.png`;
        const img = new Image();
        img.src = `/art/${i.toString().padStart(2, '0')}.jpg`;
    }
});
</script>

<template>
    <div>
        <Head>
            <Title>Sana's Space Birthday Project</Title>
            <Meta name="viewport" content="width=device-width, initial-scale=0.86, minimum-scale=0.86, maximum-scale=1.0"/>
            <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1"/>
            <Link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1"/>
            <Link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1"/>
            <Link rel="manifest" href="/site.webmanifest?v=1"/>
            <Link rel="mask-icon" href="/safari-pinned-tab.svg?v=1" color="#5bbad5"/>
            <Link rel="shortcut icon" href="/favicon.ico?v=1"/>
            <Meta name="msapplication-TileColor" content="#2b5797"/>
            <Meta name="theme-color" content="#1b2735"/>
        </Head>
        <NuxtPage/>
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Itim&family=Kalam:wght@300;700&family=Kanit:wght@900&display=swap');

body {
    @apply text-slate-300;
    background: #191e2f radial-gradient(circle at bottom, #1B2735 0%, #090A0F 100%);
    min-height: 100vh;
}

.slide-fade-enter-active {
    transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.15s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.page-enter-from {
    opacity: 0;
}
.page-enter-active,
.page-leave-active {
    transition: all 0.25s ease;
}
.page-enter,
.page-leave-to {
    opacity: 0;
}
</style>
