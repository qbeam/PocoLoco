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
      type="pie"
      :width="pieSize"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";

const topService = [
  { name: "Extra Pillow", portion: 45 },
  { name: "Extra Towel", portion: 23 },
  { name: "Extra Bed", portion: 17 },
  { name: "Others", portion: 15 },
];

const topMenu = [
  { name: "Crab Fried Rice", portion: 33 },
  { name: "Coke", portion: 18 },
  { name: "American Breakfast", portion: 7 },
  { name: "Others", portion: 42 },
];

export default {
  name: "PieChart",
  props: ["type"],
  components: { CustomSelect },
  data() {
    return {
      title: null,
      topService,
      topMenu,
      pieSize: 320,
      searchRange: [2021, 2020, 2019, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      displayRange: null,
      series: null,
      options: {
        chart: {
          type: "pie",
        },
        labels: null,
      },
    };
  },
  methods: {
    graphRange(value) {
      this.displayRange = value;
    },
    extractArray(inputList) {
      this.options.labels = inputList.map((item) => item.name);
      this.series = inputList.map((item) => item.portion);
    },
  },
  created() {
    if (this.type == "service") {
      this.extractArray(this.topService);
    } else if (this.type == "food") {
      this.extractArray(this.topMenu);
      this.pieSize = 360;
    }
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
