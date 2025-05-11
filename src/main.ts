import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { localStoragePlugin } from "@/plugins/piniaLocalStorage";

//wire up Pinia + mount Vue app
const pinia = createPinia();
pinia.use(localStoragePlugin);

createApp(App).use(pinia).mount("#app");
