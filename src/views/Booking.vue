<template>
  <TablePage>
    <h3>Booking</h3>
    <div class="menu-bar">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

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

    <SearchError v-if="errorSearching" />
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
        <td>{{ booking.bookingID }}</td>
        <td>{{ booking.customerName }}</td>
        <td>{{ booking.phone }}</td>
        <td>{{ booking.email }}</td>
        <td>
          <div class="manage">
            <button class="manage-button" @click="getRecord(booking)">
              <i class="fa fa-search fa-2x"></i>
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

        <tr
          v-for="(detail, i) in bookingDetail_db.slice(
            currentPage * tableRow - tableRow,
            currentPage * tableRow
          )"
          :key="i"
          class="row"
        >
          <td>{{ detail.bookingDetailID }}</td>
          <td>{{ detail.roomID }}</td>
          <td>{{ convertStatus(detail.status) }}</td>
          <td>
            <div class="manage">
              <button
                class="manage-button"
                @click="editDetail(detail.bookingDetailID)"
              >
                <i class="fa fa-pencil fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>
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

const selectOption = ["BookingID", "Name", "Phone", "Email"];
const colNames = ["BookingID", "Customer Name", "Phone", "Email"];

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
      filter: "bookingID",
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
        this.sort = "bookingID";
      } else if (click == 1) {
        this.sort = "customerName";
      } else if (click == 2) {
        this.sort = "phone";
      } else if (click == 3) {
        this.sort = "email";
      }
    },

    getRecord(booking) {
      this.visible = !this.visible;
      this.bookingID = booking.bookingID;
      this.customerName = booking.customerName;
      this.phone = booking.phone;
      this.getBookingDetail(booking.bookingID);
    },

    goToAddBooking() {
      this.$router.push("/AddBooking");
    },

    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          search: this.form.search,
          sort: this.sort,
          filter: this.filter,
          action: "SearchData",
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.booking_db = res.data;
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
        this.filter = "bookingID";
      }
      if (value === selectOption[1]) {
        this.filter = "customerName";
      }
      if (value === selectOption[2]) {
        this.filter = "phone";
      }
      if (value === selectOption[3]) {
        this.filter = "email";
      }
    },

    convertStatus(status) {
      var fullStatus;
      if (status == "R") {
        fullStatus = "Reserve";
      } else if (status == "I") {
        fullStatus = "Check IN";
      } else if (status == "C") {
        fullStatus = "Cancel";
      }
      return fullStatus;
    },

    submit(value) {
      this.switchPop = value;
      this.visible = !value;
      this.check =
        this.form.guestFirstname != "" && this.form.guestLastname != "";

      if (this.check && this.form.isEdit) {
        //Update Data
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
              this.resetData();
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
          }.bind(this)
        );
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
    editDetail(id) {
      this.visible = !this.visible;
      this.switchPop = !this.switchPop;
      this.form.isEdit = true;
      axios
        .post("http://localhost:8080/PocoLoco_db/api_booking.php", {
          action: "getEditDetail",
          bookingDetailID: id,
        })
        .then(
          function(res) {
            this.form.bookingDetailID = res.data.bookingDetailID;
            this.form.guestFirstname = res.data.guestFirstname;
            this.form.guestLastname = res.data.guestLastname;
            this.form.checkIn = res.data.checkIn;
            this.form.checkOut = res.data.checkOut;
            this.form.statusRoom = res.data.statusRoom;
            if (this.form.statusRoom == "R") {
              this.statusR = true;
              this.statusI = false;
              this.statusC = false;
            }
            if (this.form.statusRoom == "C") {
              this.statusC = true;
              this.statusR = false;
              this.statusI = false;
            }
            if (this.form.statusRoom == "I") {
              this.statusI = true;
              this.statusR = false;
              this.statusC = false;
            }
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
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
  /* margin-top: 50px; */
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
}
</style>
