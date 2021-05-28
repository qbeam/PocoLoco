<template>
  <h1 align="center">Show Payment</h1>

<form>
    <input v-model="search" type="text" name="search" placeholder="Search" />
    
    <select v-model="sort">
      <option value="all">All</option>
      <option value="paymentID">Payment ID</option>
      <option value="bookingDetailID">Booking Detail ID</option>
      <option value="guestFirstName">First Name</option>
      <option value="guestLastName">Last Name</option>
      <option value="methodID">Method</option>
      <option value="type">Type</option>
      <option value="amountPaid">Amount</option>
      <option value="datePaid">Date</option>
    </select>

    <select v-model="filter">
      <option value="all">All</option>
      <option value="paymentID">Payment ID</option>
      <option value="bookingDetailID">Booking Detail ID</option>
      <option value="guestFirstName">First Name</option>
      <option value="guestLastName">Last Name</option>
      <option value="methodID">Method</option>
      <option value="type">Type</option>
      <option value="amountPaid">Amount</option>
      <option value="datePaid">Date</option>
    </select>


    <button type="search" name="submitSearch" @click="searchPayment">
      Search
    </button>
  </form>

  <table>
    <thead>
      <tr>
        <th>PaymentID</th>
        <th>Booking Detail ID</th>
        <th>Name</th>
        <th>Method</th>
        <th>Type</th>
        <th>Amount</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(payment, index) in payment_db" v-bind:key="index">
        <td>{{ payment.paymentID }}</td>
        <td>{{ payment.bookingDetailID }}</td>
        <td>{{ payment.guestFirstName }} {{ payment.guestLastName }}</td>
        <td>{{ payment.methodID }}</td>
        <td>{{ payment.type }}</td>
        <td>{{ payment.amountPaid }}</td>
        <td>{{ payment.datePaid }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "ShowPayment",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      search: "",
      check: false,
      payment_db: "",
      filter: "all",
      sort: "all",
      res: "",
    };
  },
  created() {
    this.getallPayment();
  },

  methods: {
    getallPayment() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showPayment.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.payment_db = res.data;
            console.log(res);
          }.bind(this)
        );
    },

    searchPayment(e) {
      e.preventDefault();
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showPayment.php", {
          action: "searchPayment",
          search: this.search,
          filter: this.filter,
          sort: this.sort,
        })
        .then(
          function(res) {
            this.payment_db = res.data;
            console.log(res);
          }.bind(this)
        );
    },
    resetData() {
      this.form.paymentID = "";
      this.form.bookingDetailID = "";
      this.form.guestFirstName = "";
      this.form.guestLastName = "";
      this.form.methodID = "";
      this.form.type = "";
      this.form.amountPaid = "";
      this.form.datePaid = "";
    },
  },
};
</script>
