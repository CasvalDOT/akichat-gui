<template>
  <div class="p-6 bg-primary-dark flex flex-col gap-y-2">
    <div class="text-white flex items-center gap-x-2 text-sm">
      <button type="button" class="font-bold" @click.prevent="insertBBCode('b')">Bold</button>
      <button type="button" class="italic" @click.prevent="insertBBCode('i')">Italic</button>
      <button type="button" class="underline" @click.prevent="insertBBCode('u')">Underline</button>
      <button type="button" class="quote" @click.prevent="insertBBCode('quote')">Quote</button>
      <button type="button" class="" @click.prevent="insertBBCode('code')">Code</button>
    </div>
    <form @submit.prevent="handleSubmit">
      <textarea
        ref="textarea"
        v-model="message"
        placeholder="Write something..."
        class="py-6 px-4 rounded-xl bg-white outline-none w-full h-full resize-none"
        @keyup="handleKeyup"
      />
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { WriteMessage, WritePrivateMessage } from '../../wailsjs/go/main/App'

const props = defineProps({
  to: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit'])
const message = ref('')
const textarea = ref()

function focusTo(offset = 4) {
  nextTick(() => {
    const value = message.value.length - offset
    textarea.value.focus()
    textarea.value.setSelectionRange(value, value)
  })
}

function insertBBCode(tag) {
  message.value += `[${tag}][/${tag}]`
  focusTo(tag.length + 3)
}

async function handleSubmit() {
  if (!props.to) {
    await WriteMessage(message.value)
  } else {
    await WritePrivateMessage(props.to, message.value)
  }

  message.value = ''
  emit('submit')
}

async function handleKeyup(e) {
  if (e.code == 'Enter') {
    handleSubmit()
  }
}

onMounted(() => {
  focusTo()
})
</script>
