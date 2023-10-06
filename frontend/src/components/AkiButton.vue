<template>
  <button
    class="transition-all duration-500 rounded-xl font-bold text-white"
    :class="sizeClasses"
    :style="{ background: buttonBackground }"
  >
    {{ label }}
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { generateGradientByTailwindClass, getTailwindColorHex } from '../tools/colors'
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
  variant: {
    type: String,
    default: 'yellow',
  },
  variantStyle: {
    type: String,
    default: 'gradient',
  },
  size: {
    type: String,
    default: 'md',
  },
})

const buttonBackground = computed(() => {
  switch (props.variantStyle) {
    case 'gradient':
      return generateGradientByTailwindClass(props.variant)
    case 'outline':
    case 'transparent':
      return 'transparent'
    case 'white':
      return '#ffffff'
    case 'solid':
      return getTailwindColorHex(props.variant)
    default:
      return '#ffffff'
  }
})

const sizeClasses = computed(() => {
  return {
    'text-xs': props.size === 'xs',
    'text-sm': props.size === 'sm',
    'text-base': props.size === 'md',
    'text-lg': props.size === 'lg',
    'px-2': props.size === 'xs',
    'px-4': props.size === 'sm',
    'px-6': props.size === 'md',
    'px-8': props.size === 'lg',
    'py-1': props.size === 'xs',
    'py-2': props.size === 'sm',
    'py-3': props.size === 'md',
    'py-4': props.size === 'lg',
  }
})
</script>
