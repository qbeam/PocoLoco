<template>
  <Navbar />
  <Container>
    <div>
      <div>
        <h1>Booking</h1>
      </div>
      <div>
        <h2 style="display: inline-block">Customer ID</h2>
        <input type="text" placeholder="Search" style="margin-left: 10px" />
      </div>
      <hr />
      <div>
        <h3 style="display: inline-block">Booking ID:</h3>
        <a style="margin-left: 10px">{{ bookingID[0].id }}</a>
        <br />
        <h3 style="display: inline-block">Name:</h3>
        <a style="margin: 10px">{{ bookingID[0].name }}</a>
        <h3 style="display: inline-block">Phone:</h3>
        <a style="margin-left: 10px">{{ bookingID[0].phone }}</a>
      </div>
      <hr />
      <p v-for="bookingID in bookingID" :key="bookingID.id">
        {{ bookingID.id }} {{ bookingID.name }} {{ bookingID.roomID }}
      </p>
      <DefaultButton :style="{ background: '#FFC979' }">SAVE</DefaultButton>
    </div>
  </Container>
</template>

<script>
import DefaultButton from "../components/DefaultButton.vue";
import Navbar from "../components/Navbar.vue";
import Container from "../components/Container.vue";
export default {
  name: "Booking",
  components: { DefaultButton, Navbar, Container },
  data() {
    return {
      bookingID: [
        { id: 1002501, name: "Ying", roomID: "1001", phone: "095-587-8659" },
        { id: 1002502, name: "Panpan", roomID: "1002", phone: "095-587-8659" },
        {
          id: 1002503,
          name: "Pungjung",
          roomID: "1003",
          phone: "095-587-8659",
        },
        { id: 1002504, name: "Mew", roomID: "2005", phone: "095-587-8659" },
        { id: 1002505, name: "Beam", roomID: "2008", phone: "095-587-8659" },
      ],
    };
  },
};
</script>

<style scoped>
input {
  width: 250px;
  height: 35px;
  margin: 0 80px 40px 0;
  padding-left: 10px;
}
hr {
  width: 700px;
  margin: 0px;
}
</style>
