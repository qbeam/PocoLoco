<template>
  <TablePage>
    <h3>
      Promotions
      <p class="countQuery">({{ countRow }})</p>
    </h3>
    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search fa-1x"
          :style="{ position: 'absolute', zIndex: 5, marginLeft: '15px' }"
        />
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
      <DefaultButton @click="searchData()" type="small">
        Search
      </DefaultButton>
      <AddButton
        v-if="role === 'Admin' || role === 'Owner' || role === 'Manager'"
        :style="
          width < 800
            ? { position: 'fixed', right: '20px', top: '50px' }
            : { position: 'fixed', right: '60px', top: '150px' }
        "
        @click="goToAddPromotion()"
      />
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="!errorSearching" style="margin-top: 50px;">
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
        <th v-if="role != 'Receptionist'">Manage</th>
      </tr>

      <tr
        v-for="(promotion, i) in promotion_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ promotion.promotionName }}</td>
        <td>{{ promotion.seasonName }}</td>
        <td>{{ promotion.roomType }}</td>
        <td>{{ promotion.discount }}%</td>
        <td>{{ convertDate(promotion.startDate) }}</td>
        <td>{{ convertDate(promotion.endDate) }}</td>
        <td v-if="role != 'Receptionist'">
          <div class="manage">
            <button
              class="manage-button"
              @click="getPromotionEdit('edit', promotion)"
            >
              <i class="fa fa-pencil fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button @click="deleteData(promotion)" class="manage-button">
              <i class="fa fa-trash fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(promotion_db.length / tableRow)"
      :paginationVisible="promotion_db.length > tableRow"
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

    <!--Edit-->
    <Popup
      v-bind:visible="editVisible"
      @popReturn="editReturn"
      @submit="submit"
      :buttons="true"
    >
      <div class="input-group">
        <!-- Season Name -->
        <div class="group-item">
          <h4>Season Name</h4>
          <select v-model="form.season">
            <option :value="season" selected disabled hidden>{{
              form.season
            }}</option>
            <option
              v-for="(season, index) in season_db"
              :key="index"
              :value="season.seasonName"
              :selected="option == season.seasonName ? 'selected' : null"
            >
              {{ season.seasonName }}
            </option>
          </select>
        </div>
        <!-- Room Type -->
        <div class="input-group">
          <div class="group-item">
            <h4>Room Type</h4>
            <select>
              <option :value="form.roomType" selected disabled hidden>
                {{ form.roomType }}
              </option>
              <option
                v-for="(room, index) in roomtype_db"
                :key="index"
                :value="room.roomType"
                :selected="room == room.roomType ? 'selected' : null"
              >
                {{ room.roomType }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <!-- Promotion Name -->
      <h4>Promotion Name</h4>
      <input
        type="text"
        v-model="form.promotion"
        :placeholder="promoName"
        :style="{ width: '95%' }"
      />

      <div class="input-group">
        <!-- Start Date -->
        <div class="group-item">
          <h4>Start Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.startDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="startDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input
                    :value="inputValue"
                    v-on="inputEvents"
                    :placeholder="promoStart"
                    :style="{ width: '120px', marginRight: '0' }"
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
        <!-- End Date -->
        <div class="group-item">
          <h4>End Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.endDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="endDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input
                    :value="inputValue"
                    v-on="inputEvents"
                    :style="{ width: '120px', marginRight: '0' }"
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
      </div>
      <!-- Discount -->
      <h4>Discount</h4>
      <input v-model="form.discount" type="text" :placeholder="discount" />
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
import SortingArrow from "../components/SortingArrow";
import axios from "axios";

const selectOption = [
  "Promotion",
  "Season",
  "Room Type",
  "Discount",
  "Start Date",
  "End Date",
];

const colNames = [
  "Promotion Name",
  "Season",
  "Room Type",
  "Discount",
  "Start Date",
  "End Date",
];

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
      selectOption,
      colNames,
      currentPage: 1,
      editVisible: false,
      errorSearching: false,
      sortDirection: "down",
      sort: "promotionName",
      filter: "promotionName",
      search: "",
      promotion_db: "",
      season_db: "",
      roomtype_db: "",
      check: false,
      countRow: "",
      role: "",
      departmentName: "",
      form: {
        promotionID: "",
        season: "",
        promotion: "",
        roomType: "",
        discount: "",
        startDate: "",
        endDate: "",
        isEdit: false,
      },

      startDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      endDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      role: "",
    };
  },
  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userDepartment") !== "Receptionist"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.role = localStorage.getItem("userRole");
      this.departmentName = localStorage.getItem("userDepartment");
      this.getPromotion();
    }
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
        this.sort = "promotionName";
      } else if (click == 1) {
        this.sort = "seasonName";
      } else if (click == 2) {
        this.sort = "roomType";
      } else if (click == 3) {
        this.sort = "discount";
      } else if (click == 4) {
        this.sort = "startDate";
      } else if (click == 5) {
        this.sort = "endDate";
      }
    },

    getPromotion() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
          action: "getPromotion",
        })
        .then(
          function(res) {
            this.promotion_db = res.data;
            this.countRow = this.promotion_db.length;
          }.bind(this)
        );
    },
    getSeason() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
          action: "getSeason",
        })
        .then(
          function(res) {
            this.season_db = res.data;
          }.bind(this)
        );
    },
    getPromotionEdit(type, promotion) {
      if (type === "edit") {
        this.editVisible = !this.editVisible;
        this.form.isEdit = true;
      }
      this.getRoomType();
      this.getSeason();

      this.form.promotionID = promotion.promotionID;
      this.form.season = promotion.seasonName;
      this.form.promotion = promotion.promotionName;
      this.form.roomType = promotion.roomType;
      this.form.discount = promotion.discount;
      this.form.startDate = promotion.startDate;
      this.form.endDate = promotion.endDate;
    },

    getRoomType() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
          action: "getRoomType",
        })
        .then(
          function(res) {
            this.roomtype_db = res.data;
          }.bind(this)
        );
    },
    searchData() {
      if (this.filter == "startDate" || this.filter == "endDate") {
        this.searchSent = this.converDateToQuery(this.search);
      } else {
        this.searchSent = this.search;
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
          action: "searchData",
          search: this.searchSent,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.promotion_db = res.data;
            this.countRow = this.promotion_db.length;
            if (this.promotion_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },
    goToAddPromotion() {
      this.$router.push("/AddPromo");
    },
    updateData() {
      this.validate();

      if (this.check && this.form.isEdit) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
            action: "updateData",
            promotionID: this.form.promotionID,
            promotion: this.form.promotion,
            season: this.form.season,
            roomType: this.form.roomType,
            startDate: this.form.startDate,
            endDate: this.form.endDate,
            discount: this.form.discount,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.resetData();
                this.getPromotion();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },
    deleteData(promotion) {
      if (
        confirm(
          "Do you want to delete promotion '" + promotion.promotionName + "' ?"
        )
      ) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_promotion.php", {
            action: "deleteData",
            promotionID: promotion.promotionID,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.getPromotion();
              }
            }.bind(this)
          );
      }
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "promotionName";
      }
      if (value === selectOption[1]) {
        this.filter = "seasonName";
      }
      if (value === selectOption[2]) {
        this.filter = "roomType";
      }
      if (value === selectOption[3]) {
        this.filter = "discount";
      }
      if (value === selectOption[4]) {
        this.filter = "startDate";
      }
      if (value === selectOption[5]) {
        this.filter = "endDate";
      }
    },
    validate() {
      this.check =
        this.form.season != "" &&
        this.form.promotion != "" &&
        this.form.roomType != "" &&
        this.form.discount != "" &&
        this.form.startDate != "" &&
        this.form.endDate != "";
    },

    resetData() {
      this.form.promotionID = "";
      this.form.season = "";
      this.form.promotion = "";
      this.form.roomType = "";
      this.form.discount = "";
      this.form.startDate = "";
      this.form.endDate = "";
    },

    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    converDateToQuery(date) {
      var datearray = date.split("/");
      if (datearray.length != 3 || date.length != 10) {
        alert("Date format should be dd/mm/yyyy");
      }
      var newdate = datearray[2] + "-" + datearray[1] + "-" + datearray[0];
      return newdate;
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
.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search-container {
  display: flex;
  align-items: center;
  position: relative;
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
.fa-search {
  z-index: 5;
  position: absolute;
  margin-left: 15px;
}
i {
  color: #5f5f5f;
}

table {
  width: 100%;
  margin-top: 30px;
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
.vl {
  border-left: 3px solid #eeeeee;
  height: 25px;
  margin: 0 5px;
}
.fa-pencil:hover,
.fa-trash:hover {
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
  width: 100%;
  display: flex;
  flex-direction: column;
}
select {
  width: 180px;
  height: 35px;
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
  .menu-bar {
    margin-top: 25px;
  }
  table {
    font-size: 10px;
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
  .fa-pencil,
  .fa-trash {
    font-size: 20px;
  }
  .vl {
    margin: 0 1px;
  }
  @media (max-width: 550px) {
    table {
      font-size: 8px;
    }
  }
}
</style>
