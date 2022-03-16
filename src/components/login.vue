<script setup>
import { onMounted } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useStore } from "@/store/store.js";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useStore();
onMounted(() => {

});
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
      console.log(user);
      store.UserName = user.displayName;
      store.PhotoURL = user.photoURL;
      store.UserEmail = user.email;
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
</script>
<template>
  <div class="flex justify-end">
    <el-button
      v-if="!store.PhotoURL"
      color="#626aef"
      style="color: white"
      @click="signInWithGoogle"
    >登入</el-button>
    <div class="dropdown dropdown-hover dropdown-end">
      <div v-if="store.PhotoURL" class="avatar online">
        <div class="w-12 rounded-full">
          <img :src="store.PhotoURL" />
        </div>
      </div>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
        <li>
          <a>{{ store.UserName }}</a>
        </li>
        <li>
          <el-button
            v-if="store.PhotoURL"
            color="#626aef"
            style="color: white"
            @click="store.clear"
          >登出</el-button>
        </li>
      </ul>
    </div>

    <el-dropdown>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>{{ store.UserName }}</el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
