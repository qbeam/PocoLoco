<template>
  <div class="header">
    <h4>My Role</h4>
  </div>
  <div v-for="(account, index) in account_db" v-bind:key="index">
    <h5>Role</h5>
    <p>{{ account.roleName }}</p>

    <h5>Salary</h5>
    <p>{{ account.salary }}</p>

    <div class="group">
      <div class="group-item">
        <h5>Start Date</h5>
        <p>{{ convertDate(account.startDate) }}</p>
      </div>
      <div class="group-item">
        <h5>Department</h5>
        <p>{{ account.departmentName }}</p>
      </div>
    </div>

    <div class="group">
      <div class="group-item">
        <h5>Working Time</h5>
        <p>{{ account.shift }}</p>
      </div>
      <div class="group-item">
        <h5>Bonus Rate</h5>
        <p>{{ account.bonusRate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "MyRole",

  data() {
    return {
      account_db: "",
      res: "",
      form: {
        employeeID: "",
        em_firstname: "",
        em_lastname: "",
        phone: "",
        email: "",
      },
    };
  },
  created() {
    
    this.form.employeeID = this.$store.state.employeeDetail.employeeID;
    this.getAccountRole();
  },

  methods: {
    getAccountRole() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_myAccount.php", {
          action: "getAll",
          employeeID: this.form.employeeID,
        })
        .then(
          function(res) {
            this.account_db = res.data;
          }.bind(this)
        );
    },
    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e5e5e5;
}
h5 {
  margin: 30px 0 0 0;
}
.group {
  display: flex;
}
.group-item {
  width: 40%;
}

@media (max-width: 750px) {
  .group {
    flex-direction: column;
  }
}
</style>
