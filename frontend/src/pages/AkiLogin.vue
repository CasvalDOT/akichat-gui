<template>
  <main class="bg-primary-dark h-screen gap-y-6 w-screen flex flex-col justify-center items-center">
    <h1 class="jp text-white text-3xl">ご()機(き)嫌(げん)よう</h1>
    <form class="flex flex-col gap-y-6 w-1/2 justify-center items-center" @submit.prevent="login">
      <input
        v-model="userName"
        required
        placeholder="Username"
        name="userName"
        type="text"
        class="outline-none rounded-xl px-4 py-2 w-full"
      />
      <input
        v-model="password"
        :style="{}"
        placeholder="Password"
        name="password"
        type="password"
        class="rounded-xl outline-none px-4 py-2 w-full"
      />

      <aki-button type="submit" class="jp lowecase" label="ειςειμι" variant="red" />
    </form>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onUnmounted } from 'vue'
import AkiButton from '../components/AkiButton.vue'
import { Login } from '../../wailsjs/go/main/App'

const router = useRouter()

const userName = ref('')
const password = ref('')
const timeout = ref(null)

async function login() {
  try {
    const userID = await Login(userName.value, password.value)
    window.localStorage.setItem('userID', userID)
    timeout.value = setTimeout(() => {
      router.push('/')
    }, 100)
  } catch (error) {
    console.error(error)
  }
}

onUnmounted(() => {
  window.clearTimeout(timeout.value)
})
</script>
