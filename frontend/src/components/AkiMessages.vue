<template>
  <div class="flex justify-end flex-col w-full gap-y-8">
    <aki-message
      v-for="message in value"
      :id="message.id"
      :key="message.id"
      :me="message.me"
      :content="message.content"
      :time="message.time"
      :author="message.author"
      :type="message.type"
      :color="message.color"
      :variant="variant"
      @click-user="$emit('click-user', message.author)"
    />
  </div>
</template>

<script setup>
import AkiMessage from './AkiMessage.vue'

defineEmits(['click-user'])

defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  variant: {
    type: String,
    default: 'fill',
  },
})
</script>
