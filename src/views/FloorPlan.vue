<template>
  <TablePage>
    <h3>Room Status</h3>
    <div class="menu-bar">
      <div class="menu">
        <p class="menu-name">Building</p>
        <CustomSelect
          type="Transparent"
          :options="buildingOption"
          :style="{ margin: '0' }"
          defaultChoice="1"
          @selection="selectBuilding"
        />
      </div>
      <div class="menu">
        <p class="menu-name">Floor</p>
        <CustomSelect
          type="Transparent"
          :options="floorOption"
          :style="{ margin: '0' }"
          defaultChoice="2"
          @selection="selectFloor"
        />
      </div>
      <div class="menu">
        <p class="menu-name">Date</p>
        <div class="flex x-full">
          <v-date-picker
            v-model="pickedDate"
            :masks="{ input: ['DD/MM/YYYY'] }"
            :model-config="dateConfig"
            mode="single"
            class="flex-grow"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <div :style="{ display: 'flex', flexDirection: 'row' }">
                <input :value="inputValue" v-on="inputEvents" />
                <i class="fa fa-calendar"></i>
              </div>
            </template>
          </v-date-picker>
        </div>
      </div>
    </div>

    <div class="room-label">
      <div class="room-type">
        <i class="fa fa-circle" :style="{ color: '#79D7FF' }" />
        <p>Standard</p>
      </div>
      <div class="room-type">
        <i class="fa fa-circle" :style="{ color: '#FFC979' }" />
        <p>Superior</p>
      </div>
      <div class="room-type">
        <i class="fa fa-circle" :style="{ color: '#FFABAB' }" />
        <p>Deluxe</p>
      </div>
      <div class="room-type">
        <i class="fa fa-circle" :style="{ color: '#95E4A7' }" />
        <p>Suite</p>
      </div>
    </div>

    <div class="inner-container">
      <p class="title">Building: {{ building }} Floor: {{ floor }}</p>
      <RoomPlan :floor="floor" :building="building" />
    </div>
  </TablePage>
</template>

<script>
  import TablePage from "../components/TablePage";
  import CustomSelect from "../components/CustomSelect";
  import RoomPlan from "../components/RoomPlan";

  export default {
    name: "FloorPlan",
    components: { TablePage, CustomSelect, RoomPlan },
    data() {
      return {
        b1Floor: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        b2Floor: [1, 2, 3, 4, 5, 6, 7, 8],
        buildingOption: [1, 2],
        building: 1, // set default to b2Floor
        floorOption: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // set default to b1Floor
        floor: 2,
        pickedDate: null,
        dateConfig: {
          type: "string",
          mask: "YYYY-MM-DD",
        },
      };
    },
    methods: {
      selectBuilding(selectedBuilding) {
        this.building = selectedBuilding;
        console.log("selected B", this.building);
      },
      selectFloor(selectedFloor) {
        this.floor = selectedFloor;
        console.log("selected F", this.floor);
      },
    },
    watch: {
      building: function() {
        if (this.building == 1) {
          this.floorOption = this.b1Floor;
        } else {
          this.floorOption = this.b2Floor;
        }
      },
    },
  };
</script>

<style scoped>
  h3 {
    font-size: 48px;
    margin: 80px 0 35px 0;
  }
  p {
    margin: 0;
  }
  .menu-bar {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  .menu {
    display: flex;
    width: 200px;
  }
  .menu-name {
    font-size: 18px;
    margin: 2px 10px 0 0;
  }
  input {
    width: 120px;
    color: var(--text-color);
    height: 28px;
    padding: 0 0 0 10px;
    border: 1px solid var(--grey-highlight);
    font-size: 16px;
  }
  .fa-calendar {
    color: var(--primary-blue);
    margin: 2px 0 0 -30px;
    padding-right: 240px;
    font-size: 24px;
  }
  .fa-circle {
    font-size: 20px;
    margin-right: 5px;
  }

  .room-label {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  .room-type {
    display: flex;
    margin: 0 10px;
  }
  .inner-container {
    display: flex;
    height: fit-content;
    margin: 20px 0;
    padding: 30px 30px 40px 30px;
    background: white;
  }
  .title {
    align-self: center;
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media (max-width: 750px) {
    .menu-bar {
      align-items: flex-start;
      justify-content: space-between;
    }
    .menu {
      width: fit-content;
      max-width: 200px;
    }
    .menu-name {
      font-size: 14px;
      margin: 5px 2px 0 5px;
    }
    input {
      width: 100px;
      color: var(--text-color);
      height: 28px;
      padding: 0 0 0 10px;
      border: 1px solid var(--grey-highlight);
      font-size: 14px;
    }
    .fa-calendar {
      color: var(--primary-blue);
      margin: 5px 0 0 -25px;
      padding-right: 240px;
      font-size: 20px;
    }
  }
</style>
