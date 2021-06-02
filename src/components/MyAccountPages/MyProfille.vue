<template>
  <div class="header">
    <h4>Personal Information</h4>
    <i class="fa fa-pencil" @click="showPopup" />
  </div>

  <h5>Name</h5>
  <p>{{ name }}</p>

  <h5>Identification</h5>
  <p>{{ identification }}</p>

  <div class="group">
    <div class="group-item">
      <h5>Birth Date</h5>
      <p>{{ birth }}</p>
    </div>
    <div class="group-item">
      <h5>Gender</h5>
      <p>{{ gender }}</p>
    </div>
  </div>

  <div class="group">
    <div class="group-item">
      <h5>Email</h5>
      <p>{{ email }}</p>
    </div>
    <div class="group-item">
      <h5>Phone</h5>
      <p>{{ phone }}</p>
    </div>
  </div>

  <Popup
    v-bind:visible="popupVisible"
    @popReturn="editVisible"
    :buttons="true"
    :style="{ top: '0', right: '0' }"
  >
    <div class="group">
      <div class="group-item" :style="{ width: '50%' }">
        <p>Name</p>
        <input />
      </div>
      <div class="group-item">
        <p>Surname</p>
        <input />
      </div>
    </div>
    <p>Phone</p>
    <input />
    <p>Email</p>
    <input :style="{ width: '80%' }" />
  </Popup>
</template>

<script>
import Popup from "../Popup";
export default {
  name: "MyProfile",
  components: { Popup },
  data() {
    return {
      name: "Monkey Harry",
      identification: "1231230123213",
      birth: "2000/10/01",
      gender: "Male",
      email: "monkey.h@pocoloco.com",
      phone: "0818888888",
      popupVisible: false,
    };
  },
  methods: {
    showPopup() {
      this.popupVisible = true;
    },
    editVisible(value) {
      this.popupVisible = value;
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
