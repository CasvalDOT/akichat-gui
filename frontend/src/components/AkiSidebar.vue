<template>
  <aside
    class="w-full p-6 pt-2 pl-0 overflow-y-scroll flex flex-col justify-between h-screen bg-transparent text-white"
  >
    <!-- Logout button -->
    <div class="w-full py-2">
      <aki-button variant-style="transparent" class="w-full" @click.prevent="logout">Logout</aki-button>
    </div>

    <!-- Content -->
    <div class="h-full relative rounded-2xl">
      <!-- 3d effect -->
      <span class="absolute inset-0 z-10 rounded-2xl pointer-events-none" />

      <div class="h-full bg-primary-light rounded-2xl overflow-hidden">
        <aki-sidebar-user :user="meWithColorHex" class="z-0 shadow-md sticky top-0">
          <template #nav>
            <aki-button size="xs" variant-style="white" @click="$emit('change-color', me)">
              <aki-icon-change-color />
            </aki-button>
            <aki-button size="xs" variant-style="white" @click="$emit('change-nick', me)">
              <aki-icon-nickname />
            </aki-button>
          </template>
        </aki-sidebar-user>

        <aki-sidebar-user
          v-for="user in usersWithColorHex"
          :key="user.id"
          :style="{ background: user.colorHex }"
          :user="user"
          class="py-4 shadow-md"
        >
          <template #nav>
            <aki-button size="xs" variant-style="white" @click="$emit('change-color', user)">
              <aki-icon-change-color />
            </aki-button>
            <aki-button size="xs" variant-style="white" @click="$emit('private-chat', user)">
              <aki-icon-private-message />
            </aki-button>
            <aki-button size="xs" variant-style="white" @click="$emit('toggle-user-status', user)">
              <aki-icon-lock v-if="!user.is_ignored" />
              <aki-icon-unlock v-else />
            </aki-button>
          </template>
        </aki-sidebar-user>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { generateGradientByTailwindClass, getTailwindColorHex } from '../tools/colors'
import { Logout } from '../../wailsjs/go/main/App'
import AkiButton from './AkiButton.vue'
import AkiSidebarUser from './AkiSidebarUser.vue'
import AkiIconNickname from './AkiSvgIcons/AkiIconNickname.vue'
import AkiIconPrivateMessage from './AkiSvgIcons/AkiIconPrivateMessage.vue'
import AkiIconChangeColor from './AkiSvgIcons/AkiIconChangeColor.vue'
import AkiIconLock from './AkiSvgIcons/AkiIconLock.vue'
import AkiIconUnlock from './AkiSvgIcons/AkiIconUnlock.vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  me: {
    type: Object,
    default: () => ({}),
  },
})

const router = useRouter()

defineEmits(['private-chat', 'change-nick', 'toggle-user-status', 'change-color'])

async function logout() {
  const confirmed = window.confirm('Are you sure you want to logout?')
  if (confirmed) {
    await Logout()
    router.push('/login')
  }
}

const meWithColorHex = computed(() => ({
  ...props.me,
  colorHex: getTailwindColorHex(props.me.color),
  me: true,
}))

const usersWithColorHex = computed(() => {
  return props.users.map((u) => ({
    ...u,
    colorHex: getTailwindColorHex(u.color),
    gradient: generateGradientByTailwindClass(u.color),
  }))
})
</script>

<style scoped>
aside > div > span {
  box-shadow: 0 25px 50px -12px rgb(255 255 255 / 0.33) inset;
  @apply shadow-white;
}
</style>
