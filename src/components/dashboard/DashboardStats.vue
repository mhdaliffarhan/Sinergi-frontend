<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden">
    <div class="absolute top-0 right-0 w-16 h-16 rounded-full blur-xl -mr-4 -mt-4 transition-all opacity-50 group-hover:opacity-100" :class="bgGlowClass"></div>
    
    <div class="relative z-10 flex items-center justify-between">
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-black text-gray-900 dark:text-white">{{ value }}</h3>
      </div>
      
      <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ring-1 ring-inset transition-colors" :class="iconClass">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: [Number, String],
  icon: String,
  color: { type: String, default: 'blue' } // blue, green, orange, purple
});

const bgGlowClass = computed(() => {
  const map = {
    blue: 'bg-blue-200 dark:bg-blue-500',
    green: 'bg-green-200 dark:bg-green-500',
    orange: 'bg-orange-200 dark:bg-orange-500',
    purple: 'bg-purple-200 dark:bg-purple-500',
  };
  return map[props.color] || map.blue;
});

const iconClass = computed(() => {
  const map = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-blue-100 dark:ring-blue-500/30',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-green-100 dark:ring-green-500/30',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 ring-orange-100 dark:ring-orange-500/30',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 ring-purple-100 dark:ring-purple-500/30',
  };
  return map[props.color] || map.blue;
});
</script>