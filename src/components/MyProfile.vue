<template>
  <div class="head">
    <b style="font-size: 20px">Personal Information</b>
    <i class="fa fa-pencil fa-2x" @click="getProfileEdit()"></i>
    <hr />
  </div>
  <div class="information">
    <b>Name</b>
    <p>{{ sampleProfile.firstname }} {{ sampleProfile.lastname }}</p>
    <b> Identification </b>
    <p>{{ sampleProfile.identification }}</p>
    <div class="group-row">
      <div class="group-item">
        <b>Birth date</b>
        <p>{{ sampleProfile.DOB }}</p>
        <b>Email</b>
        <p>{{ sampleProfile.email }}</p>
      </div>
      <div class="group-item">
        <b>Gender</b>
        <p>{{ sampleProfile.gender }}</p>
        <b>Phone</b>
        <p>{{ sampleProfile.phone }}</p>
      </div>
    </div>
  </div>

  <Popup
    :visible="editVisible"
    :buttons="true"
    @popReturn="popReturn"
    @submit="submit"
    :style="{ top: '0', left: '0', margin: '0' }"
  >
    <div class="group-row">
      <div class="group-item">
        <p>Name</p>
        <input
          type="text"
          v-model="sampleProfile.firstname"
          placeholder="name"
        />
        <p>Phone</p>
        <input
          type="text"
          v-model="sampleProfile.phone"
          placeholder="phone"
        />
        <p>Email</p>
        <input type="text" v-model="sampleProfile.email" placeholder="email" />
      </div>
      <div class="group-item">
        <p>Lastname</p>
        <input
          type="text"
          v-model="sampleProfile.lastname"
          placeholder="lastname"
        />
      </div>
    </div>
  </Popup>
</template>

<script>
import Popup from "../components/Popup";

export default {
  name: "MyProfile",
  components: {
    Popup,
  },
  data() {
    return {
      sampleProfile: {
        firstname: "Natsarun",
        lastname: "Rooncharoen",
        identification: 1102983847564,
        DOB: "29/06/2000",
        gender: "Male",
        email: "qbeamm@pocoloco.com",
        phone: "0968988864",
      },
      editVisible: false,
    };
  },
  methods: {
    popReturn(value) {
      this.editVisible = value;
    },
    submit(value) {
      this.editVisible = value;
    },
    getProfileEdit() {
      this.editVisible = !this.editVisible;
    },
  },
};
</script>

<style scoped>
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  margin-bottom: 20px;
  color: var(--header-color);
}
.head {
  font-size: 20px;
}
.information {
  font-size: 20px;
}
b {
  font-size: 18px;
}
p {
  margin-top: 3px;
}
hr {
  margin-bottom: 25px;
}
.group-row {
  display: flex;
}
.group-item {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.fa-pencil {
  position: absolute;
  right: 8%;
  font-size: 25px;
}
.fa-pencil:hover {
  color: var(--primary-blue);
}
@media (max-width: 750px) {
  .fa-pencil {
    font-size: 20px;
  }
}
</style>