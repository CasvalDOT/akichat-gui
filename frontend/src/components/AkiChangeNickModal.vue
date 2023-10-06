<template>
  <aki-modal :is-open="isOpen" class="justify-center items-center" @close="$emit('close')">
    <form class="flex flex-col w-1/2 items-center gap-y-6" @submit="changeNickname">
      <input
        v-model="newNickname"
        minlength="2"
        required
        type="text"
        class="w-full text-xl text-center py-4 px-6 rounded-xl"
        placeholder="Choose your new nickname"
      />

      <aki-button label="CONFERMA" type="submit" :variant="me.color" />
    </form>
  </aki-modal>
</template>

<script setup>
import { ref } from 'vue'
import { ChangeNickname } from '../../wailsjs/go/main/App'
import AkiModal from './AkiModal.vue'
import AkiButton from './AkiButton.vue'

const emits = defineEmits(['success', 'close'])
defineProps({
  me: {
    type: Object,
    default: () => ({}),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const newNickname = ref('')

function changeNickname(e) {
  e.preventDefault()
  ChangeNickname(newNickname.value)
  emits('success')
}
</script>
