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
const newNote = ref(null);
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
  if (data == "") {
    initializeUser();
    console.log(data);
  }
};

//輸入
const createUser = async () => {
  await addDoc(collection(db, store.UserEmail), {
    note: newNote.value,
    date: newDate.value,
    height: Number(newHeight.value),
    weight: Number(newWeight.value),
  });
  newNote.value = null;
  newDate.value = null;
  newHeight.value = null;
  newWeight.value = null;
  getData();
};
//修改
const updateUser = async (id, date, height, weight, note) => {
  const userDoc = doc(db, store.UserEmail, id);
  const newFields = { date: date, height: height, weight: weight, note: note };
  await updateDoc(userDoc, newFields);
  getData();
};
//進出編輯狀態
const editStatus = ref(false);
const editOrNot = () => {
  editStatus.value = !editStatus.value;
}
//刪除
const deleteUser = async (id) => {
  const userDoc = doc(db, store.UserEmail, id);
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
          <span class="label-text text-xl font-bold pr-5">運動紀錄表</span>
          <!-- 說明用modal -->
          <label for="my-modal-6" class="btn btn-sm modal-button">使用說明</label>

          <!-- Put this part before </body> tag -->
          <input type="checkbox" id="my-modal-6" class="modal-toggle" />
          <div class="modal modal-bottom sm:modal-middle">
            <div class="modal-box relative">
              <h3 class="font-bold text-lg">每日紀錄運動成果，檢視進步及健康狀況</h3>
              <li class="pt-4">最上方藍色方格新增資料</li>
              <li>資料平時只可查看按下修改按鈕後可以編輯，完成編輯後按下送出便會發送至資料庫儲存</li>
              <div class="modal-action">
                <label for="my-modal-6" class="btn">關閉</label>
              </div>
            </div>
          </div>
        </label>
        <div class="grid gap-2 lg:grid-flow-col">
          <el-date-picker
            v-model="newDate"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="選擇日期"
          />
          <el-input type="text" placeholder="小筆記" v-model="newNote" class="w-fit" />
          <el-input type="text" placeholder="身高" v-model="newHeight" />
          <el-input type="text" placeholder="體重" v-model="newWeight" />
          <div class="flex justify-end">
            <el-button type="primary" @click="createUser" class="w-fit">新增</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="overflow-x-auto">
      <table class="table table-normal w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>日期(舊到新排序)</th>
            <th>小筆記</th>
            <th>身高</th>
            <th>體重</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->

          <tr v-for="item in store.sortUserData" :key="item.date" class="hover">
            <td>
              <p v-if="!editStatus">{{ item.date }}</p>
              <el-date-picker
                v-if="editStatus"
                v-model="item.date"
                type="date"
                placeholder="選擇日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </td>
            <td>
              <p v-if="!editStatus">{{ item.note }}</p>
              <el-input
                v-if="editStatus"
                class="max-w-fit"
                type="text"
                v-model="item.note"
                placeholder="無"
              />
            </td>
            <td>
              <p v-if="!editStatus">{{ item.height }}</p>
              <el-input
                v-if="editStatus"
                style="width: 55px"
                type="text"
                v-model="item.height"
                placeholder="無"
              />
            </td>
            <td>
              <p v-if="!editStatus">{{ item.weight }}</p>
              <el-input
                v-if="editStatus"
                style="width: 55px"
                type="text"
                v-model="item.weight"
                placeholder="無"
              />
            </td>
            <td>
              <el-button v-if="!editStatus" type="success" @click="editOrNot()">修改</el-button>
              <el-button
                v-if="editStatus"
                type="success"
                @click="updateUser(item.id, item.date, item.height, item.weight, item.note); editOrNot()"
              >送出</el-button>
              <el-button type="danger" @click="deleteUser(item.id)">刪除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="store.UserData.length == 0"
        class="text-center pt-9 italic text-gray-400 font-bold"
      >※無資料※</div>
    </div>
  </div>
</template>
<style>
/* table */
.table th:first-child {
  position: relative;
}
</style>