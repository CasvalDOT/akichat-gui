<template>
  <div
    v-if="isOpen"
    ref="element"
    class="overflow-y-auto transition-all duration-500 fixed top-0 left-0 flex w-screen h-screen bg-primary-dark/75 backdrop-blur-sm"
    :class="loadClasses"
  >
    <slot />

    <aki-button
      class="font-bold text-white fixed right-10 top-10 flex justify-center items-center rounded-full bg-black z-20"
      variant-style="transparent"
      variant="gray"
      @click="handleClose"
    >
      <aki-icon-close fill="white" class="w-8 h-8" />
    </aki-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AkiButton from './AkiButton.vue'
import AkiIconClose from './AkiSvgIcons/AkiIconClose.vue'

const emits = defineEmits(['close'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const element = ref(null)
const loadClasses = ref('opacity-0')

defineExpose({
  element,
})

function handleClose() {
  loadClasses.value = 'opacity-0'
  setTimeout(() => {
    emits('close')
  }, 500)
}

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen) {
      setTimeout(() => {
        loadClasses.value = 'opacity-100'
      }, 100)
    }
  },
)
</script>
