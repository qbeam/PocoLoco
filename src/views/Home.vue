<template>
  <Navbar />
  <Container>
    <h1>Home Page</h1>
    <button @click="visible = !visible">Show Popup</button>
    <Popup v-bind:visible="visible" @popReturn="popReturn">
      <h4>Service Type</h4>
    </Popup>
  </Container>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Container from "../components/Container.vue";
import Popup from "../components/Popup.vue";
import SearchError from "../components/SearchError";

export default {
  name: "Home",
  components: { Navbar, Container, Popup, SearchError },
  data() {
    return {
      employeeID: "",
      visible: false,
    };
  },
  methods: {
    popReturn(value) {
      this.visible = value;
    },
  },
  created() {
    this.employeeID = this.$route.params.employeeID;
    console.log(this.$route.params);
  },
};
</script>
