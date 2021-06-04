<template>
  <TablePage>
    <h3>
      Booking
      <p class="countQuery">({{ countRow }})</p>
    </h3>

    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search fa-1x"
          :style="{
            position: 'absolute',
            zIndex: 5,
            marginLeft: '15px',
            pointerEvents: 'none',
          }"
        />
        <input
          v-model="form.search"
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

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToAddBooking()"
      />
    </div>

    <SearchError v-if="errorSearching" :style="{ marginTop: '100px' }" />
    <div class="table-container">
      <table v-if="booking_db.length !== 0" style="margin-top: 50px;">
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
          <td :style="{ width: '15%' }">{{ convertDate(booking.date) }}</td>
          <td :style="{ width: '15%' }">{{ booking.bookingID }}</td>
          <td :style="{ width: '25%' }">{{ booking.customerName }}</td>
          <td :style="{ width: '15%' }">{{ booking.phone }}</td>
          <td :style="{ width: '20%' }">{{ booking.email }}</td>
          <td :style="{ width: '10%' }">
            <div class="manage">
              <button class="manage-button" @click="getRecord(booking)">
                <i class="fa fa-search fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <PaginationBar
      :pageCount="Math.ceil(booking_db.length / tableRow)"
      :paginationVisible="booking_db.length > tableRow"
      @pageReturn="pageReturn"
    />

    <!-- getRecord -->
    <Popup v-bind:visible="visible" @popReturn="popReturn">
      <div class="popup-head1">Booking ID: {{ bookingID }}</div>
      <div class="popup-head">
        <div>Name: {{ customerName }}</div>
        <div>Phone: {{ phone }}</div>
      </div>
      <table v-if="bookingDetail_db.length !== 0" style="magin-top: 10px;">
        <tr>
          <th>Booking Detail ID</th>
          <th>Room Number</th>
          <th>Status</th>
          <th>Manage</th>
        </tr>

        <tr v-for="(detail, i) in bookingDetail_db" :key="i" class="row">
          <td>{{ detail.bookingDetailID }}</td>
          <td>{{ detail.roomID }}</td>
          <td>
            <i class="fa fa-circle" :style="{ color: getBgColor(detail) }" />
            {{ detail.status }}
          </td>
          <td>
            <div
              v-if="detail.status == 'Check Out' || detail.status == 'Cancel'"
              class="manage"
            >
              <button class="manage-button" @click="searchDetail(detail)">
                <i class="fa fa-search fa-2x"></i>
              </button>
            </div>

            <div
              v-if="detail.status == 'Reserve' || detail.status == 'Check In'"
              class="manage"
            >
              <button class="manage-button" @click="searchDetail(detail)">
                <i class="fa fa-search fa-2x"></i>
              </button>
              <div class="vl"></div>
              <button class="manage-button" @click="editDetail(detail)">
                <i class="fa fa-pencil fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </Popup>

    <!-- searchDetail -->
    <Popup :visible="switchInfoPop" :pop2="true" @pop2Return="pop2Return">
      <div class="popup-head1">Booking ID: {{ bookingID }}</div>
      <div class="popup-head">
        <div>Name: {{ customerName }}</div>
        <div>Phone: {{ phone }}</div>
      </div>
      <div class="group-row">
        <div class="group-item">
          <p><b>Booking Detail ID: </b>{{ detail.bookingDetailID }}</p>
          <p>
            <b>Guest Name: </b>{{ detail.guestFirstName }}
            {{ detail.guestLastName }}
          </p>
          <p><b>Room Number: </b>{{ detail.roomID }}</p>
          <p><b>Check IN: </b>{{ convertDate(detail.checkIn) }}</p>
          <p>
            <b>Status: </b>
            <i class="fa fa-circle" :style="{ color: getBgColor(detail) }" />
            {{ detail.status }}
          </p>
        </div>
        <div class="group-item">
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p><b>Room Type: </b>{{ detail.roomType }}</p>
          <p><b>Check OUT: </b>{{ convertDate(detail.checkOut) }}</p>
          <p><b>Total: </b>{{ detail.price }} Bath</p>
        </div>
      </div>
    </Popup>

    <Popup
      v-bind:visible="switchPop"
      :buttons="true"
      :pop2="true"
      @pop2Return="pop2Return"
      @submit="submit"
    >
      <div class="group-row">
        <div class="group-item">
          <p>Guest Name</p>
          <input
            type="text"
            v-model="form.guestFirstname"
            :placeholder="name"
          />
        </div>

        <div class="group-item">
          <p>Last Name</p>
          <input
            type="text"
            v-model="form.guestLastname"
            :placeholder="lastname"
          />
        </div>
      </div>

      <div class="group-row">
        <div class="group-item">
          <p>Check IN</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.checkIn"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="startDateConfig"
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
          <p>Check OUT</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="form.checkOut"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="endDateConfig"
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
            <input type="radio" value="R" v-model="form.statusRoom" />
            <span class="checkmark"></span>
          </label>
          <label class="container2"
            >Check IN
            <input type="radio" value="I" v-model="form.statusRoom" />
            <span class="checkmark"></span>
          </label>
          <label class="container3"
            >Cancel
            <input type="radio" value="C" v-model="form.statusRoom" />
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

const selectOption = ["Date", "BookingID", "Name", "Phone", "Email"];
const colNames = ["Date", "Booking ID", "Customer Name", "Phone", "Email"];

export default {
  name: "Booking",
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
      colNames,
      currentPage: 1,
      visible: false,
      switchInfoPop: false,
      switchPop: false,
      status: "",
      errorSearching: false,
      activeArrow: 0,
      sortDirection: "down",
      bookingID: "",
      customerName: "",
      phone: "",
      selectOption,
      booking_db: "",
      bookingDetail_db: "",
      message: "Booking",
      check: false,
      statusR: false,
      statusC: false,
      statusI: false,
      sort: "bookingID",
      filter: "date",
      countRow: "",
      searchSent: "",
      form: {
        search: "",
        bookingID: "",
        bookingDetailID: "",
        customerName: "",
        phone: "",
        email: "",

        guestFirstname: "",
        guestLastname: "",
        checkIn: "",
        checkOut: "",
        statusRoom: "",

        status: "save",
        isEdit: false,
      },
    };
  },

  created() {
    this.getAllBooking();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.visible = value;
    },
    pop2Return(value) {
      this.switchPop = value;
      this.switchInfoPop = value;
      this.visible = !value;
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
        this.sort = "date";
      } else if (click == 1) {
        this.sort = "bookingID";
      } else if (click == 2) {
        this.sort = "customerName";
      } else if (click == 3) {
        this.sort = "phone";
      } else if (click == 4) {
        this.sort = "email";
      }
    },
    getBgColor(detail) {
      if (detail.status == "Check In") {
        return "#24BA45";
      }
      if (detail.status == "Reserve") {
        return "#ffc42e";
      }
      if (detail.status == "Cancel") {
        return "#e11818";
      }
      if (detail.status == "Check Out") {
        return "#BDBDBD";
      }
    },
    getRecord(booking) {
      this.visible = !this.visible;
      this.bookingID = booking.bookingID;
      this.customerName = booking.customerName;
      this.phone = booking.phone;
      this.getBookingDetail(this.bookingID);
    },

    goToAddBooking() {
      this.$router.push("/AddBooking");
    },

    searchData() {
      if (this.filter == "date") {
        this.searchSent = this.converDateToQuery(this.form.search);
      } else {
        this.searchSent = this.form.search;
      }

      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          search: this.searchSent,
          sort: this.sort,
          filter: this.filter,
          action: "SearchData",
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
    
    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "date";
      }
      if (value === selectOption[1]) {
        this.filter = "bookingID";
      }
      if (value === selectOption[2]) {
        this.filter = "customerName";
      }
      if (value === selectOption[3]) {
        this.filter = "phone";
      }
      if (value === selectOption[4]) {
        this.filter = "email";
      }
    },

    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    submit(value) {
      this.switchPop = value;
      this.visible = !value;
      this.check =
        this.form.guestFirstname != "" && this.form.guestLastname != "";

      if (this.check && this.form.isEdit) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
            bookingDetailID: this.form.bookingDetailID,
            guestFirstname: this.form.guestFirstname,
            guestLastname: this.form.guestLastname,
            checkIn: this.form.checkIn,
            checkOut: this.form.checkOut,
            statusRoom: this.form.statusRoom,
            action: "update",
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.getAllBooking();
              this.getBookingDetail(this.bookingID);
            }.bind(this)
          );
      }
    },

    resetData() {
      this.bookingID = "";
      this.customerName = "";
      this.phone = "";
      this.form.guestFirstname = "";
      this.form.guestLastname = "";
      this.form.checkIn = "";
      this.form.checkOut = "";
      this.form.statusRoom = "";
      this.form.bookingID = "";
      this.form.bookingDetailID = "";
      this.form.customerName = "";
      this.form.phone = "";
      this.form.email = "";
      this.form.isEdit = false;
      this.statusR = false;
      this.statusI = false;
      this.statusC = false;
    },

    getAllBooking() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          action: "getAll",
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

    searchDetail(details) {
      this.visible = !this.visible;
      this.switchInfoPop = !this.switchInfoPop;
      this.detail = details;
    },

    getBookingDetail(id) {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          action: "getBookingDetail",
          bookingID: id,
        })
        .then(
          function(res) {
            this.bookingDetail_db = res.data;
          }.bind(this)
        );
    },

    editDetail(detail) {
      this.visible = !this.visible;
      this.switchPop = !this.switchPop;
      this.form.isEdit = true;
      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          action: "getEditDetail",
          bookingDetailID: detail.bookingDetailID,
        })
        .then(
          function(res) {
            this.form.bookingDetailID = res.data.bookingDetailID;
            this.form.guestFirstname = res.data.guestFirstname;
            this.form.guestLastname = res.data.guestLastname;
            this.form.checkIn = res.data.checkIn;
            this.form.checkOut = res.data.checkOut;
            this.form.statusRoom = res.data.statusRoom;
          }.bind(this)
        );
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
.search-container {
  display: flex;
  align-items: center;
  position: relative;
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
  align-items: center;
}
.table-container {
  height: 600px;
}
table {
  width: 100%;
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
.fa-search:hover,
.fa-pencil:hover {
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
  margin: 0 5px;
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
  table {
    font-size: 14px;
  }
  .fa-search,
  .fa-pencil {
    font-size: 18px;
  }
  .vl {
    margin: 0 1px;
  }
  .popup-head1 {
    font-size: 20px;
  }
}
@media (max-width: 550px) {
  table {
    font-size: 12px;
  }
}
</style>
