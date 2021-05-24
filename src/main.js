import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VCalendar from "v-calendar";
import store from "./store";
import VueApexCharts from "vue3-apexcharts";

createApp(App)
  .use(store)
  .use(router)
  .use(VCalendar, {})
  .use(VueApexCharts)
  .mount("#app");
