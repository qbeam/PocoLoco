<template>
  <h1 align="center">Booking Detail</h1>

  <form>
    <input v-model="search" type="text" name="search" placeholder="Search" />

    <select v-model="sort">
      <option value="all">All</option>
      <option value="bookingDetailID">Booking Detail ID</option>
      <option value="guestFirstName">First Name</option>
      <option value="guestLastName">Last Name</option>
      <option value="checkIn">Check IN</option>
      <option value="checkOut">Check OUT</option>
      <option value="status">Status</option>
    </select>

    <select v-model="filter">
      <option value="all">All</option>
      <option value="bookingDetailID">Booking Detail ID</option>
      <option value="guestFirstName">First Name</option>
      <option value="guestLastName">Last Name</option>
      <option value="checkIn">Check IN</option>
      <option value="checkOut">Check OUT</option>
      <option value="status">Status</option>
    </select>

    <button type="search" name="submitSearch" @click="searchBookingDetail">
      Search
    </button>
  </form>

  <table>
    <thead>
      <tr>
        <th>Booking Detail ID</th>
        <th>Guest Name</th>
        <th>Check IN</th>
        <th>Check Out</th>
        <th>Status</th>
        <th>Manage</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(booking, index) in booking_db" v-bind:key="index">
        <td>{{ booking.bookingDetailID }}</td>
        <td>{{ booking.guestFirstName }} {{ booking.guestLastName }}</td>
        <td>{{ booking.checkIn }}</td>
        <td>{{ booking.checkOut }}</td>
        <td>{{ booking.status }}</td>
        <td>
          <button @click="getBookingDetail(booking)">Edit</button>
          <button @click="deleteBookingDetail(booking)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- Edit -->
  <h2 align="center">EDIT</h2>
  <!-- <div>
    {{ form }}
  </div> -->

  <div>
    <h4>Guest Name</h4>
    <input v-model="form.guestFirstName" type="text" placeholder="ex. Name" />
  </div>

  <div>
    <h4>Surname</h4>
    <input v-model="form.guestLastName" type="text" placeholder="ex. Name" />
  </div>

  <div>
    <h4>Check IN</h4>
    <input v-model="form.checkIn" type="date" />
  </div>

  <div>
    <h4>Status</h4>
    <input type="radio" id="r" value="Reserve" v-model="form.status" checked />
    <label for="r">Reserve</label>
    <br />
    <input type="radio" id="i" value="Check IN" v-model="form.status" checked />
    <label for="i">Check IN</label>
    <br />
    <input type="radio" id="c" value="Cancel" v-model="form.status" checked />
    <label for="c">Cancel</label>
    <br />
    <span>Picked: {{ form.status }}</span>
  </div>

  <br />
  <button @click="updateData">SAVE</button>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "ShowOrderChef",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      search: "",
      booking_db: "",
      check: false,
      filter: "all",
      sort: "all",
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
    getallBookingDetail() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showBookingDetail.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.booking_db = res.data;
            console.log(res);
          }.bind(this)
        );
    },

    searchBookingDetail(e) {
      e.preventDefault();
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showBookingDetail.php", {
          action: "searchBookingDetail",
          search: this.search,
          filter: this.filter,
          sort: this.sort,
        })
        .then(
          function(res) {
            console.log(res);
            this.booking_db = res.data;
          }.bind(this)
        );
    },

    getBookingDetail(booking) {
      this.form.isEdit = true;

      this.form.bookingDetailID = booking.bookingDetailID;
      this.form.guestFirstName = booking.guestFirstName;
      this.form.guestLastName = booking.guestLastName;
      this.form.checkIn = booking.checkIn;
      this.form.checkOut = booking.checkOut;
      this.form.status = booking.status;
    },

    editData(bookingDetailID) {
      this.form.isEdit = true;
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showBookingDetail.php", {
          action: "editData",
          bookingDetailID: bookingDetailID,
        })
        .then(
          function(res) {
            console.log(res);
            this.form.bookingDetailID = res.data[0].bookingDetailID;
            this.form.guestFirstName = res.data[0].guestFirstName;
            this.form.guestLastName = res.data[0].guestLastName;
            this.form.checkIn = res.data[0].checkIn;
            this.form.checkOut = res.data[0].checkOut;
            this.form.status = res.data[0].status;
          }.bind(this)
        );
    },

    updateData() {
      this.validate();

      if (this.check && this.form.isEdit) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_showBookingDetail.php", {
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
              console.log(res.data);
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

    deleteBookingDetail(booking) {
      if (
        confirm("Do you want to delete ID " + booking.bookingDetailID + "?")
      ) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_showBookingDetail.php", {
            action: "deleteBookingDetail",
            bookingDetailID: booking.bookingDetailID,
          })
          .then(
            function(res) {
              alert(res.data.message);
              if (res.data.success == true) {
                this.resetData();
                this.getallBookingDetail();
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
  },
};
</script>
