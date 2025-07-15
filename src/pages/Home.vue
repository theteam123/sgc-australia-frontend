<template>
  <div class="monday-main-content">
    <div class="monday-card">
      <div class="flex flex-col items-center space-y-6">
        <img 
          :src="logo" 
          alt="App Logo" 
          class="h-12" 
        />
        <div class="text-center">
          <h2 class="text-h1">Welcome to the Home Page</h2>
        </div>
        <div class="max-w-xl w-full">
          <div class="monday-search">
            <DocTypeSearch @resultClick="handleResultClick" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getLogo } from '../config/domains';
import DocTypeSearch from '../components/DocTypeSearch.vue';

const logo = computed(() => getLogo());

const handleResultClick = (result) => {
  console.log('Selected doctype:', result);
};
</script>