<script setup>
import login from "@/components/login.vue";
</script>

<template>
  <div>
    <header class="w-full bg-blue-50 px-2 py-2">
      <login />
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
