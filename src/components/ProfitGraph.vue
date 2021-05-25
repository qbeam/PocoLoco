<template>
  <div class="graph-container">
    <p>Profit Summary in xxxx</p>
    <apexchart
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script>
  const income = [20, 25, 30, 35, 15, 24, 56, 30, 35, 15, 24, 56];
  const outcome = [12, 11, 14, 18, 17, 13, 13, 18, 17, 13, 13, 12];
  export default {
    name: "ProfitGraph",
    data() {
      return {
        income,
        outcome,
        profit: [],
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
            data: [28, 29, 33, 36, 32, 32, 45, 33, 36, 32, 32, 33],
          },
        ],
        chartOptions: {
          chart: {
            height: 350,
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
          colors: ["#FFC42E", "#FF0000", "#24BA45"],
          stroke: {
            curve: "straight",
            width: 2,
          },

          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
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
            strokeColors: ["#FFC42E", "#FF0000", "#24BA45"],
            hover: {
              size: 5,
            },
          },
          legend: {
            position: "top",
            horizontalAlign: "right",
            floating: true,
          },
        },
      };
    },
    method: {
      calcProfit(income, outcome) {
        const profit = [];
        const i = 0;
        while (i < income.length) {
          this.profit.push(income[i] - outcome[i]);
        }
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
  p {
    margin: 0 0 0 15px;
    font-size: 14px;
    color: var(--grey-text);
  }
</style>
