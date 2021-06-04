<template>
  <div class="login">
    <h1>{{ title }}</h1>
    <div>
      <span
        style="position: absolute; z-index: 0; padding: 40px 60px; color: #0a96b7;"
      >
        <i class="fa fa-user fa-3x"></i>
      </span>

      <input
        v-model="employeeID"
        class="login-input"
        type="text"
        placeholder="Username"
      />
    </div>

    <div class="input-icons">
      <span
        style="position: absolute; z-index: 0; padding: 40px 60px; color: #0a96b7;"
      >
        <i class="fa fa-lock fa-3x"></i>
      </span>
      <input
        v-model="password"
        class="login-input"
        type="password"
        placeholder="Password"
      />
    </div>
    <DefaultButton
      :style="{
        background: 'var(--primary-blue)',
        alignSelf: 'center',
        margin: '50px',
        fontSize: '30px',
        width: '245px',
        height: '60px',
      }"
      @click="goLogin"
      >LOGIN
    </DefaultButton>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton.vue";
import axios from "axios";

export default {
  name: "Login",
  components: { DefaultButton },
  data() {
    return {
      title: "Login",
      employeeID: "",
      password: "",
    };
  },

  methods: {
    goLogin() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_login.php", {
          action: "login",
          employeeID: this.employeeID,
          password: this.password,
        })
        .then(
          function(res) {
            console.log(res);
            if (res.data.login == 1) {
              localStorage.setItem("user", res.data.employeeID);
              this.$store.state.employeeDetail.employeeID = res.data.employeeID;
              this.$store.state.employeeDetail.role = res.data.roleName;
              this.$store.state.employeeDetail.department =
                res.data.departmentName;
              this.$store.state.employeeDetail.profilePic =
                res.data.roleName + res.data.gender;
              this.$store.state.user = localStorage.getItem("user");
              this.$router.push({ name: "Home" });
              // this.$router.push({
              //   name: "Home",
              //   params: {
              //     employeeID: res.data.employeeID,
              //     roleName: res.data.roleName,
              //     departmentName: res.data.departmentName,
              //     gender: res.data.gender,
              //   },
              // });
            }
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  text-align: center;
  background: aliceblue;
}
h1 {
  font-size: 100px;
}
.login-input {
  width: 440px;
  height: 65px;
  padding: 0 100px;
  margin: 30px;
  font-size: 30px;
  outline: none;
  z-index: 1;
}
@media (max-width: 750px) {
  h1 {
    font-size: 80px;
  }
  .login-input {
    width: 250px;
    height: 50px;
    padding: 0 100px;
    margin: 30px;
    font-size: 30px;
    outline: none;
    z-index: 1;
  }
  .fa-user,
  .fa-lock {
    font-size: 40px;
  }
}
@media (max-width: 550px) {
  h1 {
    font-size: 80px;
  }
  .login-input {
    width: 150px;
    height: 45px;
    padding: 0 100px;
    margin: 30px;
    font-size: 25px;
    outline: none;
    z-index: 1;
  }
  .fa-user,
  .fa-lock {
    font-size: 30px;
  }
}
</style>
