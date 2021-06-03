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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
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
          {{ detail.roomNumber }}
        </div>
      </div>
    </div>
    <DefaultButton
      @click="goToAddBooking"
      :style="{ margin: '50px auto 0 auto' }"
    >
      Make Booking</DefaultButton
    >
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
const roomStatus = [
  { roomNumber: 1203, type: "Superior", status: 1 },
  { roomNumber: 1202, type: "Superior", status: 0 },
  { roomNumber: 1201, type: "Superior", status: 1 },
  { roomNumber: 1220, type: "Standard", status: 1 },
  { roomNumber: 1219, type: "Standard", status: 1 },
  { roomNumber: 1218, type: "Standard", status: 0 },
  { roomNumber: 1204, type: "Superior", status: 1 },
  { roomNumber: 1217, type: "Standard", status: 0 },
  { roomNumber: 1205, type: "Deluxe", status: 0 },
  { roomNumber: 1223, type: "Standard", status: 1 },
  { roomNumber: 1222, type: "Standard", status: 0 },
  { roomNumber: 1221, type: "Standard", status: 0 },
  { roomNumber: 1216, type: "Suite", status: 1 },
  { roomNumber: 1206, type: "Deluxe", status: 1 },
  { roomNumber: 1224, type: "Deluxe", status: 0 },
  { roomNumber: 1225, type: "Deluxe", status: 0 },
  { roomNumber: 1215, type: "Suite", status: 0 },
  { roomNumber: 1207, type: "Deluxe", status: 1 },
  { roomNumber: 1214, type: "Suite", status: 0 },
  { roomNumber: 1208, type: "Deluxe", status: 0 },
  { roomNumber: 1209, type: "Deluxe", status: 0 },
  { roomNumber: 1210, type: "Deluxe", status: 0 },
  { roomNumber: 1211, type: "Suite", status: 0 },
  { roomNumber: 1212, type: "Suite", status: 0 },
  { roomNumber: 1223, type: "Suite", status: 0 },
];
export default {
  name: "RoomPlan",
  props: ["floor", "building"],
  components: { DefaultButton },
  data() {
    return {
      roomStatus,
    };
  },
  methods: {
    getBgColor(detail) {
      if (detail.type == "Standard") {
        if (detail.status == 0) {
          return "#6A9BA6";
        } else {
          return "#79D7FF";
        }
      } else if (detail.type == "Superior") {
        if (detail.status == 0) {
          return "#AA986B";
        } else {
          return "#FFC42E";
        }
      } else if (detail.type == "Deluxe") {
        if (detail.status == 0) {
          return "#AE7C7C";
        } else {
          return "#FFABAB";
        }
      } else if (detail.type == "Suite") {
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
