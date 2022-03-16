import { createApp } from "vue";
import "./tailwind.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { routes } from "./routes.js";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(router);
app.use(ElementPlus);
app.use(pinia);
app.mount("#app");
