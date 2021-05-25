<template>
  <div class="chart-container">
    <p>Room service</p>
    <apexchart type="pie" width="300" :options="options" :series="series" />
  </div>
</template>

<script>
  export default {
    name: "PieChart",
    data() {
      return {
        series: [44, 55, 13, 13],
        options: {
          chart: {
            width: 380,
            type: "pie",
          },
          labels: ["Apple", "Mango", "Orange", "Watermelon"],
        },
      };
    },
  };
</script>

<style scoped>
  .chart-container {
    width: 46.5%;
    height: fit-content;
    background: white;
    padding: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 750px) {
    .chart-container {
      width: 95%;
      margin: 10px auto;
    }
  }
</style>
