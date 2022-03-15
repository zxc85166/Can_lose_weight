<script setup>
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "@firebase/firestore";
import { onMounted, ref } from "vue";

// 取出後物品
const state = ref(null);
//使用者填入的新增資料
const newName = ref(null);
const newDate = ref(null);
const newHeight = ref(null);
const newWeight = ref(null);

//google登入
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
      console.log(user, token);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(errorCode, errorMessage, email, credential);
    });
};

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
      <div class="mx-auto">
        <label class="label">
          <span class="label-text text-xl font-bold">填入要新增的資訊</span>
        </label>
        <div class="grid grid-flow-col gap-2">
          <el-input type="text" placeholder="姓名" v-model="newName" />
          <el-date-picker
            v-model="newDate"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="選擇日期"
          />
          <el-input type="text" placeholder="身高" v-model="newHeight" />
          <el-input type="text" placeholder="體重" v-model="newWeight" />
          <el-button type="primary" @click="createUser">新增</el-button>
          <el-button
            color="#626aef"
            style="color: white"
            @click="signInWithGoogle"
            >登入</el-button
          >
        </div>
      </div>
    </div>
  </div>
  <div>
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
              <el-input
                type="text"
                v-model="i.height"
                placeholder="空白"
                class="w-20 max-w-xs"
              />
            </td>
            <td>
              <el-input
                type="text"
                v-model="i.weight"
                placeholder="空白"
                class="w-20 max-w-xs"
              />
            </td>
            <td>
              <el-button
                type="success"
                @click="updateUser(i.id, i.date, i.height, i.weight)"
              >
                修改
              </el-button>
              <el-button type="danger" @click="deleteUser(i.id)">
                刪除
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
