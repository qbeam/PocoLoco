<template>
  <TablePage>
    <h3>Room Status</h3>
    <div class="menu-bar">
      <div class="menu-group">
        <div class="menu">
          <p class="menu-name">Building</p>
          <CustomSelect
            type="Transparent"
            :options="buildingOption"
            :style="{ margin: '0' }"
            @selection="selectBuilding"
          />
        </div>
        <div class="menu">
          <p class="menu-name">Floor</p>
          <CustomSelect
            type="Transparent"
            :options="floorOption"
            :style="{ margin: '0' }"
            @selection="selectFloor"
          />
        </div>
      </div>
      <div class="menu-item">
        <div class="search-container">
          <i class="fa fa-search fa-1x"></i>

          <input
            v-model="search"
            class="search-field"
            type="text"
            placeholder="search"
            :style="{ marginBottom: '0' }"
          />
        </div>
        <!--<div>
          <span class="icon-wrap">
            <i class="fa fa-search fa-1x"></i>
          </span>

          <input
            class="search-field"
            type="text"
            placeholder="search"
            v-model="search"
          />
        </div>-->
      </div>
    </div>

    <div class="room-label">
      <div class="room-type">
        <div class="dot"></div>
        <p>Standard</p>
      </div>
      <div class="room-type">
        <div class="dot" :style="{ background: '#FFC979' }"></div>
        <p>Superior</p>
      </div>
      <div class="room-type">
        <div class="dot" :style="{ background: '#FFABAB' }"></div>
        <p>Deluxe</p>
      </div>
      <div class="room-type">
        <div class="dot" :style="{ background: '#95E4A7' }"></div>
        <p>Suite</p>
      </div>
    </div>

    <div class="inner-container">
      <RoomPlan :floor="floor" />
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
  .menu-group {
    display: flex;
    width: 50%;
  }
  .menu {
    display: flex;
    width: 50%;
  }
  .menu-name {
    font-size: 18px;
    margin-right: 10px;
  }
  .menu-item {
    display: flex;
  }
  .search-container {
    position: relative;
    display: flex;
  }
  .icon-wrap {
    position: absolute;
    z-index: 0;
    padding: 5px 20px;
  }
  .search-field {
    width: 250px;
    height: 30px;
    padding-left: 45px;
    font-size: 18px;
    outline: none;
    z-index: 1;
    border: none;
    border-radius: 50px;
    margin-left: 5px;
    color: #5f5f5f;
  }
  i {
    color: #5f5f5f;
  }
  .fa-search {
    position: absolute;
    z-index: 5;
    margin: 7px 20px;
    font-size: 16px;
  }
  .room-label {
    display: flex;
    justify-content: center;
  }
  .room-type {
    display: flex;
    margin: 0 10px;
  }
  .dot {
    width: 15px;
    height: 15px;
    background: #79d7ff;
    border-radius: 50px;
    margin: 3px;
  }
  .inner-container {
    display: flex;
    height: 100%;
    margin: 20px 0;
    padding: 35px 30px;
    background: white;
    justify-content: center;
  }
  @media (max-width: 1300px) {
    .menu-group {
      display: flex;
      width: 70%;
    }
  }
  @media (max-width: 750px) {
    .menu-bar {
      display: flex;
      flex-direction: column;
    }
    .menu-group {
      display: flex;
      width: 100%;
    }
    .icon-wrap {
      padding: 30px 20px;
    }
    .search-field {
      width: 250px;
      margin: 25px 0;
    }
    .menu-item {
      width: 100%;
    }
    .fa-search {
      margin: 32px 15px;
    }
  }
</style>
