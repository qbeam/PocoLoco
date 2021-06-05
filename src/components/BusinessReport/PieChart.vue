<template>
  <div class="chart-container">
    <div class="header">
      <p>{{ title }}</p>
      <CustomSelect
        type="Transparent"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>
    <apexchart
      v-if="!errorSearching"
      type="pie"
      :width="pieSize"
      :options="options"
      :series="series"
    />
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
  name: "PieChart",
  props: ["type"],
  components: { CustomSelect },
  data() {
    return {
      errorSearching: false,
      title: null,
      topService: [
        { name: "Extra Pillow", portion: 50 },
        { name: "Extra Towel", portion: 23 },
        { name: "Extra Bed", portion: 17 },
        { name: "Others", portion: 10 },
      ],
      topMenu: [
        { name: "Crab Fried Rice", portion: 33 },
        { name: "Coke", portion: 18 },
        { name: "American Breakfast", portion: 7 },
        { name: "Others", portion: 42 },
      ],
      pieSize: 320,
      searchRange: [2021, 2020, 2019, 1, 2],
      displayRange: null,
      series: null,
      options: {
        chart: {
          type: "pie",
        },
        labels: null,
      },
      year: "",
      month: "",
      typeID: "",
    };
  },

  methods: {
    graphRange(value) {
      this.year = value;
      this.getService();
    },
    extractArray(inputList) {
      this.options.labels = inputList.map((item) => item.name);
      this.series = inputList.map((item) => item.portion);
    },
    getService() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getRoomService",
          year: this.year,
          type: this.typeID,
        })
        .then(
          function(res) {
            if (res.data == null) {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
              this.setService(res.data, this.typeID);
            }
          }.bind(this)
        );
    },
    setService(service, type) {
      var total = 0;
      var totalOther = 0;
      var other = 0;

      for (let i = 0; i < service.length; i++) {
        total = total + Number(service[i].numService);
      }
      for (let j = 3; j < service.length; j++) {
        totalOther = totalOther + Number(service[j].numService);
      }
      other = (totalOther / total) * 100;

      if (type == 1) {
        this.topService[0].portion = (service[0].numService / total) * 100;
        this.topService[1].portion = (service[1].numService / total) * 100;
        this.topService[2].portion = (service[2].numService / total) * 100;
        this.topService[3].portion = other;
        this.extractArray(this.topService);
      } else if (type == 2) {
        this.topMenu[0].portion = (service[0].numService / total) * 100;
        this.topMenu[1].portion = (service[1].numService / total) * 100;
        this.topMenu[2].portion = (service[2].numService / total) * 100;
        this.topMenu[3].portion = other;
        this.extractArray(this.topMenu);
      }
    },
  },
  created() {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.searchRange = Mixins.methods.getPastYears(5);
    if (this.type == "service") {
      this.extractArray(this.topService);
      this.typeID = 1;
    } else if (this.type == "food") {
      this.extractArray(this.topMenu);
      this.pieSize = 360;
      this.typeID = 2;
    }
    this.getService();
  },
  mounted() {
    if (this.type == "service") {
      this.title = "Service popularity in";
    } else if (this.type == "food") {
      this.title = "Menu popularity in";
    }
  },
};
</script>

<style scoped>
.chart-container {
  width: 47%;
  height: 230px;
  background: white;
  padding: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
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
@media (max-width: 1200px) {
  .chart-container {
    width: 46%;
  }
}
@media (max-width: 750px) {
  .chart-container {
    width: 95%;
    margin: 15px auto;
  }
}
</style>
