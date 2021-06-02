import { createStore } from "vuex";

export default createStore({
  state: {
    employeeMenu: "All Employees",
    employeeDetail: {
      employeeID: "",
      role: "",
      department: "",
      profilePic: "",
    },
  },
  mutations: {},
  actions: {},
  modules: {},
});
