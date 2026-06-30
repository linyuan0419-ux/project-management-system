<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'

const route = useRoute()
</script>

<template>
  <MainLayout v-if="!route.meta.public">
    <RouterView />
  </MainLayout>
  <RouterView v-else />
</template>
