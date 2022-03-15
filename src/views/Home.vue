<script setup>
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { onMounted, ref, computed } from "vue";

// 取出後物品
const state = ref(null);
//使用者填入的新增資料
const newName = ref(null);
const newDate = ref(null);
const newHeight = ref(null);
const newWeight = ref(null);

//憑證
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_apiKey,
  authDomain: import.meta.env.VITE_APP_authDomain,
  projectId: import.meta.env.VITE_APP_projectId,
  storageBucket: import.meta.env.VITE_APP_storageBucket,
  messagingSenderId: import.meta.env.VITE_APP_messagingSenderId,
  appId: import.meta.env.VITE_APP_appId,
  measurementId: import.meta.env.VITE_APP_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, "users");
onMounted(() => {
  getData();
});
//抓取資料
const getData = async () => {
  const datas = await getDocs(usersCollection);
  const data = datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  state.value = data;
};
//輸入
const createUser = async () => {
  await addDoc(usersCollection, {
    name: newName.value,
    date: newDate.value,
    height: Number(newHeight.value),
    weight: Number(newWeight.value),
  });
  newName.value = null;
  newDate.value = null;
  newHeight.value = null;
  newWeight.value = null;
  getData();
};
//修改
const updateUser = async (id, date, height, weight) => {
  const userDoc = doc(db, "users", id);
  const newFields = { date: date, height: height, weight: weight };
  await updateDoc(userDoc, newFields);
  getData();
};
//刪除
const deleteUser = async (id) => {
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);
  getData();
};
</script>

<template>
  <div class="bg-blue-50">
    <div
      class="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8"
    >
      <div class="form-control">
        <label class="label">
          <span class="label-text text-xl font-bold">填入要新增的資訊</span>
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="姓名"
            v-model="newName"
            class="input input-bordered w-20 max-w-xs text-center"
          />

          <el-date-picker
            v-model="newDate"
            type="date"
            placeholder="選擇日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            class="input input-bordered w-20 max-w-xs place-items-center text-center"
          />

          <input
            type="text"
            placeholder="身高"
            v-model="newHeight"
            class="input input-bordered w-20 max-w-xs text-center"
          />
          <input
            type="text"
            placeholder="體重"
            v-model="newWeight"
            class="input input-bordered w-20 max-w-xs text-center"
          />
        </div>
      </div>

      <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div class="inline-flex rounded-md shadow">
          <!-- <router-link
            to="/about"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-indigo-500 focus:outline-none"
          >Next Page</router-link>-->
        </div>
        <button @click="createUser" class="btn">新增</button>
      </div>
    </div>
  </div>
  <div class="mx-5">
    <div class="overflow-x-auto">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>姓名</th>
            <th>日期</th>
            <th>身高</th>
            <th>體重</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="i in state" class="hover">
            <td>{{ i.name }}</td>
            <td>
              <el-date-picker
                v-model="i.date"
                type="date"
                placeholder="選擇日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </td>
            <td>
              <input
                type="text"
                v-model="i.height"
                class="input input-bordered input-info input-sm w-14 max-w-xs"
              />
            </td>
            <td>
              <input
                type="text"
                v-model="i.weight"
                class="input input-bordered input-info input-sm w-14 max-w-xs"
              />
            </td>
            <td>
              <button
                @click="updateUser(i.id, i.date, i.height, i.weight)"
                class="btn btn-outline btn-success mr-3"
              >
                修改
              </button>
              <button
                @click="deleteUser(i.id)"
                class="btn btn-outline btn-warning"
              >
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
