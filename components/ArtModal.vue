<script setup>
import { XIcon } from '@heroicons/vue/outline';

const scroller = ref(null);

const onModelUpdate = () => {
    scroller.value.scrollTop = 0;
};
</script>

<template>
    <ClientOnly>
        <vue-final-modal
            v-slot="{ params, close }"
            v-bind="$attrs"
            @update:model-value="onModelUpdate"
            classes="flex justify-center items-center"
            content-class="relative flex flex-col max-h-[90%] max-w-[1000px] mx-4 p-4 pb-6 border border-gray-800 rounded bg-white bg-gray-900 shadow-pretty"
        >
        <span class="mr-8 mb-3 text-3xl header text-slate-400">
          <slot name="title"></slot>
        </span>
            <div class="flex-grow overflow-y-auto" ref="scroller">
                <slot :params="params"></slot>
            </div>
            <button class="absolute top-0 right-0 mt-2 mr-2" @click="close">
                <XIcon class="w-5 h-5"/>
            </button>
        </vue-final-modal>
    </ClientOnly>
</template>

<style lang="scss" scoped>
* {
    font-family: "Itim", sans-serif;
}

.header {
    font-family: "Kalam", sans-serif;
    font-weight: 300;
}
</style>
