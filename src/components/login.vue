<script setup>
import { onMounted, ref } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useStore } from "@/store/store.js";

const store = useStore();
const userPhoto = ref(null);
onMounted(() => {
  userPhoto.value = store.userPhoto;
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
      // ...
      console.log(user);
      store.UserName = user.displayName;
      store.PhotoURL = user.photoURL;
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
  <div>
    <el-button
      v-if="!store.PhotoURL"
      color="#626aef"
      style="color: white"
      @click="signInWithGoogle"
      >登入
    </el-button>

    <div v-else="userPhoto" class="avatar online">
      <div class="w-12 rounded-full">
        <img :src="userPhoto" />
      </div>
    </div>
    <el-button
      v-else="store.PhotoURL"
      color="#626aef"
      style="color: white"
      @click="store.clear"
      >登出
    </el-button>
  </div>
</template>
