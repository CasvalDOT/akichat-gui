<template>
  <div v-if="media.length > 0" class="grid grid-cols-6 sm:grid-cols-3 gap-4">
    <div v-for="(m, i) in media" :key="i">
      <!-- Render image -->
      <img
        v-if="m.type === 'image'"
        lazy="true"
        :src="m.src"
        alt=""
        class="rounded-xl col-span-1 shadow-lg"
        @click="showOnPopup(m.src)"
      />

      <!-- Render video -->
      <iframe
        v-if="m.type === 'video'"
        width="500"
        lazy="true"
        height="315"
        :src="m.src"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  </div>
  <aki-modal :is-open="imageFocus" class="z-50 justify-center items-center" @close="imageFocus = null">
    <img :src="imageFocus" class="w-3/4 rounded-xl object-contains" />
  </aki-modal>
</template>

<script setup>
import { ref } from 'vue'
import AkiModal from './AkiModal.vue'

defineProps({
  media: {
    type: Array,
    default: () => [],
  },
})

const imageFocus = ref(null)

function showOnPopup(image) {
  imageFocus.value = image
}
</script>
