<template>
  <div class="flex w-full">
    <!-- Message of type user -->
    <div v-if="isUserType" class="flex justify-start items-center gap-x-10">
      <!-- Avatar -->
      <aki-avatar
        :symbol="author.symbol"
        :name="author.name"
        :color="userColor"
        :with-name="true"
        :with-badge="me"
        @click="$emit('click-user', author)"
      />

      <!-- Content container -->
      <div
        :style="messageContentStyle"
        :class="[isFilled ? 'text-white' : 'text-black', isRender ? 'scale-1' : 'scale-0']"
        class="transition duration-50 tracking-wide relative w-full border-4 p-4 rounded-xl"
      >
        <!-- Triangle -->
        <span
          :style="messageArrowStyle.outer"
          class="triangle-over border-transparent absolute left-0 block -mt-3 top-1/2 -ml-6"
        >
          <span
            :style="messageArrowStyle.inner"
            style="top: -5px"
            class="triangle border-r-white border-transparent block right-100 ml-2 absolute"
          >
          </span>
        </span>

        <!-- Contents -->
        <div class="flex flex-col gap-y-6">
          <div v-dompurify-html="content.text" class="text-lg"></div>
          <aki-media-gallery :media="content.media" />
        </div>
      </div>
    </div>

    <!-- Message of type system -->
    <div v-else class="flex flex-col items-center text-gray-500 w-full text-center py-2 text-base">
      <span class="text-xs">
        {{ time }}
      </span>
      {{ content.text }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getMediaContent } from '../tools/message'
import AkiMediaGallery from './AkiMediaGallery.vue'
import AkiAvatar from './AkiAvatar.vue'
import { getTailwindColorHex, generateGradientByTailwindClass } from '../tools/colors'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  author: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
    }),
  },
  type: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'fill',
  },
  me: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click-user'])

const isRender = ref(false)

const isUserType = computed(() => props.type === 'usr')

const userColor = computed(() => getTailwindColorHex(props.color))

const isFilled = computed(() => props.variant === 'fill')

const content = computed(() => {
  return getMediaContent(props.content)
})

const messageArrowStyle = computed(() => {
  return {
    outer: { borderRightColor: isFilled.value ? '#ffffff' : userColor.value },
    inner: { borderRightColor: isFilled.value ? userColor.value : '#ffffff' },
  }
})

const messageContentStyle = computed(() => {
  const style = {}

  if (!isFilled.value) {
    style.borderColor = userColor.value
    style.backgroundColor = '#ffffff'
  } else {
    style.borderColor = '#ffffff'
    style.background = generateGradientByTailwindClass(props.color)
  }

  return style
})

const animationTimeout = ref(null)

onMounted(() => {
  animationTimeout.value = setTimeout(() => {
    isRender.value = true
  }, 500)
})

onUnmounted(() => {
  clearTimeout(animationTimeout.value)
})
</script>
