<template>
  <div class="relative">
    <div
      :style="colors"
      class="w-16 h-16 cursor-pointer bg-transparent flex justify-center relative border-4 items-center rounded-xl text-2xl"
    >
      <span class="h-full w-full flex justify-center items-center overflow-hidden relative text-3xl">
        {{ symbol }}
      </span>

      <!-- Small badge for indicate yourself -->
      <span v-if="withBadge" :style="badgeStyle" :class="[badgeClasses]"> {{ badgeLabel }} </span>
    </div>

    <!-- Author name -->
    <strong
      v-if="withName"
      class="absolute text-xs mt-1 left-1/2 -translate-x-1/2 font-bold uppercase text-center text-white block"
    >
      {{ name }}
    </strong>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  symbol: {
    type: String,
    default: '',
  },
  innerStyle: {
    type: Object,
    default: () => ({}),
  },
  withBadge: {
    type: Boolean,
    default: false,
  },
  withName: {
    type: Boolean,
    default: false,
  },
  badgeVariant: {
    type: String,
    default: 'circle',
  },
  badgeLabel: {
    type: [String, Number],
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  badgeColor: {
    type: String,
    default: '',
  },
})

const colors = computed(() => {
  if (!props.color) {
    return {}
  }

  return { color: props.color, borderColor: props.color }
})

const badgeStyle = computed(() => {
  if (props.badgeVariant === 'circle') {
    return {}
  } else {
    return { color: props.badgeColor, borderColor: props.badgeColor }
  }
})

const badgeClasses = computed(() => {
  switch (props.badgeVariant) {
    case 'circle':
      return 'w-6 h-6 top-0 -mt-3 border-primary-dark rounded-xl border-4 absolute right-0 -mr-3 bg-white'
    case 'circle-big':
      return 'bg-white border-4 w-8 absolute font-bold right-0 -mr-4 -mt-4 text-sm flex justify-center items-center h-8 rounded-full -top-0.5'
    default:
      return 'bg-white border-4 absolute px-2 font-bold right-0 -mr-4 -mt-4 text-sm flex justify-center items-center h-8 rounded-full -top-0.5'
  }
})
</script>
