<template>
  <TablePage>
    <h3>
      Booking Detail
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
          v-model="search"
          class="search-field"
          type="text"
          placeholder="search"
        />
      </div>
      <div class="menu-buttons">
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ marginRight: '20px' }"
          @selection="selectionFilter"
        />
        <CustomSelect
          type="Year"
          :options="past5Years"
          :style="{ marginRight: '20px' }"
          @selection="setSelectedYear"
        />
        <DefaultButton @click="searchData" type="small">Search</DefaultButton>
      </div>
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
        <td>{{ convertDate(booking.checkIn) }}</td>
        <td>{{ convertDate(booking.checkOut) }}</td>
        <td>
          <i
            v-if="booking.status == 'Check In'"
            class="fa fa-circle"
            :style="{ color: '#24BA45' }"
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
          {{ booking.statusPayment }}
        </td>
        <td>
          <div
            v-if="booking.status == 'Check Out' || booking.status == 'Cancel'"
            class="manage"
          >
            <button class="manage-button" @click="searchDetail(booking)">
              <i class="fa fa-search fa-2x"></i>
            </button>
          </div>
          <div
            v-if="booking.status == 'Reserve' || booking.status == 'Check In'"
            class="manage"
          >
            <button class="manage-button" @click="searchDetail(booking)">
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
      <div class="popup-head1">Booking ID: {{ booking.bookingID }}</div>
      <div class="popup-head">
        <div class="item">
          Name: {{ booking.firstName }} {{ booking.lastName }}
        </div>
        <div class="item">Phone: {{ booking.phone }}</div>
      </div>
      <p :style="{ marginBottom: '30px' }">
        <b>Booking Detail ID: </b>{{ booking.bookingDetailID }}
      </p>
      <p>
        <b>Guest Name: </b>
        {{ booking.guestFirstName }} {{ booking.guestLastName }}
      </p>
      <div class="group-row">
        <div class="group-item">
          <p><b>Room Number: </b>{{ booking.roomID }}</p>
        </div>
        <div>
          <p><b>Room Type: </b>{{ booking.roomType }}</p>
        </div>
      </div>
      <div class="group-row">
        <div class="group-item">
          <p><b>From: </b>{{ convertDate(booking.checkIn) }}</p>
        </div>
        <div>
          <p><b>To: </b>{{ convertDate(booking.checkOut) }}</p>
        </div>
      </div>
      <div class="group-row">
        <div class="group-item">
          <p>
            <b>Status: </b>
            <i
              class="fa fa-circle"
              :style="{ color: getBgColor(booking.status) }"
            />
            {{ booking.status }}
          </p>
        </div>
        <div>
          <p><b>Total: </b>{{ booking.price }} Bath</p>
        </div>
      </div>
    </Popup>

    <Popup
      :visible="visible"
      :buttons="true"
      @popReturn="popReturn"
      @submit="updateData"
    >
      <div class="group-row" :style="{ marginBottom: '25px' }">
        <div class="group-item">
          <p><b>Guest Name</b></p>
          <input
            type="text"
            v-model="form.guestFirstName"
            :placeholder="firstname"
            :style="{ width: '80%' }"
          />
        </div>

        <div class="group-item">
          <p><b>Last Name</b></p>
          <input
            type="text"
            v-model="form.guestLastName"
            :placeholder="lastname"
            :style="{ width: '80%' }"
          />
        </div>
      </div>

      <div>
        <p><b>Status</b></p>
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
import Mixins from "../Mixins";

const selectOption = [
  "Detail ID",
  "Room No.",
  "Check In",
  "Check Out",
  "Status",
  "Payment",
];

const colNames = [
  "Detail ID",
  "Room No.",
  "Check In",
  "Check Out",
  "Status",
  "Payment",
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
    const { height, tableRow } = useScreenHeight(430);
    return { width, height, tableRow };
  },
  data() {
    return {
      past5Years: "",
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
      year: "",
      form: {
        bookingDetailID: "",
        guestFirstName: "",
        guestLastName: "",
        checkIn: "",
        checkOut: "",
        status: "",
        payment: "",
        isEdit: false,
      },
    };
  },

  created() {
    this.past5Years = Mixins.methods.getPastYears(6);
    this.year = this.past5Years[0];
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userDepartment") !== "Receptionist"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getallBookingDetail();
    }
  },

  methods: {
    getBgColor(status) {
      if (status == "Check In") {
        return "#24BA45";
      } else if (status == "Reserve") {
        return "#ffc42e";
      } else if (status == "Cancel") {
        return "#e11818";
      } else if (status == "Check Out") {
        return "#BDBDBD";
      }
    },
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
        this.sort = "checkIn";
      } else if (click == 3) {
        this.sort = "checkOut";
      } else if (click == 4) {
        this.sort = "status";
      } else if (click == 5) {
        this.sort = "statusPayment";
      }
    },
    searchDetail(bookings) {
      this.searchVisible = !this.searchVisible;
      this.booking = bookings;
    },

    getallBookingDetail() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_bookingDetail.php", {
          action: "getAll",
          year: this.year,
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
          year: this.year,
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

      if (this.form.checkIn > this.form.checkOut) {
        alert("Please check your date again");
      } else {
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
      console.log("FIL RET", value);
      if (value === selectOption[0]) {
        this.filter = "bookingDetailID";
      }
      if (value === selectOption[1]) {
        this.filter = "roomID";
      }
      if (value === selectOption[2]) {
        this.filter = "checkIn";
      }
      if (value === selectOption[3]) {
        this.filter = "checkOut";
      }
      if (value === selectOption[4]) {
        this.filter = "status";
      }
      if (value === selectOption[5]) {
        this.filter = "statusPayment";
      }
    },
    setSelectedYear(year) {
      this.year = year;
      this.searchData();
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
.menu-bar {
  width: 100%;
  display: flex;
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
.menu-buttons {
  display: flex;
  align-items: center;
}
table {
  width: 100%;
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
.fa-search:hover {
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
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 0px;
  font-weight: bold;
  font-size: 28px;
}
.popup-head {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 15px;
  margin-bottom: 25px;
  font-weight: bold;
}
.item {
  display: flex;
  margin: 5px 0;
  font-size: 18px;
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
  justify-content: space-between;
  width: 100%;
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
  width: 30%;
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
  h3 {
    font-size: 44px;
    margin: 20px 0;
    padding: 0;
  }
  .menu-bar {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 0;
  }
  .search-field {
    width: 300px;
    font-size: 16px;
  }
  .menu-buttons {
    margin-top: 40px;
    width: 100%;
  }
  table {
    font-size: 12px;
  }
  .popup-head1 {
    font-size: 20px;
  }
  .popup-head {
    font-size: 14px;
    flex-direction: column;
  }
  .fa-search,
  .fa-pencil {
    font-size: 18px;
  }
  p {
    font-size: 14px;
  }
  .choices {
    flex-direction: column;
    font-size: 14px;
  }
}
</style>
