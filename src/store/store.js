import { defineStore } from "pinia";

export const useStore = defineStore({
  // id: 在所有 Store 中唯一
  id: "user",
  // state: 返回函數
  state: () => ({
    UserName: "登入",
    UserEmail: "jimmya011@gmail.com",
    PhotoURL: "",
    //儲存取得資料
    UserData: {},
  }),
  actions: {
    clear() {
      this.PhotoURL = "";
    },
  },
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  // 開啟資料快取
  persist: {
    enabled: true,
  },
});
