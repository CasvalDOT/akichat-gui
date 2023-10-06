<template>
  <div :style="{ background: user.colorHex }" class="py-4">
    <div class="px-3 inline-flex gap-x-3">
      <!-- Avatar -->
      <aki-avatar
        :symbol="user.symbol"
        :name="user.name"
        :with-name="false"
        color="#ffffff"
        :with-badge="showBadge"
        :badge-color="user.colorHex"
        :badge-label="badgeLabel"
        badge-variant="long"
      />

      <div class="flex flex-col items-stretch h-16 justify-between">
        <!-- User name -->
        <strong class="text-sm font-bold">{{ user.name }}</strong>

        <!-- List of actions -->
        <nav class="flex items-center gap-x-2">
          <slot name="nav"></slot>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AkiAvatar from './AkiAvatar.vue'

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
})

const showBadge = computed(() => {
  if (props.user.me) {
    return true
  }

  return props.user.unread_messages > 0
})

const badgeLabel = computed(() => {
  if (props.user.me) {
    return 'You'
  }

  return props.user.unread_messages
})
</script>
