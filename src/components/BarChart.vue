<template>
  <div class="chart-container">
    <p>{{ title }}</p>
    <apexchart
      :width="graphWidth"
      :height="graphHeigth"
      type="bar"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
  const month = [
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
  ];

  const monthData = [
    120,
    203,
    302,
    450,
    608,
    900,
    236,
    203,
    607,
    560,
    100,
    103,
  ];

  const room = ["Standard", "Deluxe", "Single", "Suite"];

  const roomData = [140, 100, 350, 220];

  export default {
    name: "BarChart",
    props: ["type"],
    data() {
      return {
        month,
        room,
        roomData,
        monthData,
        title: null,
        graphWidth: 0,
        graphHeigth: 0,
        options: {
          chart: {
            id: "barchart",
          },
          xaxis: {
            categories: null,
          },
          colors: ["var(--primary-blue)"],
        },
        series: null,
      };
    },
    created() {
      if (this.type === "cancel") {
        this.series = [{ name: this.type, data: this.monthData }];
        this.graphWidth = 540;
        this.graphHeigth = 195;
      }
      if (this.type === "guest") {
        this.series = [{ name: this.type, data: this.monthData }];
        this.graphWidth = 475;
        this.graphHeigth = 170;
      }
      if (this.type === "room") {
        this.series = [{ name: this.type, data: this.roomData }];
        this.graphWidth = 300;
        this.graphHeigth = 170;
      }
    },
    mounted() {
      if (this.type === "cancel") {
        this.title = "Number of booking cancelation in year xxxx";
        this.options.xaxis.categories = this.month;
        this.options.colors = "var(--primary-red)";
      }
      if (this.type === "guest") {
        this.title = "Number of guest in year xxxx";
        this.options.xaxis.categories = this.month;
        this.options.colors = "var(--button-blue)";
      }
      if (this.type === "room") {
        this.title = "Room popularity chart for year xxxx";
        this.options.xaxis.categories = this.room;
        this.options.colors = "var(--primary-yellow)";
      }
    },
  };
</script>

<style scoped>
  .chart-container {
    width: fit-content;
    height: fit-content;
    background: white;
    padding: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  p {
    margin-left: 15px;
    font-size: 14px;
    color: var(--grey-text);
  }
</style>
