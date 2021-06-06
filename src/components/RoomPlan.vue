<template>
  <div>
    <div class="map">
      <div class="long-row">
        <div
          class="big"
          v-for="(detail, i) in roomStatus.slice(0, 1)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(1, 3)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="elevator">E</div>
        <div class="elevator">E</div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(3, 5)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div
          class="big"
          v-for="(detail, i) in roomStatus.slice(5, 6)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>

      <div class="opposite">
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(6, 7)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="walkway"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(7, 8)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>

      <div class="center">
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(8, 9)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="path"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(9, 12)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="path"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(12, 13)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>

      <div class="center">
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(13, 14)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="path"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(14, 16)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="small" :style="{ background: '#9C9C9C' }"></div>
        <div class="path"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(16, 17)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>

      <div class="opposite">
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(17, 18)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="walkway"></div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(18, 19)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>

      <div class="long-row">
        <div
          class="big"
          v-for="(detail, i) in roomStatus.slice(19, 20)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(20, 22)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div class="elevator">E</div>
        <div class="elevator">E</div>
        <div
          class="small"
          v-for="(detail, i) in roomStatus.slice(22, 24)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
        <div
          class="big"
          v-for="(detail, i) in roomStatus.slice(24, 25)"
          :key="i"
          :style="{
            background: getBgColor(detail),
            cursor: getCursor(detail.status),
          }"
        >
          {{ detail.roomID }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import axios from "axios";

export default {
  name: "RoomPlan",
  props: ["floor", "building", "date"],
  components: { DefaultButton },
  data() {
    return {
      roomStatus: "",
    };
  },
  created() {
    this.getRoomNumber();
  },
  watch: {
    building: function() {
      this.getRoomNumber();
    },
    floor: function() {
      this.getRoomNumber();
    },
    date: function() {
      this.getRoomNumber();
    },
  },
  methods: {
    getRoomNumber() {
      
      axios
        .post("http://localhost:8080/PocoLoco_db/api_floorPlan.php", {
          action: "getRoomNumber",
          building: this.building,
          floor: this.floor,
          date: this.date,
        })
        .then(
          function(res) {
            const arrangedRooms = this.arrangeHotelRoom(res.data);
            this.roomStatus = arrangedRooms;
          }.bind(this)
        );
    },
    arrangeHotelRoom(allRoom) {
      const roomOrder = [
        "03",
        "02",
        "01",
        "20",
        "19",
        "18",
        "04",
        "17",
        "05",
        "23",
        "22",
        "21",
        "16",
        "06",
        "24",
        "25",
        "15",
        "07",
        "14",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
      ];

      const arrangedRoom = [];
      for (let i = 0; i < 25; i++) {
        const target = roomOrder[i];
        for (let j = 0; j < 25; j++) {
          const record = allRoom[j].roomID.slice(2);
          if (target == record) {
            arrangedRoom.push(allRoom[j]);
          }
        }
      }
      return arrangedRoom;
    },
    getBgColor(detail) {
      if (detail.roomType == "Standard") {
        if (detail.status == 0) {
          return "#6A9BA6";
        } else {
          return "#79D7FF";
        }
      } else if (detail.roomType == "Superior") {
        if (detail.status == 0) {
          return "#AA986B";
        } else {
          return "#FFC42E";
        }
      } else if (detail.roomType == "Deluxe") {
        if (detail.status == 0) {
          return "#AE7C7C";
        } else {
          return "#FFABAB";
        }
      } else if (detail.roomType == "Suite") {
        if (detail.status == 0) {
          return "#6E9E79";
        } else {
          return "#95E4A7";
        }
      }
    },
    getCursor(status) {
      if (status == 0) {
        return "not-allowed";
      } else {
        return "default";
      }
    },
    goToAddBooking() {
      this.$router.push("/AddBooking");
    },
  },
};
</script>

<style scoped>
.map {
  display: flex;
  background: var(--light-grey);
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  align-self: center;
}
.long-row {
  display: flex;
  width: 100%;
  justify-content: center;
}
.big {
  display: flex;
  width: 23%;
  height: 50px;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
}
.small {
  display: flex;
  width: 12%;
  height: 50px;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
}
.elevator {
  display: flex;
  width: 5%;
  background: #d8d4d4;
  border: 1px solid black;
  justify-content: center;
  align-items: center;
}
.opposite {
  display: flex;
  justify-content: center;
}
.walkway {
  display: flex;
  width: 80%;
}
.center {
  display: flex;
}
.path {
  display: flex;
  width: 21.5%;
}
</style>
