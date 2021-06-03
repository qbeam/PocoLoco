<template>
  <!-- <TablePage >
  </TablePage> -->
  <Navbar />
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

export default {
  name: "Home",
  components: { TablePage, Navbar, Container, Popup, SearchError },
  data() {
    return {
      role: "",
      department: "",
      visible: false,
    };
  },
  methods: {
    popReturn(value) {
      this.visible = value;
    },
  },
  created() {
    this.role = this.$store.state.employeeDetail.role;
    this.department = this.$store.state.employeeDetail.department;
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
};
</script>
