<script setup>
</script>

<template>
  <div class="bg-gray-50">
    <div
      class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <h2
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
      >
        <div class="form-control">
          <label class="label">
            <span class="label-text">棒式 / 平板支撐</span>
          </label>
          <label class="input-group input-group-lg">
            <!-- <span>Price</span> -->
            <input type="text" placeholder="100" class="input input-bordered input-group-xs" />
            <span>秒</span>
          </label>
        </div>
      </h2>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
            to="/about"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
          >Next Page</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
