<template>
  <!-- <TablePage >
  </TablePage> -->
  <!-- <Navbar /> -->
  <Container>
    <h1>Home Page</h1>
  </Container>
</template>

<script>
import TablePage from "../components/TablePage";
import Navbar from "../components/Navbar.vue";
import Container from "../components/Container.vue";
import Popup from "../components/Popup.vue";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "Home",
  components: { TablePage, Navbar, Container, Popup, SearchError },
  data() {
    return {
      role: "",
      department: "",
      employeeID:"",
      profilePic:"",
      visible: false,
      user: "",

    };
  },
  // watch: {
  // role: function() {
  //     this.goToHomePage()
  // }
  // },
  methods: {
    popReturn(value) {
      this.visible = value;
    },
     goToHomePage(){
       console.log(this.role)
      if (this.role === "Owner" || this.role === "Admin") {
      this.$router.push("/BusinessAnalysis");
    }
    if (this.role === "Manager" && this.department === "Receptionist") {
      this.$router.push("/FloorPlan");
    }
    if (this.role === "Receptionist") {
      this.$router.push("/FloorPlan");
    }
    if (this.role === "Manager" && this.department === "Kitchen") {
      this.$router.push("/ServiceToDo");
    }
    if (this.role === "Chef") {
      this.$router.push("/ServiceToDo");
    }
    if (this.role === "Manager" && this.department === "Housekeeping") {
      this.$router.push("/FloorPlan");
    }
    if (this.role === "Maid") {
      this.$router.push("/FloorPlan");
    }
    },
    storeData() {
      this.$store.state.user = ""
      this.$store.state.employeeDetail.employeeID = this.employeeID;
      this.$store.state.employeeDetail.role = this.role;
      this.$store.state.employeeDetail.department = this.department;
      // this.$store.state.employeeDetail.profilePic = this.profilePic;
      console.log(this.$store.state.employeeDetail.employeeID);
      console.log(this.$store.state.employeeDetail.role);
      console.log(this.$store.state.employeeDetail.department);
      this.goToHomePage();
      // console.log(this.$store.state.employeeDetail.profilePic);
    },
    async getInformation() {
      await axios
        .post("http://localhost:8080/PocoLoco_db/api_login.php", {
          action: "getInformation",
          employeeID: this.user,
        })
        .then(
          function(res) {
            this.employeeID = res.data.employeeID;
            this.role = res.data.roleName;
            this.department = res.data.departmentName;
            console.log(this.role);
            // this.profilePic = res.data.roleName + res.data.gender;
            // console.log(this.profilePic);
            this.storeData();
          }.bind(this)
        );
    },
  },
  created() {
    console.log("info");
    this.user = localStorage.getItem("user")
    this.getInformation();
  //   this.role = this.$store.state.employeeDetail.role;
  //   this.department = this.$store.state.employeeDetail.department;
  //   if (this.role === "Owner" || this.role === "Admin") {
  //     this.$router.push("/BusinessAnalysis");
  //   }
  //   if (this.role === "Manager" && this.department === "Receptionist") {
  //     this.$router.push("/FloorPlan");
  //   }
  //   if (this.role === "Receptionist") {
  //     this.$router.push("/FloorPlan");
  //   }
  //   if (this.role === "Manager" && this.department === "Kitchen") {
  //     this.$router.push("/ServiceToDo");
  //   }
  //   if (this.role === "Chef") {
  //     this.$router.push("/ServiceToDo");
  //   }
  //   if (this.role === "Manager" && this.department === "Housekeeping") {
  //     this.$router.push("/FloorPlan");
  //   }
  //   if (this.role === "Maid") {
  //     this.$router.push("/FloorPlan");
  //   }
  },
};
</script>
