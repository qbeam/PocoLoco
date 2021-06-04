<template>
  <div class="header">
    <h4>Personal Information</h4>
    <i class="fa fa-pencil" @click="showPopup" />
  </div>
  <div v-for="(account, index) in account_db" v-bind:key="index">
    <h5>Name</h5>
    <p>{{ account.em_firstname }} {{ account.em_lastname }}</p>

    <h5>Identification</h5>
    <p>{{ account.identification }}</p>

    <div class="group">
      <div class="group-item">
        <h5>Birth Date</h5>
        <p>{{ convertDate(account.DOB) }}</p>
      </div>
      <div class="group-item">
        <h5>Gender</h5>
        <p>{{ account.gender }}</p>
      </div>
    </div>

    <div class="group">
      <div class="group-item">
        <h5>Email</h5>
        <p>{{ account.email }}</p>
      </div>
      <div class="group-item">
        <h5>Phone</h5>
        <p>{{ account.phone }}</p>
      </div>
    </div>
  </div>

  <Popup
    v-bind:visible="popupVisible"
    @popReturn="editVisible"
    @submit="submit"
    :buttons="true"
    :style="{ top: '0', right: '0' }"
  >
    <div class="group">
      <div class="group-item" :style="{ width: '50%' }">
        <p>Name</p>
        <input v-model="form.em_firstname" type="text" placeholder="ex. Name" />
      </div>
      <div class="group-item">
        <p>Surname</p>
        <input v-model="form.em_lastname" type="text" placeholder="ex. Name" />
      </div>
    </div>
    <p>Phone</p>
    <input v-model="form.phone" type="text" />
    <p>Email</p>
    <input v-model="form.email" type="text" />
  </Popup>
</template>

<script>
import Popup from "../Popup";
import axios from "axios";
export default {
  name: "MyProfile",
  components: { Popup },
  data() {
    return {
      popupVisible: false,
      account_db: "",
      check: false,
      res: "",
      form: {
        employeeID: "",
        em_firstname: "",
        em_lastname: "",
        phone: "",
        email: "",
        isEdit: false,
      },
    };
  },
  created() {
    this.form.employeeID = localStorage.getItem("user");
    this.getAccountProfile();
  },

  methods: {
    showPopup() {
      this.popupVisible = true;
    },
    editVisible(value) {
      this.popupVisible = value;
    },
    submit(value) {
      this.popupVisible = value;
      this.updateData();
    },
    getAccountProfile() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_myAccount.php", {
          action: "getAll",
          employeeID: this.form.employeeID,
        })
        .then(
          function(res) {
            this.account_db = res.data;
            this.form.em_firstname = res.data[0].em_firstname;
            this.form.em_lastname = res.data[0].em_lastname;
            this.form.phone = res.data[0].phone;
            this.form.email = res.data[0].email;
          }.bind(this)
        );
    },
    updateData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_myAccount.php", {
          action: "updateData",
          employeeID: this.form.employeeID,
          em_firstname: this.form.em_firstname,
          em_lastname: this.form.em_lastname,
          phone: this.form.phone,
          email: this.form.email,
        })
        .then(
          function(res) {
            alert(res.data.message);
            this.getAccountProfile();
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
.fa-pencil {
  font-size: 20px;
  margin-left: 30px;
}
.fa-pencil:hover {
  color: var(--primary-blue);
  cursor: pointer;
  font-size: 22px;
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
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  font-size: 14px;
  margin-bottom: 25px;
}
@media (max-width: 1000px) {
  input {
    width: 150px;
  }
}
@media (max-width: 750px) {
  .group {
    flex-direction: column;
  }
  input {
    width: 200px;
  }
}
</style>
