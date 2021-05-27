<template>
  <div
    class="chart-container"
    :style="
      type == 'cancel'
        ? { width: customWidth, height: '255px' }
        : { width: customWidth }
    "
  >
    <div class="header">
      <div class="title">
        <p>{{ title }}</p>
        <CustomSelect
          v-if="type !== 'room' || width >= 1200"
          type="Transparent"
          :options="searchRange"
          @selection="graphRange"
          :style="{ margin: '5px 0 0 10px' }"
        />
      </div>

      <div v-if="type === 'room' && width < 1200" class="sub-title">
        <p>in</p>
        <CustomSelect
          type="Transparent"
          :options="searchRange"
          @selection="graphRange"
          :style="{ margin: '5px 0 0 10px' }"
        />
      </div>
    </div>
    <apexchart
      :width="
        width > 560
          ? type == 'room'
            ? '100%'
            : '150%'
          : type == 'room'
          ? '200'
          : '340'
      "
      :height="graphHeigth"
      type="bar"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
  import { useScreenWidth } from "../composables/useScreenWidth";
  import CustomSelect from "../components/CustomSelect";

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
    components: { CustomSelect },
    setup() {
      const { width } = useScreenWidth();
      return { width };
    },
    data() {
      return {
        month,
        room,
        roomData,
        monthData,
        searchRange: [2021, 2020, 2019, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        displayRange: null,
        customWidth: "65%",
        title: null,
        graphHeigth: 0,
        options: {
          chart: {
            id: "barchart",
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: null,
          },
          colors: ["var(--primary-blue)"],
        },
        series: null,
      };
    },
    methods: {
      setContainerWidth() {
        if (this.type === "cancel") {
          if (this.width > 750) {
            this.customWidth = "66%";
          } else {
            this.customWidth = "96%";
          }
        } else if (this.type === "guest") {
          if (this.width > 750) {
            this.customWidth = "65%";
          } else {
            this.customWidth = "96%";
          }
        } else if (this.type === "room") {
          if (this.width >= 1200) {
            this.title = "Room reservation in";
          } else {
            this.title = "Room reservation";
          }
          if (this.width > 750) {
            this.customWidth = "100%";
          } else {
            this.customWidth = "50%";
          }
        }
      },
      graphRange(value) {
        this.displayRange = value;
      },
    },
    created() {
      if (this.type === "cancel") {
        this.series = [{ name: this.type, data: this.monthData }];
        this.graphHeigth = 195;
      } else if (this.type === "guest") {
        this.series = [{ name: this.type, data: this.monthData }];
        this.graphHeigth = 170;
      } else if (this.type === "room") {
        this.series = [{ name: this.type, data: this.roomData }];
        this.graphHeigth = 170;
      }
      this.setContainerWidth();
    },
    mounted() {
      if (this.type === "cancel") {
        this.title = "Number of booking cancelation in";
        this.options.xaxis.categories = this.month;
        this.options.colors = "var(--primary-red)";
      } else if (this.type === "guest") {
        this.title = "Number of guest in";
        this.options.xaxis.categories = this.month;
        this.options.colors = "var(--button-blue)";
      } else if (this.type === "room") {
        if (this.width >= 1200) {
          this.title = "Room reservation in";
        } else {
          this.title = "Room reservation";
        }
        this.options.xaxis.categories = this.room;
        this.options.colors = "var(--primary-yellow)";
      }
    },
    watch: {
      width: function() {
        this.setContainerWidth();
      },
    },
  };
</script>

<style scoped>
  .chart-container {
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
    flex-direction: column;
  }
  .title {
    display: flex;
    margin-bottom: 0;
  }
  .sub-title {
    display: flex;
    margin-top: -15px;
  }
  p {
    margin: 10px 0 10px 15px;
    font-size: 16px;
    color: var(--grey-text);
  }
  /*@media (max-width: 750px) {
    .chart-container {
      margin: 5px auto;
    }
  }*/
</style>
