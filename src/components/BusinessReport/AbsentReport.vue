<template>
  <div class="chart-container">
    <div class="header">
      <p :style="{ fontSize: '16px' }">Absence in</p>
      <CustomSelect
        type="Transparent"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>

    <div class="vl"></div>
    <div v-if="!errorSearching" class="list">
      <div class="item" v-for="(record, i) in absenceSum" :key="i">
        <div class="date">
          <b>{{ record.day }}</b>
          <div class="vl" :style="{ width: '90%', margin: '1px 0' }"></div>
          <b>{{ setMonth(record.month) }}</b>
        </div>
        <div class="detail">
          <p :style="{ fontSize: '12px', margin: 0 }">No. of Employee</p>
          <b :style="{ fontSize: '24px' }">{{ record.numEmployee }}</b>
        </div>
      </div>
    </div>
    <div class="error-img">
      <img src="../../assets/search-icon.png" v-if="errorSearching" />
    </div>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import axios from "axios";
import Mixins from "../../Mixins";

export default {
  name: "AbsentReport",
  components: { CustomSelect },
  data() {
    return {
      errorSearching: false,
      absenceSum: [],
      searchRange: "",
      displayRange: null,
    };
  },
  created() {
    this.year = new Date().getFullYear();
    this.searchRange = Mixins.methods.getPastYears(6);
    this.getAbsence();
  },
  methods: {
    graphRange(value) {
      this.year = value;
      this.getAbsence();
    },
    getAbsence() {
      this.absenceSum = [];
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getAbsence",
          year: this.year,
        })
        .then(
          function(res) {
            if (res.data == null) {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;

              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].numEmployee > 0) {
                  this.absenceSum.push(res.data[i]);
                }
              }
            }
          }.bind(this)
        );
    },
    setMonth(data) {
      var month = "";
      if (data == 1) {
        month = "JAN";
      } else if (data == 2) {
        month = "FEB";
      } else if (data == 3) {
        month = "MAR";
      } else if (data == 4) {
        month = "APR";
      } else if (data == 5) {
        month = "MAY";
      } else if (data == 6) {
        month = "JUN";
      } else if (data == 7) {
        month = "JUL";
      } else if (data == 8) {
        month = "AUG";
      } else if (data == 9) {
        month = "SEP";
      } else if (data == 10) {
        month = "OCT";
      } else if (data == 11) {
        month = "NOV";
      } else if (data == 12) {
        month = "DEC";
      }

      return month;
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 31%;
  height: 310px;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vl {
  width: 100%;
  height: 1px;
  background: var(--grey-highlight);
}
.error-img {
  display: flex;
  margin: auto;
  justify-content: center;
}
img {
  width: 80%;
}
.list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.item {
  width: 90%;
  height: 50px;
  padding: 10px 0;
  display: flex;
  align-self: center;
  border-bottom: 1px solid var(--grey-highlight);
}
.date {
  background: #ff725e;
  width: 50px;
  padding: 2px;
  border-radius: 7px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 13px;
}
b {
  font-size: 12px;
}
p {
  font-size: 14px;
  color: var(--grey-text);
}
.detail {
  display: flex;
  flex-direction: column;
  padding-left: 15px;
}
@media (max-width: 750px) {
  .chart-container {
    width: 47%;
  }
}
</style>
