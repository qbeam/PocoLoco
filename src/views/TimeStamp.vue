<template>
  <div class="container">
      <div class="inner-container">
        <h1>TimeStamp</h1>
        <h1>{{hour}}:{{minute}}:{{second}}</h1>
        <h2>{{day}}, {{month}} {{date}}, {{year}}</h2>
        <input type="text">
        <DefaultButton
          :style="{
            height: '45px',
            width: '150px',
            background: 'var(--primary-red)',
            fontSize: '15px',
          }"
          >Submit</DefaultButton>
      </div>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton.vue";
export default {
    name: "TimeStamp",
    components: {
        DefaultButton,
    },
    mounted() {
        setInterval(() => {
            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
        }, 1000)
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
        }
    },

}
</script>

<style scope>
.container {
  display: flex;
  text-align: center;
  width: 100%;
  background: var(--primary-blue);
}
.inner-container {
    width: 80%;
    align-self: center;
    height: 100%;
    margin: 40px;
    background-color: white;
  }
input {
  width: 300px;
  height: 35px;
  padding-left: 10px;
  margin-bottom: 30px;
}
</style>