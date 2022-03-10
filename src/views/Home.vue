<script setup>
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "@firebase/firestore";
import { onMounted, ref } from "vue";

const state = ref(null);
const firebaseConfig = {
  apiKey: "AIzaSyDkm-edZzl3gWJPiCOLFCrdgZY_61oFCmI",
  authDomain: "can-lose-weight-11cc7.firebaseapp.com",
  projectId: "can-lose-weight-11cc7",
  storageBucket: "can-lose-weight-11cc7.appspot.com",
  messagingSenderId: "106861088590",
  appId: "1:106861088590:web:4e6f32fdbe7fbf702b181f",
  measurementId: "G-JH8RZ4FV9Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usersCollection = collection(db, "users");
onMounted(async () => {
  const data = await getDocs(usersCollection);
  const me = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  state.value = me;
});
// 取出後物品
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
            <input
              type="text"
              placeholder="100"
              class="input input-bordered input-group-xs"
            />
            <span>秒</span>
          </label>
        </div>
      </h2>
      <div>{{ me }}</div>
      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <router-link
            to="/about"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
            >Next Page</router-link
          >
        </div>
        <button class="btn">按我新增</button>
      </div>
    </div>
    <div v-for="i in state">
      <h1>{{ i.age }}</h1>
      <h1>{{ i.id }}</h1>
      <h1>{{ i.name }}</h1>
    </div>
  </div>
</template>
