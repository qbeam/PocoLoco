<template>
  <TablePage>
    <h3>
      Hotel Rooms
      <p class="countQuery">({{ countRow }})</p>
    </h3>
    <div class="menu-bar">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input
          v-model="search"
          class="search-field"
          type="text"
          placeholder="search"
          :style="{ marginBottom: '0' }"
        />
      </div>
      <CustomSelect
        type="Filter"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />

      <DefaultButton
        @click="searchData"
        type="small"
        :style="width < 650 ? { width: '70px' } : {}"
      >
        Search
      </DefaultButton>
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="room_db.length !== 0">
      <tr>
        <th v-for="(colName, i) in colNames" :key="i">
          <div class="tb-head">
            {{ colName }}
            <SortingArrow
              :active="activeArrow == i ? true : false"
              @click="setActiveArrow(i)"
              @sortReturn="sortReturn"
            />
          </div>
        </th>

        <th v-if="role == 'Owner' || role == 'Admin' || role == 'Manager'">Edit</th>
      </tr>

      <tr
        v-for="(room, i) in room_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ room.roomID }}</td>
        <td>{{ room.roomType }}</td>
        <td>{{ room.roomPrice }}</td>
        <td>{{ room.capacity }}</td>
        <td>{{ room.size }}</td>
        <td v-if="role == 'Owner' || role == 'Admin' || role == 'Manager'">
          <div class="manage">
            <button class="manage-button" @click="getRoomDataEdit(room)">
              <i class="fa fa-pencil fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(room_db.length / tableRow)"
      :paginationVisible="room_db.length > tableRow"
      @pageReturn="pageReturn"
      :style="
        width <= 1000
          ? {
              position: 'fixed',
              bottom: '50px',
              margin: '0 auto',
              right: '0',
              left: '60px',
            }
          : {
              position: 'fixed',
              bottom: '50px',
              margin: '0 auto',
              right: '0',
              left: '200px',
            }
      "
    />

    <Popup
      v-bind:visible="editVisible"
      @popReturn="editReturn"
      @submit="submit"
      :buttons="true"
    >
      <h4>Room Type</h4>
      <select v-model="form.roomType">
        <option :value="roomType" selected disabled hidden>{{
          form.roomType
        }}</option>
        <option
          v-for="(type, index) in type_db"
          :key="index"
          :value="type.roomType"
          :selected="type == form.roomType ? 'selected' : null"
        >
          {{ type.roomType }}
        </option>
      </select>

      <div class="input-group">
        <div class="group-item">
          <h4>Room Price</h4>
          <div class="input-group">
            <input v-model="form.roomPrice" />
            <p :style="{ marginLeft: '10px' }">Baht</p>
          </div>
        </div>
        <div>
          <h4>Capacity</h4>
          <input
            type="number"
            v-model="form.capacity"
            :placeholder="capacity"
            :style="{ width: '50px' }"
          />
        </div>
      </div>
    </Popup>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage.vue";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import AddButton from "../components/AddButton.vue";
import Popup from "../components/Popup.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SearchError from "../components/SearchError";
import axios from "axios";
import SortingArrow from "../components/SortingArrow";

const selectOption = ["Room No.", "Room Type", "Room Price"];
const colNames = ["Room Number", "Room Type", "Price", "Capacity", "Size"];

export default {
  name: "Promotion",
  components: {
    TablePage,
    DefaultButton,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      colNames,
      activeArrow: 0, // sort by which column
      sortDirection: "down", // direction of currently active arrow
      currentPage: 1,
      editVisible: false,
      errorSearching: false,
      selectOption,
      room_db: "",
      type_db: "",
      search: "",
      sort: "roomID",
      filter: "roomID",
      check: false,
      countRow: "",
      role: "",
      departmenrName: "",
      form: {
        roomID: "",
        roomTypeID: "",
        roomType: "",
        roomPrice: "",
        capacity: "",
        size: "",
      },
    };
  },
  created() {
    this.role = this.$store.state.employeeDetail.role;
    this.departmentName = this.$store.state.employeeDetail.department;
    this.getAllRoom();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    editReturn(value) {
      this.editVisible = value;
    },
    submit(value) {
      this.editVisible = value;
      this.updateData();
    },
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
      this.setSort(clickedArrow);
      this.searchData();
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    setSort(click) {
      if (click == 0) {
        this.sort = "roomID";
      } else if (click == 1) {
        this.sort = "roomType";
      } else if (click == 2) {
        this.sort = "roomPrice";
      } else if (click == 3) {
        this.sort = "capacity";
      } else if (click == 4) {
        this.sort = "size";
      }
    },
    getAllRoom() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_room.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.room_db = res.data;
            this.countRow = this.room_db.length;
          }.bind(this)
        );
    },

    getRoomType() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_room.php", {
          action: "getRoomType",
        })
        .then(
          function(res) {
            this.type_db = res.data;
          }.bind(this)
        );
    },

    getRoomDataEdit(room) {
      this.getRoomType();
      this.editVisible = !this.editVisible;
      this.form.roomID = room.roomID;
      this.form.roomType = room.roomType;
      this.form.roomPrice = room.roomPrice;
      this.form.capacity = room.capacity;
    },

    updateData() {
      this.check =
        this.form.roomType != "" &&
        this.form.roomPrice != "" &&
        this.form.capacity != "";

      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_room.php", {
            action: "updateData",
            roomID: this.form.roomID,
            roomType: this.form.roomType,
            roomPrice: this.form.roomPrice,
            capacity: this.form.capacity,
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.resetData();
              this.getAllRoom();
            }.bind(this)
          );
      }
    },
    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_room.php", {
          action: "searchData",
          search: this.search,
          sort: this.sort,
          filter: this.filter,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.room_db = res.data;
            this.countRow = this.room_db.length;
            if (this.room_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },
    resetData() {
      this.form.roomID = "";
      this.form.roomType = "";
      this.form.roomPrice = "";
      this.form.capacity = "";
      this.form.size = "";
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "roomID";
      }
      if (value === selectOption[1]) {
        this.filter = "roomType";
      }
      if (value === selectOption[2]) {
        this.filter = "roomPrice";
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
.countQuery {
  display: inline-block;
  font-size: 25px;
}
h4 {
  font-size: 20px;
  margin-bottom: 5px;
}
.icon-wrap {
  position: absolute;
  z-index: 0;
  padding: 5px 20px;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 45px;
  font-size: 16px;
  outline: none;
  z-index: 1;
  border: none;
  border-radius: 50px;
  margin-right: 20px;
}
i {
  color: #5f5f5f;
}
.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
}
table {
  width: 100%;
  max-width: 1000;
  margin-top: 50px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  z-index: 0;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.fa-pencil:hover {
  color: var(--primary-blue);
}
.fa-calendar {
  color: var(--primary-blue);
  margin: 3px 0 0 -35px;
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
p {
  margin-bottom: 10px;
  font-size: 18px;
}
input {
  width: 120px;
  height: 35px;
  padding: 0 10px;
  margin-bottom: 20px;
  color: var(--header-color);
}
.input-group {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.group-item {
  width: 70%;
  display: flex;
  flex-direction: column;
}
select {
  width: 180px;
  height: 35px;
  margin-bottom: 20px;
}
th {
  height: 35px;
  text-align: center;
  background-color: #eeeeee;
  border-bottom: 1px solid black;
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
}
td {
  width: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 35px;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
*:focus {
  outline: 0;
}
@media (max-width: 1000px) {
  .search-field {
    width: 180px;
  }
  .vl {
    margin: 0 5px;
  }
  h4 {
    font-size: 16px;
  }
  p {
    font-size: 16px;
  }
  .subscript-text {
    font-size: 12px;
    margin-top: 5px;
  }
  .rank {
    width: 40px;
    height: 40px;
    margin: 12px 15px 0 0;
    font-size: 16px;
  }
}
@media (max-width: 700px) {
  th {
    font-size: 14px;
  }
  td {
    font-size: 14px;
  }
  .search-field {
    width: 150px;
    font-size: 16px;
  }
  h3 {
    margin: 40px 0 20px 0;
  }
  h4 {
    font-size: 14px;
  }
  p {
    font-size: 14px;
  }
  .rank {
    width: 35px;
    height: 35px;
    margin: 10px 15px 0 0;
    font-size: 14px;
  }
  select {
    width: 140px;
  }
  .fa-pencil {
    font-size: 20px;
  }
}
</style>
