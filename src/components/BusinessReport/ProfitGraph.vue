<template>
  <div class="graph-container">
    <div class="header">
      <p>Profit Summary in</p>
      <CustomSelect
        type="Transparent"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>

    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";

const lineColors = ["#FFC42E", "#FF0000", "#24BA45"];

export default {
  name: "ProfitGraph",
  components: { CustomSelect },
  data() {
    return {
      income: [20, 25, 30, 35, 15, 24, 56, 30, 35, 15, 24, 56],
      expense: [12, 11, 14, 18, 17, 13, 13, 18, 17, 13, 13, 12],
      profit: [],
      searchRange: [2021, 2020, 2019, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      displayRange: null,
      series: [
        {
          name: "Earning",
          data: [20, 25, 30, 35, 15, 24, 56, 30, 35, 15, 24, 56],
        },
        {
          name: "Expense",
          data: [12, 11, 14, 18, 17, 13, 13, 18, 17, 13, 13, 12],
        },
        {
          name: "Profit",
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // profit = earning - expense
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          dropShadow: {
            enabled: true,
            color: "#000",
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: lineColors,
        stroke: {
          curve: "straight",
          width: 2,
        },

        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        markers: {
          shape: "circle",
          size: 3,
          strokeColors: lineColors,
          hover: {
            size: 5,
          },
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
        },
        responsive: [
          {
            breakpoint: 750,
            options: {
              chart: {
                height: 250,
              },
            },
          },
          {
            breakpoint: 550,
            options: {
              chart: {
                height: 200,
              },
              markers: {
                size: 2,
                hover: { size: 4 },
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    graphRange(value) {
      this.displayRange = value;
    },
  },
};
</script>

<style scoped>
.graph-container {
  width: 100%;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding-top: 20px;
}
.header {
  display: flex;
  align-items: center;
}
p {
  margin: 0 0 0 15px;
  font-size: 16px;
  color: var(--grey-text);
}
@media (max-width: 750px) {
  .graph-container {
    margin: 5px auto;
  }
}
</style>
