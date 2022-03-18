import { defineStore } from "pinia";

export const useStore = defineStore({
  // id: 在所有 Store 中唯一
  id: "user",
  // state: 返回函數
  state: () => ({
    UserName: "登入",
    UserEmail: "",
    PhotoURL: "",
    //儲存取得資料
    UserData: "",
  }),
  getters: {
    //排序UserData 過去到未來
    sortUserData: (state) => {
      if (state.UserData) {
        return state.UserData.sort((a, b) => {
          return a.date > b.date ? 1 : -1;
        });
      }
    },
  },
  actions: {
    clear() {
      //清空
      this.UserName = "登入";
      this.UserEmail = "";
      this.PhotoURL = "";
      this.UserData = "";
    },
    //設定UserEmail
    setUserEmail(email) {
      this.UserEmail = email;
    },
  },
  // 開啟資料快取
  persist: {
    enabled: true,
  },
});
