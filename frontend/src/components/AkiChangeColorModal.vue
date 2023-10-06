<template>
  <aki-modal :is-open="isOpen" @close="$emit('close')">
    <div class="flex-col w-1/3 flex-wrap items-center flex gap-y-6">
      <div class="flex-wrap flex gap-4">
        <div
          v-for="(c, i) in availableColors"
          :key="c"
          class="hover:scale-105 transition-transform duration-200 cursor-pointer rounded-xl w-12 h-12"
          :style="{ background: c[400] }"
          @click="handleColorSelection(i)"
        ></div>
      </div>
    </div>
  </aki-modal>
</template>

<script setup>
import { computed } from 'vue'
import { getAvailableColors } from '../tools/colors'
import AkiModal from './AkiModal.vue'

const emits = defineEmits(['select-color', 'close'])

defineProps({
  me: {
    type: Object,
    default: () => ({ color: { 400: '#dedede' } }),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

function handleColorSelection(color) {
  emits('select-color', color)
}

const availableColors = computed(() => getAvailableColors())
</script>
