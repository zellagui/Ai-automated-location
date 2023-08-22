import { createApp } from "vue";
import App from "./App.vue";
import "@coreui/coreui/dist/css/coreui.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import router from "./router";

createApp(App).use(router).mount("#app");
