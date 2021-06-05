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
import axios from "axios";
import Mixins from "../../Mixins";

const lineColors = ["#FFC42E", "#FF0000", "#24BA45"];

export default {
  name: "ProfitGraph",
  components: { CustomSelect },
  data() {
    return {
      income: [20, 25, 30, 35, 15, 24, 56, 30, 35, 15, 24, 56],
      expense: [12, 11, 40, 18, 17, 13, 13, 18, 17, 13, 13, 12],
      profit: [],
      searchRange: [2021, 2020, 2019, 1, 2],
      displayRange: null,
      series: [
        {
          name: "Earning",
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
        },
        {
          name: "Expense",
          data: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
        },
        {
          name: "Profit",
          data: [1, 2, -10, 4, 5, 6, 7, 8, 9, 10, 11, 12], // profit = earning - expense
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
      year: "",
      month: "",
    };
  },
  created() {
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.getYear();
  },
  methods: {
    graphRange(value) {
      this.year = value;
      this.getEarning();
      this.getExpense();
    },
    getYear() {
      this.searchRange = Mixins.methods.getPastYears(5);
      this.getEarning();
      this.getExpense();
    },
    getEarning() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getEarning",
          year: this.year,
        })
        .then(
          function(res) {
            this.setSeries(res.data, "earning");
          }.bind(this)
        );
    },
    setSeries(data, type) {
      const temp = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
      ];

      for (let i = 0; i < data.length; i++) {
        const month = data[i].month;
        temp[month - 1] = Number(data[i].summary);
      }
      if (type == "earning") {
        this.series[0].data = temp;
      } else if (type == "expense") {
        this.series[1].data = temp;
      }
      this.getProfit();
    },
    getProfit() {
      const profit = [];

      for (let i = 0; i < 12; i++) {
        if (this.series[0].data[i] == null && this.series[1].data[i] == null) {
          profit.push(null);
        } else {
          profit.push(this.series[0].data[i] - this.series[1].data[i]);
        }
      }
      this.series[2].data = profit;
    },

    getExpense() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getExpense",
          year: this.year,
        })
        .then(
          function(res) {
            this.setSeries(res.data, "expense");
          }.bind(this)
        );
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
