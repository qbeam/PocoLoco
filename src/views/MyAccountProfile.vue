<template>
  <div>
    <h2>Personal Information</h2>
  </div>
  <br />

  <div v-for="(account, index) in account_db" v-bind:key="index">
    <button @click="editAccountProfile(account)">Edit</button>
    <h4>Name</h4>
    <h3>{{ account.em_firstname }} {{ account.em_lastname }}</h3>

    <h4>Identification</h4>
    <h3>{{ account.identification }}</h3>

    <h4>Birth Date</h4>
    <h3>{{ account.DOB }}</h3>

    <h4>Gender</h4>
    <h3>{{ account.gender }}</h3>

    <h4>Email</h4>
    <h3>{{ account.email }}</h3>

    <h4>phone</h4>
    <h3>{{ account.phone }}</h3>
  </div>

  <!-- Edit -->
  <h2 align="center">EDIT</h2>
  <div>
    {{ form }}
  </div>

  <div>
    <h4>Name</h4>
    <input v-model="form.em_firstname" type="text" placeholder="ex. Name" />
  </div>

  <div>
    <h4>Surname</h4>
    <input v-model="form.em_lastname" type="text" placeholder="ex. Name" />
  </div>

  <div>
    <h4>Phone</h4>
    <input v-model="form.phone" type="text" />
  </div>

  <div>
    <h4>Email</h4>
    <input v-model="form.email" type="text" />
  </div>

  <br />
  <button @click="updateData">SAVE</button>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "AccountProfile",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
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
    this.getAccountProfile();
  },

  methods: {
    getAccountProfile() {
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

    editAccountProfile(account) {
      this.form.isEdit = true;

      this.form.employeeID = account.employeeID;
      this.form.em_firstname = account.em_firstname;
      this.form.em_lastname = account.em_lastname;
      this.form.phone = account.phone;
      this.form.email = account.email;
    },

    updateData() {
      this.validate();

      if (this.check && this.form.isEdit) {
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
              console.log(res.data);
              if (res.data.success == true) {
                alert(res.data.message);
                this.resetData();
                this.getAccountProfile();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },
    validate() {
      this.check =
        this.form.em_firstname != "" &&
        this.form.em_lastname != "" &&
        this.form.phone != "" &&
        this.form.email != "";
    },

    resetData() {
      this.form.employeeID = "";
      this.form.em_firstname = "";
      this.form.em_lastname = "";
      this.form.phone = "";
      this.form.email = "";
    },
  },
};
</script>
