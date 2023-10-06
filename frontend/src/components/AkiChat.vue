<template>
  <div ref="scrollableView" class="w-full h-screen overflow-y-auto">
    <div>
      <!-- List of messages -->
      <div class="flex min-h-screen h-full flex-col p-10">
        <aki-messages :variant="!to ? 'fill' : 'outline'" :value="messages" @click-user="$emit('click-user', $event)" />
      </div>

      <!-- Prompt message -->
      <div class="sticky w-full bottom-0">
        <aki-prompt :to="to" @submit="$emit('submit')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import AkiMessages from './AkiMessages.vue'
import AkiPrompt from './AkiPrompt.vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  to: {
    type: String,
    default: '',
  },
})

defineEmits(['submit', 'click-user'])

const scrollableView = ref(null)
const scrolling = ref(false)

function handleScroll() {
  const isBottom =
    scrollableView.value.scrollHeight - (scrollableView.value.scrollTop + scrollableView.value.clientHeight) === 0

  if (isBottom) {
    scrolling.value = false
  } else {
    scrolling.value = true
  }
}

function scrollDown() {
  setTimeout(() => {
    if (scrolling.value) {
      return
    }

    scrollableView.value.scrollTo(0, scrollableView.value.scrollHeight + 1000)
  }, 100)
}

watch(
  () => props.messages,
  () => {
    if (!scrollableView.value) {
      return
    }
    const isBottom =
      scrollableView.value.scrollHeight - (scrollableView.value.scrollTop + scrollableView.value.clientHeight) === 0
    if (isBottom) {
      scrollDown()
    }
  },
  { deep: true },
)

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  scrollDown()
})
</script>
