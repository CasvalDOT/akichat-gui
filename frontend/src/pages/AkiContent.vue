<template>
  <main class="h-screen flex bg-primary-dark justify-between">
    <!-- Public chat -->
    <div v-if="isFirstDataLoaded" class="w-8/12 relative">
      <aki-chat :messages="publicMessages" @click-user="handleClickUser" @submit="fetchData" />
    </div>

    <!-- Sidebar -->
    <div v-if="isFirstDataLoaded" class="w-4/12 sticky top-0 h-screen">
      <aki-sidebar
        :users="usersWithEditedData"
        :me="me"
        @toggle-user-status="handleToggleUserStatus"
        @private-chat="onPrivateChatStart"
        @change-nick="nickModalOpen = true"
        @change-color="userCandidateForColorSwitch = $event"
      />
    </div>

    <!-- Change nickname modal -->
    <aki-change-nick-modal
      :is-open="!!nickModalOpen"
      :me="me"
      @close="nickModalOpen = false"
      @success="nickModalOpen = false"
    />

    <!-- Change color modal -->
    <aki-change-color-modal
      :is-open="!!userCandidateForColorSwitch"
      class="justify-center items-center"
      :me="me"
      @close="userCandidateForColorSwitch = null"
      @select-color="handleColorSelection"
    />

    <!-- Private chat modal -->
    <aki-modal :is-open="!!userCandidateForMessaging" @close="userCandidateForMessaging = null">
      <aki-chat :messages="privateMessages" :to="userCandidateForMessaging.name" @submit="fetchData" />
    </aki-modal>
  </main>
</template>

<script setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import AkiSidebar from '../components/AkiSidebar.vue'
import AkiChat from '../components/AkiChat.vue'
import AkiModal from '../components/AkiModal.vue'
import AkiChangeNickModal from '../components/AkiChangeNickModal.vue'
import AkiChangeColorModal from '../components/AkiChangeColorModal.vue'
import { Notify, Read, GetKanjiList } from '../../wailsjs/go/main/App'
import { getRandomColor } from '../tools/colors'
import { cleanTextForNotification } from '../tools/message'

const isFirstDataLoaded = ref(false)
const currentMessageIndex = ref('0')
const messages = ref([])
const users = ref([])
const userCandidateForMessaging = ref(null)
const nickModalOpen = ref(false)
const usersIgnored = ref([])
const userCandidateForColorSwitch = ref(null)
const listOfKanji = ref([])
const mainInterval = ref(null)

// Handler for the action of clicking the avatar
// in the main chat content. The action trigger the
// overlay private messages
function handleClickUser(user) {
  if (user.id === me.value.id) {
    return
  }

  userCandidateForMessaging.value = users.value.find((u) => u.id === user.id)
}

// Handler when the private chat is started
async function onPrivateChatStart(user) {
  userCandidateForMessaging.value = user

  // Set messages as readed
  users.value = users.value.map((u) => {
    if (u.id === user.id) {
      u.unread_messages = 0
    }
    return u
  })
}

// Handler for the color change
function handleColorSelection(color) {
  userCandidateForColorSwitch.value.color = color
  for (const user of users.value) {
    if (user.id === userCandidateForColorSwitch.value.id) {
      user.color = color
    }
  }

  // For each message change the color
  for (const message of messages.value) {
    if (message.author.id === userCandidateForColorSwitch.value.id) {
      message.color = color
    }
  }

  // Cancel the user selected
  userCandidateForColorSwitch.value = null
}

// Block / Unblock user
function handleToggleUserStatus(user) {
  const index = usersIgnored.value.indexOf(user.id)
  if (index >= 0) {
    usersIgnored.value.splice(index, 1)
  } else {
    usersIgnored.value.push(user.id)
  }

  window.localStorage.setItem('users-ignored', JSON.stringify(usersIgnored.value))
}

// Send notification when a new message is received
function notifyNewMessage(message) {
  if (document.hasFocus() || message.author.is_ignored || message.type !== 'usr' || !isFirstDataLoaded.value) {
    return
  }

  Notify('AkiChat', `${message.author.name}:\n${cleanTextForNotification(message.content)}`, 'success')
}

function getRandomSymbol() {
  const value = Math.floor(Math.random() * (listOfKanji.value.length - 0 + 1) + 0)
  return listOfKanji.value[value]
}

function upsertUsers(newUsers) {
  for (const user of newUsers) {
    const match = users.value.find((f) => f.id === user.id)
    if (!match) {
      users.value.push({
        ...user,
        color: getRandomColor(),
        symbol: getRandomSymbol(),
        unread_messages: 0,
        is_ignored: false,
      })
    } else {
      const index = users.value.indexOf(match)
      users.value[index] = {
        ...users.value[index],
        ...match,
        ...user,
        is_ignored: usersIgnored.value.includes(user.id),
      }
    }
  }

  users.value = users.value.filter((u) => newUsers.find((nu) => nu.id === u.id))
}

// Fetch data from API
async function fetchData() {
  try {
    // Take data. Specifically the users and the messages
    const { data: dataResponse } = await Read(currentMessageIndex.value)

    // Update users
    upsertUsers(dataResponse.users)

    // Add new messages and increment the index count
    // returned by API
    if (dataResponse.messages.length > 0) {
      messages.value = [...messages.value, ...dataResponse.messages]
      currentMessageIndex.value = dataResponse.messages[dataResponse.messages.length - 1].id
    }

    const latestMessage = dataResponse.messages[dataResponse.messages.length - 1]
    for (const user of users.value) {
      if (
        !userCandidateForMessaging.value &&
        !user.is_ignored &&
        latestMessage &&
        latestMessage.author.id === user.id &&
        latestMessage.channel !== 'public'
      ) {
        user.unread_messages++
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const usersWithEditedData = computed(() => {
  return users.value.filter((u) => u !== undefined).filter((u) => u.id !== me.value.id)
})

const me = computed(() => {
  const userID = window.localStorage.getItem('userID')
  return users.value.find((u) => u.id === userID)
})

const messagesWithAggregatedData = computed(() => {
  return messages.value
    .map((m) => {
      const user = users.value.find((u) => u.id === m.author.id) || ''

      const isUserIgnored = usersIgnored.value.indexOf(user.id) >= 0

      return {
        ...m,
        author: { ...m.author, symbol: '-', ...user },
        color: user.color,
        is_readed: false,
        is_ignored: isUserIgnored,
        me: me.value.id === m.author.id,
      }
    })
    .filter((m) => m !== undefined)
    .reduce((items, item) => (items.find((i) => i.id === item.id) ? items : [...items, item]), [])
})

const publicMessages = computed(() => {
  return messagesWithAggregatedData.value.filter((m) => m.channel === 'public' && !m.is_ignored)
})

const privateMessages = computed(() => {
  const channelID = `1${me.value.id}`

  return messagesWithAggregatedData.value.filter((m) => {
    const isFromPrivate = m.channel === channelID && m.author.id === userCandidateForMessaging.value.id
    const isToPrivate =
      m.channel === channelID && m.author.id === me.value.id && m.target === userCandidateForMessaging.value.id

    return !m.is_ignored && (isFromPrivate || isToPrivate)
  })
})

// Watch for new messages
watch(
  () => messagesWithAggregatedData.value,
  (oldValue, newValue) => {
    if (oldValue.length === newValue.length) {
      return false
    }
    const lastMessage = messagesWithAggregatedData.value[messagesWithAggregatedData.value.length - 1]
    notifyNewMessage(lastMessage)
  },
  { deep: true },
)

onUnmounted(() => {
  if (mainInterval.value) {
    clearInterval(mainInterval.value)
  }
})

onMounted(async () => {
  mainInterval.value = setInterval(fetchData, 2000)
  listOfKanji.value = await GetKanjiList()

  fetchData().then(() => {
    isFirstDataLoaded.value = true
  })

  try {
    const storeData = window.localStorage.getItem('users-ignored')
    const transform = JSON.parse(storeData)
    if (transform) {
      usersIgnored.value = transform
    }
  } catch (error) {
    usersIgnored.value = []
  }
})
</script>
