<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "@/store/store.js";
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

const store = useStore();
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
onMounted(() => {
  getData();
});
const unsubscribe = store.$onAction(({ name, after, onError }) => {
  if (name === "setUserEmail") {
    const startTime = Date.now();
    // after 會在 action 調用完全返回後才執行
    // 會等待所有回傳的 promise
    after((result) => {
      getData();
      // console.log(
      //   `Finished "${name}" after ${
      //     Date.now() - startTime
      //   }ms.\nResult: ${result}.`
      // );
    });

    // onError 會在 action 報錯時調用
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      );
    });
  }
});
//抓取資料
const getData = async () => {
  const datas = await getDocs(collection(db, store.UserEmail));
  const data = datas.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  store.UserData = data;
};
//輸入
const createUser = async () => {
  await addDoc(collection(db, store.UserEmail), {
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
      class="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:pb-8"
    >
      <div class="mx-auto grid place-items-center">
        <label class="label">
          <span class="label-text text-xl font-bold">填入要新增的資訊</span>
        </label>
        <div class="grid gap-2 lg:grid-flow-col">
          <el-input
            type="text"
            placeholder="姓名"
            v-model="newName"
            class="w-fit"
          />
          <el-date-picker
            v-model="newDate"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="選擇日期"
          />
          <el-input type="text" placeholder="身高" v-model="newHeight" />
          <el-input type="text" placeholder="體重" v-model="newWeight" />
          <div class="flex justify-end">
            <el-button type="primary" @click="createUser" class="w-fit"
              >新增</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="overflow-x-auto">
      <table class="table-normal table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>日期</th>
            <th>身高</th>
            <th>體重</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="i in store.UserData" class="hover">
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
              <el-input
                style="width: 55px"
                type="text"
                v-model="i.height"
                placeholder="無"
              />
            </td>
            <td>
              <el-input
                style="width: 55px"
                type="text"
                v-model="i.weight"
                placeholder="無"
              />
            </td>
            <td>
              <el-button
                type="success"
                @click="updateUser(i.id, i.date, i.height, i.weight)"
                >修改</el-button
              >
              <el-button type="danger" @click="deleteUser(i.id)"
                >刪除</el-button
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
