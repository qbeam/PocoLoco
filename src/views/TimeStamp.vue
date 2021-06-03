<template>
  <div class="container">
    <div class="inner-container">
      <h1>Timestamp</h1>
      <div class="current-time">
        <p>{{ hour }}</p>
        <p>:</p>
        <p>{{ minute }}</p>
        <p>:</p>
        <p>{{ second }}</p>
      </div>
      <h2>{{ day }}, {{ month }} {{ date }}, {{ year }}</h2>
      <input v-model="employeeID" type="text" placeholder="Employee ID" />
      <div class="arrange-button">
        <DefaultButton
          @click="goTimeStamp('I')"
          :style="{
            background: 'var(--button-blue)',
            alignSelf: 'center',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
          }"
          >IN
        </DefaultButton>
        <DefaultButton
          @click="goTimeStamp('O')"
          :style="{
            background: 'var(--primary-red)',
            alignSelf: 'center',
            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
          }"
          >OUT</DefaultButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton.vue";
import axios from "axios";

export default {
  name: "TimeStamp",
  components: {
    DefaultButton,
  },
  mounted() {
    setInterval(() => {
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      this.day = days[new Date().getDay()];
      this.date = new Date().getDate();
      this.month = months[new Date().getMonth()];
      this.year = new Date().getFullYear();
      this.hour = new Date().getHours();
      this.minute = new Date().getMinutes();
      this.second = new Date().getSeconds();

      if (this.hour < 10) {
        this.hour = "0" + this.hour;
      }
      if (this.minute < 10) {
        this.minute = "0" + this.minute;
      }
      if (this.second < 10) {
        this.second = "0" + this.second;
      }
    }, 1000);
  },
  data() {
    return {
      today: "",
      date: "",
      day: "",
      month: "",
      year: "",
      hour: "",
      minute: "",
      second: "",
      employeeID: "",
    };
  },

  methods: {
    goTimeStamp(type) {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_timeStamp.php", {
          action: "timeStamp",
          employeeID: this.employeeID,
          type: type,
        })
        .then(
          function(res) {
            if (res.data.success == true && type == "I") {
              alert("Employee ID : " + this.employeeID + " In!");
            } else if (res.data.success == true && type == "O") {
              alert("Employee ID : " + this.employeeID + " Out!");
            } else {
              alert("Cannot timestamp Employee ID : " + this.employeeID);
            }
            this.employeeID = "";
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  background: var(--primary-blue);
  padding: 0;
}
.inner-container {
  width: 70%;
  height: 80%;
  margin: auto;
  background-color: white;
  justify-content: center;
  align-items: center;
}
h1 {
  font-size: 64px;
  color: #0b2e4f;
  margin: 25px 0;
}
.current-time {
  display: flex;
  font-size: 64px;
  font-weight: bold;
  color: #4e7087;
  width: 50%;
  justify-content: space-between;
  margin: 25px 0 20px 0;
}
p {
  margin: 0;
}
h2 {
  margin: 0;
  font-size: 24px;
  color: #4e7087;
}
input {
  width: 300px;
  height: 50px;
  margin: 50px 0 30px 0;
  align-self: center;
  border: 0;
  background: #fcfcfc;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  text-align: center;
  font-size: 24px;
  color: var(--text-color);
}

@media (max-width: 550px) {
  .current-time {
    width: 80%;
  }
  .inner-container {
    width: 70%;
    height: 90%;
    margin: auto;
    background-color: white;
    text-align: center;
    justify-content: flex-start;
  }
}
</style>
