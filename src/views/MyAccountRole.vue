<template>
  <h2>My Role</h2>
  <br />

  <div v-for="(account, index) in account_db" v-bind:key="index">
    <h4>Role</h4>
    <h3>{{ account.roleName }}</h3>

    <h4>Salary</h4>
    <h3>{{ account.salary }}</h3>

    <h4>Start Date</h4>
    <h3>{{ account.startDate }}</h3>

    <h4>Department</h4>
    <h3>{{ account.departmentName }}</h3>

    <h4>Working Time</h4>
    <h3>{{ account.shift }}</h3>

    <h4>Bonus Rate</h4>
    <h3>{{ account.bonusRate }}</h3>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "AccountRole",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      account_db: "",
      res: "",
    };
  },
  created() {
    this.getAccountRole();
  },

  methods: {
    getAccountRole() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_myAccount.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.account_db = res.data;
            console.log(res);
          }.bind(this)
        );
    },
  },
};
</script>
