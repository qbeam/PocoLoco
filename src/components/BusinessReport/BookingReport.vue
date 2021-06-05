<template>
  <div class="chart-container">
    <div class="header">
      <p class="title">Booking in</p>
      <CustomSelect
        type="Transparent"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>

    <div v-if="!errorSearching" class="seasons">
      <button class="season-button" v-for="(season, i) in seasons" :key="i">
        <div class="head" :style="i % 2 !== 0 ? { background: '#455A64' } : {}">
          <b>{{ setDate(season.startDate, season.endDate) }}</b>
          <div class="vl"></div>
          <b>{{ setMonth(season.startMonth, season.endMonth) }}</b>
        </div>
        <div class="detail">
          <p>{{ season.name }}</p>
          <h4>{{ season.amount }}</h4>
        </div>
      </button>
    </div>
    <div class="error-img" v-if="errorSearching">
      <img src="../../assets/search-icon.png" />
    </div>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import axios from "axios";
import Mixins from "../../Mixins";

export default {
  name: "BookingReport",
  components: { CustomSelect },
  data() {
    return {
      errorSearching: false,
      seasons: [],
      searchRange: [2021, 2020, 2019, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      displayRange: null,
    };
  },
  created() {
    this.year = new Date().getFullYear();
    this.getYear();
  },
  methods: {
    graphRange(value) {
      this.year = value;
      this.getBookingPro();
    },
    getYear() {
      this.searchRange = Mixins.methods.getPastYears(5);
      this.getBookingPro();
    },
    getBookingPro() {
      this.seasons = [];
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getBookingPro",
          year: this.year,
        })
        .then(
          function(res) {
            if (res.data == null) {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
              for (var i = 0; i < res.data.length; i++) {
                this.seasons.push(res.data[i]);
              }
            }
          }.bind(this)
        );
    },
    setMonth(startMonth, endMonth) {
      var month = "";
      var monthEnd = "";
      if (startMonth == 1) {
        month = "JAN";
      } else if (startMonth == 2) {
        month = "FEB";
      } else if (startMonth == 3) {
        month = "MAR";
      } else if (startMonth == 4) {
        month = "APR";
      } else if (startMonth == 5) {
        month = "MAY";
      } else if (startMonth == 6) {
        month = "JUN";
      } else if (startMonth == 7) {
        month = "JUL";
      } else if (startMonth == 8) {
        month = "AUG";
      } else if (startMonth == 9) {
        month = "SEP";
      } else if (startMonth == 10) {
        month = "OCT";
      } else if (startMonth == 11) {
        month = "NOV";
      } else if (startMonth == 12) {
        month = "DEC";
      }
      if (startMonth == endMonth) {
        return month;
      } else {
        if (endMonth == 1) {
          monthEnd = "JAN";
        } else if (endMonth == 2) {
          monthEnd = "FEB";
        } else if (endMonth == 3) {
          monthEnd = "MAR";
        } else if (endMonth == 4) {
          monthEnd = "APR";
        } else if (endMonth == 5) {
          monthEnd = "MAY";
        } else if (endMonth == 6) {
          monthEnd = "JUN";
        } else if (endMonth == 7) {
          monthEnd = "JUL";
        } else if (endMonth == 8) {
          monthEnd = "AUG";
        } else if (endMonth == 9) {
          monthEnd = "SEP";
        } else if (endMonth == 10) {
          monthEnd = "OCT";
        } else if (endMonth == 11) {
          monthEnd = "NOV";
        } else if (endMonth == 12) {
          monthEnd = "DEC";
        }
        return (month = month + " - " + monthEnd);
      }
    },
    setDate(startDate, endDate) {
      return startDate + " - " + endDate;
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 31%;
  height: 300px;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 5px 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  align-items: center;
}
.header {
  display: flex;
  align-items: center;
}
.error-img {
  display: flex;
  margin: auto;
  justify-content: center;
}
img {
  width: 80%;
}
.title {
  font-size: 16px;
  margin: 10px 0;
}

.seasons {
  height: 250px;
  width: 95%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.season-button {
  align-self: center;
  width: 100%;
  display: flex;
  background: #ebebeb;
  margin: 3px 0;
  border-radius: 7px;
  border: none;
  padding: 0;
  cursor: pointer;
}

.head {
  background: #ff725e;
  width: 30%;
  height: 50px;
  border-radius: 7px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 13px;
}
.detail {
  width: 70%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.vl {
  width: 90%;
  height: 1px;
  background: white;
  align-self: center;
  margin: 2px 0;
}
p {
  font-size: 12px;
  color: var(--grey-text);
  margin: 2px 0;
}
h4 {
  color: var(--grey-text);
  font-size: 16px;
  margin: 0;
}
@media (max-width: 750px) {
  .chart-container {
    width: 47%;
  }
}
</style>
