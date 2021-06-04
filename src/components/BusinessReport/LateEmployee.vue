<template>
  <div class="chart-container">
    <div class="header">
      <p :style="{ fontSize: '16px' }">Punctuality in</p>
      <CustomSelect
        type="Transparent"
        :defaultChoice="displayRange"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>

    <div class="vl"></div>
    <div v-if="!errorSearching" class="list">
      <div class="item" v-for="(record, i) in lateEmployee" :key="i">
        <div class="icon">
          <div class="user-icon">
            <img :src="require(`../../assets/${record.picName}.png`)" />
          </div>
        </div>

        <div class="detail">
          <p :style="{ fontWeight: 'bold' }">
            {{ record.employeeID }} {{ record.name }}
          </p>
          <div class="item">
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: record.lateCount + '%' }"
              ></div>
            </div>
            <p class="unit">{{ record.percentLate }}% late</p>
          </div>
        </div>
      </div>
    </div>
    <img
      class="error-img"
      src="../../assets/search-icon.png"
      v-if="errorSearching"
    />
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import axios from "axios";

export default {
  name: "LateEmployee",
  components: { CustomSelect },

  data() {
    return {
      errorSearching: false,
      searchRange: [2021, 2020, 2019, 1, 2],
      displayRange: "",
      year: "",
      lateEmployee: "",
    };
  },
  created() {
    this.year = new Date().getFullYear();
    this.getYear();
    this.getLateEmployee();
  },
  methods: {
    getYear() {
      const year = [];
      var yearNow = this.year;
      for (let i = 0; i < 5; i++) {
        year.push(yearNow);
        yearNow = yearNow - 1;
      }
      this.searchRange = year;
      this.displayRange = this.searchRange[0];
    },
    graphRange(value) {
      this.displayRange = value;
      this.getLateEmployee();
    },
    getLateEmployee() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getLateEmployee",
          year: this.displayRange,
        })
        .then(
          function(res) {
            if (res.data == null) {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
              this.lateEmployee = res.data;
            }
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 33%;
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
.error-img {
  display: flex;
  margin: auto;
  justify-content: center;
  width: 42%;
  height: 37%;
}

.list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
p {
  margin-left: 15px;
  font-size: 14px;
  color: var(--grey-text);
}
.vl {
  width: 100%;
  height: 1px;
  background: var(--grey-highlight);
}
.item {
  width: 90%;
  display: flex;
  align-self: center;
  border-bottom: 1px solid var(--grey-highlight);
}
.icon {
  width: 20%;
  display: flex;
  justify-content: center;
}
.user-icon {
  width: 35px;
  height: 35px;
  background: var(--primary-yellow);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  overflow: hidden;
  align-self: center;
}
.detail {
  width: 80%;
}
img {
  height: 30px;
  margin-top: 5px;
}
.amount {
  margin: -10px 0 10px 15px;
  font-size: 10px;
}
.progress-bar {
  width: 50%;
  height: 4px;
  background: #c7c7c7;
  border-radius: 50px;
  margin: -5px 0 10px 15px;
}
.progress {
  width: 50%;
  height: 100%;
  border-radius: 5px;
  transition: width 2s ease;
  background: #f2651d;
}
.unit {
  margin: -12px 0 0 10px;
  font-size: 10px;
}

@media (max-width: 750px) {
  .chart-container {
    width: 100%;
    height: 350px;
    margin: 15px 0;
  }
  .progress-bar {
    width: 60%;
  }
}
</style>
