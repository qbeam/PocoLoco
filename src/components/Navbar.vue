<template>
  <div
    id="nav"
    :style="width <= 1000 ? (visible ? {} : { width: '60px' }) : {}"
  >
    <button
      class="close"
      @click="returnVisible"
      :style="
        width <= 1000
          ? visible
            ? {}
            : { left: '15px', top: '15px' }
          : { display: 'none' }
      "
    >
      <i class="fa fa-times fa-2x" v-if="width <= 1000 && visible"></i>
      <i class="fa fa-bars fa-2x" v-if="!visible"></i>
    </button>
    <div class="circle" v-if="visible || width > 1000">
      <img :src="require(`../assets/${profilePic}.png`)" />
    </div>
    <div class="info" v-if="visible || width > 1000">
      <b>{{ role }}</b>
      <b>{{ employeeID }}</b>
    </div>

    <div class="menu" v-if="visible || width > 1000">
      <router-link
        v-for="(permission, i) in permissions"
        :key="i"
        :to="{ name: `${permission.path}`}"
        >{{ permission.name }}</router-link
      >
    </div>

    <button class="logout-button" v-if="visible || width > 1000">
      <div class="logout-text">
        <i
          class="fa fa-sign-out fa-2x"
          :style="visible ? { paddingRight: '5px' } : {}"
        >
        </i>
        <div>Logout</div>
      </div>
    </button>
  </div>
</template>

<script>
import { useScreenWidth } from "../composables/useScreenWidth";
import axios from "axios";

const AdminOwner = [
  { name: "Overview", path: "BusinessAnalysis" },
  { name: "Employee", path: "Employee" },
  { name: "Customer", path: "Customer" },
  { name: "Room", path: "Room" },
  { name: "Promotion", path: "Promotion" },
  { name: "Booking", path: "Booking" },
  { name: "Booking Detail", path: "BookingDetail" },
  { name: "Services", path: "Services" },
  { name: "Payment", path: "Payment" },
  { name: "Hotel Expenses", path: "HotelExpenses" },
];
const ReceptionManager = [
  { name: "Home", path: "FloorPlan" },
  { name: "Employee", path: "Employee" },
  { name: "Customer", path: "Customer" },
  { name: "Booking", path: "Booking" },
  { name: "Booking Detail", path: "BookingDetail" },
  { name: "Services", path: "Services" },
  { name: "Payment", path: "Payment" },
  { name: "Room", path: "Room" },
  { name: "Promotion", path: "Promotion" },
  { name: "My Account", path: "MyAccount" },
];
const Receptionist = [
  { name: "Home", path: "FloorPlan" },
  { name: "Customer", path: "Customer" },
  { name: "Booking", path: "Booking" },
  { name: "Booking Detail", path: "BookingDetail" },
  { name: "Services", path: "Services" },
  { name: "Payment", path: "Payment" },
  { name: "Room", path: "Room" },
  { name: "Promotion", path: "Promotion" },
  { name: "My Account", path: "MyAccount" },
];
const MaidManager = [
  { name: "Home", path: "FloorPlan" },
  { name: "Order", path: "ServiceToDo" },
  { name: "Employee", path: "Employee" },
  { name: "Services", path: "Services" },
  { name: "My Account", path: "MyAccount" },
];
const Maid = [
  { name: "Home", path: "FloorPlan" },
  { name: "Order", path: "ServiceToDo" },
  { name: "Services", path: "Services" },
  { name: "My Account", path: "MyAccount" },
];
const ChefManager = [
  { name: "Home", path: "ServiceToDo" },
  { name: "Employee", path: "Employee" },
  { name: "Services", path: "Services" },
  { name: "My Account", path: "MyAccount" },
];
const Chef = [
  { name: "Home", path: "ServiceToDo" },
  { name: "Services", path: "Services" },
  { name: "My Account", path: "MyAccount" },
];
export default {
  name: "Navbar",
  data() {
    return {
      AdminOwner,
      ReceptionManager,
      Receptionist,
      MaidManager,
      Maid,
      ChefManager,
      Chef,
      employeeID: "",
      role: "",
      department: "",
      gender: "",
      profilePic: "AdminF",
      visible: false,
      permissions: [],
      user: "",
    };
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },

  created() {
    if (this.$store.state.user != "") {
      this.$router.push("/Home");
      // this.getInformation()
    }
    this.employeeID = this.$store.state.employeeDetail.employeeID;
    this.role = this.$store.state.employeeDetail.role;
    this.department = this.$store.state.employeeDetail.department;
    // this.profilePic = this.$store.state.employeeDetail.profilePic;
    this.routerPermission();
  },

  methods: {
    error404() {
      this.$router.push("/Error404");
    },
    routertest() {
      this.$router.push("/ServiceToDo");
    },
    storeData() {
      this.$store.state.employeeDetail.employeeID = this.employeeID;
      this.$store.state.employeeDetail.role = this.role;
      this.$store.state.employeeDetail.department = this.department;
      // this.$store.state.employeeDetail.profilePic = this.profilePic;
      console.log(this.$store.state.employeeDetail.employeeID);
      console.log(this.$store.state.employeeDetail.role);
      console.log(this.$store.state.employeeDetail.department);
      // console.log(this.$store.state.employeeDetail.profilePic);
      this.routerPermission();
    },
    // async getInformation() {
    //   await axios
    //     .post("http://localhost:8080/PocoLoco_db/api_login.php", {
    //       action: "getInformation",
    //       employeeID: this.user,
    //     })
    //     .then(
    //       await function(res) {
    //         this.employeeID = res.data.employeeID;
    //         this.role = res.data.roleName;
    //         this.department = res.data.departmentName;
    //         console.log("DATA", res.data);
    //         // this.profilePic = res.data.roleName + res.data.gender;
    //         // console.log(this.profilePic);
    //         this.storeData();
    //       }.bind(this)
    //     );
    // },
    returnVisible() {
      this.visible = !this.visible;
      this.$emit("NavReturn", this.visible);
    },
    routerPermission() {
      if (this.role === "Owner" || this.role === "Admin") {
        this.permissions = AdminOwner;
      }
      if (this.role === "Manager" && this.department === "Receptionist") {
        this.permissions = ReceptionManager;
      }
      if (this.role === "Receptionist") {
        this.permissions = Receptionist;
      }
      if (this.role === "Manager" && this.department === "Kitchen") {
        this.permissions = ChefManager;
      }
      if (this.role === "Chef") {
        this.permissions = Chef;
      }
      if (this.role === "Manager" && this.department === "Housekeeping") {
        this.permissions = MaidManager;
      }
      if (this.role === "Maid") {
        this.permissions = Maid;
      }
    },
  },
};
</script>

<style scoped>
#nav {
  width: 200px;
  height: 100%;
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  overflow-x: hidden;
  display: flex;
  padding-top: 60px;
  flex-direction: column;
  background-color: var(--primary-blue);
  transition: width 0.25s;
}
#nav a {
  font-weight: bold;
  color: #fcfcfc;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 0;
  padding-left: 40px;
}
#nav a:hover {
  background: white;
  border-radius: 50px;
  opacity: 0.85;
  z-index: 10;
  color: var(--text-color);
}
#nav a.router-link-exact-active {
  color: var(--text-color);
  background: white;
  border-radius: 50px;
  z-index: 10;
}
.close {
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  position: fixed;
  top: 5px;
  left: 165px;
  z-index: 10;
  cursor: pointer;
}
.close:hover {
  opacity: 0.7;
}
i {
  color: white;
  cursor: pointer;
}
.circle {
  width: 90px;
  height: 90px;
  background: var(--primary-yellow);
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
}
img {
  width: 55px;
  align-self: center;
  padding-top: 25px;
}
.info {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
}
b {
  font-size: 18px;
  color: white;
  align-self: center;
}
.menu {
  display: flex;
  flex-direction: column;
  padding: 45px 0 0 20px;
  margin-right: -20px;
}
.logout-button {
  width: 120px;
  left: 40px;
  bottom: 30px;
  height: 35px;
  position: fixed;
  z-index: 10;
  background: none;
  border: none;
}
.logout-button:hover {
  cursor: pointer;
  opacity: 0.7;
}
.logout-text {
  width: 100%;
  color: white;
  font-size: 16px;
  font-family: sans-serif;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
*:focus {
  outline: 0;
}
</style>
