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
import { useScreenWidth } from "../../composables/useScreenWidth";
import CustomSelect from "../CustomSelect";
import axios from "axios";
import Mixins from "../../Mixins";

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

const room = ["Deluxe", "Standard", "Suite", "Superior"];

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
      month, // month names
      room, // room types
      roomData,
      searchRange: [], // choice of graph year
      displayRange: null, // selected year of graph
      customWidth: "65%",
      title: null, // graph title
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
      series: "",
    };
  },
  created() {
    this.setUpGraph();
    if (this.type === "cancel") {
      this.graphHeigth = 195;
    } else if (this.type === "guest") {
      this.graphHeigth = 170;
    } else if (this.type === "room") {
      this.graphHeigth = 170;
    }
    this.setContainerWidth();
  },
  mounted() {
    // set graph title, x-axis label and bar color
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
      this.setContainerWidth(); // responsive graph container
    },
    displayRange: function() {
      this.getRecord();
    },
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
      this.displayRange = value; // set graph year to selected choice
      this.getRecord();
    },
    setUpGraph() {
      this.searchRange = Mixins.methods.getPastYears(5); // set year choice up to past 5 years
      this.getRecord(); // get record for graph
    },
    getAction(type) {
      if (type === "cancel") {
        return "getCancel";
      } else if (type === "guest") {
        return "getGuest";
      } else if (type === "room") {
        return "getRoomReservation";
      }
    },
    getRecord() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: this.getAction(this.type),
          year: this.displayRange,
        })
        .then(
          function(res) {
            if (this.type !== "room") {
              this.setMonthSeries(res.data);
            } else {
              if (res.data != null) {
                this.setRoomSeries(res.data);
              } else {
                this.series = [
                  { name: this.type, data: [null, null, null, null] },
                ];
              }
            }
          }.bind(this)
        );
    },
    setMonthSeries(data) {
      const tmp = [
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
        tmp[month - 1] = Number(data[i].num);
      }
      this.series = [{ name: this.type, data: tmp }]; // set series to response from query
    },
    setRoomSeries(data) {
      const count = [];
      for (let i = 0; i < data.length; i++) {
        count.push(data[i].num);
      }
      this.series = [{ name: this.type, data: count }];
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
</style>
