<template>
  <TablePage>
    <h3>
      Booking Detail
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
        />
      </div>
      <CustomSelect
        type="Filter"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />
      <DefaultButton @click="searchData" type="small">Search</DefaultButton>
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="booking_db.length !== 0">
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
        <th>Manage</th>
      </tr>

      <tr
        v-for="(booking, i) in booking_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ booking.bookingDetailID }}</td>
        <td>{{ booking.roomID }}</td>
        <td>
          {{ booking.guestFirstName }}
          {{ booking.guestLastName }}
        </td>
        <td>{{ convertDate(booking.checkIn) }}</td>
        <td>{{ convertDate(booking.checkOut) }}</td>
        <td>
          <i
                v-if="booking.status == 'Check In'"
                class="fa fa-circle"
                :style="{ color: '#24BA45'  }"
              />
              <i
                v-if="booking.status == 'Reserve'"
                class="fa fa-circle"
                :style="{ color: '#ffc42e' }"
              />
              <i
                v-if="booking.status == 'Cancel'"
                class="fa fa-circle"
                :style="{ color: '#e11818' }"
              />
              <i
                v-if="booking.status == 'Check Out'"
                class="fa fa-circle"
                :style="{ color: '#BDBDBD' }"
              />
          {{ booking.status }}
          </td>
        <td>
          <div v-if="booking.status == 'Check Out'" class="manage">
            <button
                class="manage-button"
                @click="searchDetail()"
              >
                <i class="fa fa-search fa-2x"></i>
              </button>
          </div>
          <div v-if="booking.status != 'Check Out'" class="manage">
            <button
                class="manage-button"
                @click="searchDetail()"
              >
                <i class="fa fa-search fa-2x"></i>
              </button>
            <div class="vl"></div>
            <button class="manage-button" @click="getBookingDetail(booking)">
              <i class="fa fa-pencil fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(booking_db.length / tableRow)"
      :paginationVisible="booking_db.length > tableRow"
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

    <Popup :visible="searchVisible" @popReturn="popReturn">
      <div class="popup-head1">Booking ID: 1000032</div>
    <div class="popup-head">
      <div>Name: Ying supavadeeeeeeeeeeee</div>
      <div>Phone: 0985468485</div>
    </div>
    <div class="group-row">
      <div class="group-item">
        <p><b>Booking Detail ID: </b>2011544</p>
        <p><b>Guest Name: </b>Ying supeeek</p>
        <p><b>Room Number: </b>1215</p>
        <p><b>Check IN: </b>15/12/1233</p>
        <p><b>Status: </b>
        <i
                v-if="true"
                class="fa fa-circle"
                :style="{ color: '#24BA45' }"
              /> 
              <i
                v-if="false"
                class="fa fa-circle"
                :style="{ color: '#FFC42E' }"
              /> 
              <i
                v-if="false"
                class="fa fa-circle"
                :style="{ color: '#FF0000' }"
              /> 
              Check IN</p>
      </div>
      <div class="group-item">
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p><b>Room Type: </b>Suite</p>
        <p><b>Check OUT: </b> 12/1/1234</p>
        <p><b>Total: </b>2500 Bath</p>
      </div>
    </div>
    </Popup>

    <Popup
      :visible="visible"
      :buttons="true"
      @popReturn="popReturn"
      @submit="updateData"
    >
      <div class="group-row">
        <div class="group-item">
          <p>Guest Name</p>
          <input
            type="text"
            v-model="form.guestFirstName"
            :placeholder="firstname"
          />
        </div>

        <div class="group-item">
          <p>Last Name</p>
          <input
            type="text"
            v-model="form.guestLastName"
            :placeholder="lastname"
          />
        </div>
      </div>

      <div class="group-row">
        <div class="group-item">
          <p>Check In</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.checkIn"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="checkInDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input :value="inputValue" v-on="inputEvents" />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
        <div class="group-item">
          <p>Check Out</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.checkOut"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="checkOutDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input :value="inputValue" v-on="inputEvents" />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
      </div>

      <div>
        <p>Status</p>
        <div class="choices">
          <label class="container1">
            Reserve
            <input type="radio" value="Reserve" v-model="form.status" />
            <span class="checkmark"></span>
          </label>
          <label class="container2"
            >Check In
            <input type="radio" value="Check In" v-model="form.status" />
            <span class="checkmark"></span>
          </label>
          <label class="container3"
            >Cancel
            <input type="radio" value="Cancel" v-model="form.status" />
            <span class="checkmark"></span>
          </label>
        </div>
      </div>
    </Popup>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import AddButton from "../components/AddButton.vue";
import Popup from "../components/Popup.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SortingArrow from "../components/SortingArrow";
import SearchError from "../components/SearchError";
import axios from "axios";

const selectOption = [
  "Detail ID",
  "Room No.",
  "Name",
  "Check In",
  "Check Out",
  "Status",
];

const colNames = [
  "Booking Detail ID",
  "Room Number",
  "Guest Name",
  "Check In",
  "Check Out",
  "Status",
];

export default {
  name: "BooikingDatail",
  components: {
    DefaultButton,
    TablePage,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SortingArrow,
    SearchError,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      currentPage: 1,
      visible: false,
      searchVisible: false,
      checkInDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      checkOutDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      activeArrow: 0,
      errorSearching: false,
      sortDirection: "down",
      selectOption,
      colNames,
      search: "",
      booking_db: "",
      check: false,
      filter: "bookingDetailID",
      sort: "bookingDetailID",
      countRow: "",
      form: {
        bookingDetailID: "",
        guestFirstName: "",
        guestLastName: "",
        checkIn: "",
        checkOut: "",
        status: "",
        isEdit: false,
      },
    };
  },

  created() {
    this.getallBookingDetail();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.visible = value;
      this.searchVisible = value;
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
        this.sort = "bookingDetailID";
      } else if (click == 1) {
        this.sort = "roomID";
      } else if (click == 2) {
        this.sort = "guestFirstName";
      } else if (click == 3) {
        this.sort = "checkIn";
      } else if (click == 4) {
        this.sort = "checkOut";
      } else if (click == 5) {
        this.sort = "status";
      }
    },
    searchDetail() {
      this.searchVisible = !this.searchVisible;
    },
    getallBookingDetail() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_bookingDetail.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.booking_db = res.data;
            this.countRow = this.booking_db.length;
          }.bind(this)
        );
    },

    searchData() {
      if (this.filter == "checkIn" || this.filter == "checkOut") {
        this.searchSent = this.converDateToQuery(this.search);
      } else {
        this.searchSent = this.search;
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_bookingDetail.php", {
          action: "searchBookingDetail",
          search: this.searchSent,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.booking_db = res.data;
            this.countRow = this.booking_db.length;
            if (this.booking_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    getBookingDetail(booking) {
      this.visible = !this.visible;
      this.form.bookingDetailID = booking.bookingDetailID;
      this.form.guestFirstName = booking.guestFirstName;
      this.form.guestLastName = booking.guestLastName;
      this.form.checkIn = booking.checkIn;
      this.form.checkOut = booking.checkOut;
      this.form.status = booking.status;
    },

    updateData(value) {
      this.validate();
      this.visible = value;
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_bookingDetail.php", {
            action: "updateData",
            bookingDetailID: this.form.bookingDetailID,
            guestFirstName: this.form.guestFirstName,
            guestLastName: this.form.guestLastName,
            checkIn: this.form.checkIn,
            checkOut: this.form.checkOut,
            status: this.form.status,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.resetData();
                this.getallBookingDetail();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },

    validate() {
      this.check =
        this.form.guestFirstName != "" &&
        this.form.guestLastName != "" &&
        this.form.checkIn != "" &&
        this.form.checkOut != "" &&
        this.form.status != "";
    },

    resetData() {
      this.form.bookingDetailID = "";
      this.form.guestFirstName = "";
      this.form.guestLastName = "";
      this.form.checkIn = "";
      this.form.checkOut = "";
      this.form.status = "";
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "bookingDetailID";
      }
      if (value === selectOption[1]) {
        this.filter = "roomID";
      }
      if (value === selectOption[2]) {
        this.filter = "guestFirstName";
      }
      if (value === selectOption[3]) {
        this.filter = "checkIn";
      }
      if (value === selectOption[4]) {
        this.filter = "checkOut";
      }
      if (value === selectOption[5]) {
        this.filter = "status";
      }
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
.icon-wrap {
  position: absolute;
  z-index: 0;
  padding: 5px 20px;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 45px;
  font-size: 18px;
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
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.fa-circle {
  font-size: 10px;
  margin-right: 5px;
}
.fa-pencil:hover,
.fa-trash:hover {
  color: var(--primary-blue);
}
.fa-calendar {
  color: var(--primary-blue);
  margin: 5px 0 0 -35px;
  padding-right: 100px;
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
.vl {
  border-left: 3px solid #eeeeee;
  height: 25px;
  margin: 0 10px;
}
.popup-head1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 0px;
  font-weight: bold;
  font-size: 30px;
}
.popup-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 20px;
  margin-bottom: 25px;
  font-weight: bold;
}
.status {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: yellow;
  border-radius: 50%;
}
.choices {
  display: flex;
  justify-content: flex-start;
  width: 550px;
}
.container1,
.container2,
.container3 {
  display: block;
  position: relative;
  padding: 0 0 0 35px;
  margin: 0 0 15px 0;
  cursor: pointer;
  user-select: none;
  background: none;
  width: 150px;
}
.container1 input,
.container2 input,
.container3 input {
  position: fixed;
  opacity: 0;
  cursor: pointer;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #d3d3d3;
  border-radius: 50%;
}
.container1:hover input ~ .checkmark,
.container2:hover input ~ .checkmark,
.container3:hover input ~ .checkmark {
  background-color: #ccc;
}
.container1 input:checked ~ .checkmark {
  background-color: #ffc42e;
}
.container2 input:checked ~ .checkmark {
  background-color: #24ba45;
}
.container3 input:checked ~ .checkmark {
  background-color: #e11818;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container1 input:checked ~ .checkmark:after,
.container2 input:checked ~ .checkmark:after,
.container3 input:checked ~ .checkmark:after {
  display: block;
}
.container1 .checkmark:after,
.container2 .checkmark:after,
.container3 .checkmark:after {
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  color: var(--header-color);
}
th {
  height: 35px;
  text-align: center;
  background-color: #eeeeee;
  border-bottom: 1px solid black;
}
td {
  height: 35px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.group-row {
  display: flex;
}
.group-item {
  display: flex;
  flex-direction: column;
  width: 50%;
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
}
@media (max-width: 700px) {
  .search-field {
    width: 150px;
    font-size: 16px;
  }
}
</style>
