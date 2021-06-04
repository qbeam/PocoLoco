<template>
  <SearchError v-if="error" :style="{ marginTop: '80px' }" />
  <div class="search-field">
    <h4>Booking ID</h4>
    <input v-model="bookingID" type="text" />
    <DefaultButton
      @click="getInformation"
      type="small"
      :style="width < 600 ? { width: '100px' } : {}"
      >Search</DefaultButton
    >
  </div>
  <div class="customer-info">
    <h4>Customer Information</h4>
    <div class="info">
      <div class="item" :style="width > 800 ? { marginRight: '10px' } : {}">
        Customer ID: {{ customerID }}
      </div>
      <div class="item" :style="width > 800 ? { marginRight: '10px' } : {}">
        Name: {{ firstName }} {{ lastName }}
      </div>
      <div class="item">Phone: {{ phone }}</div>
    </div>
  </div>

  <div class="table-container">
    <table v-if="payment.length !== 0 && !error">
      <tr>
        <th>Room Number</th>
        <th>Room type</th>
        <th>Night</th>
        <th>Total</th>
      </tr>

      <tr
        v-for="(pay, i) in payment.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ pay.roomID }}</td>
        <td>{{ pay.roomType }}</td>
        <td>{{ pay.day }}</td>
        <td>{{ pay.price }}</td>
      </tr>
    </table>
  </div>
  <PaginationBar
    v-if="!error"
    :pageCount="Math.ceil(payment.length / tableRow)"
    :paginationVisible="payment.length > tableRow"
    @pageReturn="pageReturn"
  />
  <div class="payment-action">
    <div class="select">
      <p>Date</p>
      <div class="flex x-full">
        <v-date-picker
          v-model="date"
          :masks="{ input: ['DD/MM/YYYY'] }"
          :model-config="dateConfig"
          mode="single"
          class="flex-grow"
        >
          <template v-slot="{ inputValue, inputEvents }">
            <div :style="{ display: 'flex', flexDirection: 'row' }">
              <input
                class="date-input"
                :value="inputValue"
                v-on="inputEvents"
              />
              <i class="fa fa-calendar"></i>
            </div>
          </template>
        </v-date-picker>
      </div>
    </div>
  </div>

  <div class="payment-action">
    <div :style="{ display: 'flex' }">
      <p>Payment Method</p>
      <CustomSelect
        type="Grey"
        :defaultChoice="paymentMethods[0]"
        :options="paymentMethods"
        @selection="selectMethod"
        :style="{ margin: 'auto 10px' }"
      />
    </div>
    <div v-if="method == 3">
      <p class="charge-warning">* Additional {{ chargeRate }} % charge</p>
    </div>
  </div>

  <div>
    <hr />
  </div>
  <div class="summary">
    <div class="room-total">
      <div class="item">
        <p>Total: {{ subTotal }} ฿</p>
      </div>
      <div class="item">
        <p>20% Deposit: {{ deposit }} ฿</p>
      </div>
    </div>
    <div class="charge-amount" v-if="method == 3">
      <p>Charge: {{ totalCharge }} ฿</p>
    </div>
  </div>
  <div>
    <hr />
    <div class="net-total">
      <p
        :style="width > 750 ? { marginRight: '15%' } : { marginRight: '10px' }"
      >
        Total Payment: {{ totalPayment }} ฿
      </p>
    </div>
  </div>

  <div class="buttons">
    <DefaultButton
      @click="reset()"
      type="transparent"
      :style="{ marginRight: '50px' }"
      >CANCEL</DefaultButton
    >
    <DefaultButton @click="confirmInf">CONFIRM</DefaultButton>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import DefaultButton from "../DefaultButton";
import { useScreenWidth } from "../../composables/useScreenWidth";
import PaginationBar from "../PaginationBar";
import SearchError from "../SearchError";
import axios from "axios";

const paymentMethods = ["Bank Transfer", "Cash", "Credit Card"];

export default {
  name: "DepositPay",
  components: {
    CustomSelect,
    DefaultButton,
    PaginationBar,
    SearchError,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      currentPage: 1,
      tableRow: 5,
      error: false,
      deposit: 100, // 20% of total price
      selectedMethod: null,
      dateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },

      paymentMethods,
      bookingID: "",
      customerID: "",
      name: "",
      firstName: "",
      lastName: "",
      phone: "",
      payment: "",
      subTotal: "",
      deposit: "",
      method: "1",
      chargeRate: "",
      totalCharge: "",
      totalPayment: "",
      deposit: "",
      date: "",
    };
  },

  created() {
    this.getChargeRate();
    console.log("re");
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    selectMethod(value) {
      console.log(value);
      if (value === paymentMethods[0]) {
        this.method = 1;
      }
      if (value === paymentMethods[1]) {
        this.method = 2;
      }
      if (value === paymentMethods[2]) {
        this.method = 3;
      }
      this.getTotal(this.payment);
    },

    getChargeRate() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_paymentCheckOut.php", {
          action: "getChargeRate",
        })
        .then(
          function(res) {
            this.chargeRate = res.data;
          }.bind(this)
        );
    },

    getInformation() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_paymentDeposit.php", {
          action: "getInformation",
          bookingID: this.bookingID,
        })
        .then(
          function(res) {
            if (res.data == "1") {
              alert("Don't have Booking ID " + this.bookingID);
              this.bookingID = "";
            } else if (res.data == "2") {
              alert("Deposit Paid");
              this.bookingID = "";
            } else {
              this.customerID = res.data[0].customerID;
              this.name = res.data[0].name;
              this.firstName = res.data[0].firstName;
              this.lastName = res.data[0].lastName;
              this.phone = res.data[0].phone;
              this.getPayment();
            }
          }.bind(this)
        );
    },

    getPayment() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_paymentDeposit.php", {
          action: "getPayment",
          bookingID: this.bookingID,
        })
        .then(
          function(res) {
            console.log(res);
            this.payment = res.data;
            this.getTotal(this.payment);
          }.bind(this)
        );
    },

    getTotal(payment) {
      var i = 0;
      var sum = 0;

      while (i < payment.length) {
        sum = sum + Number(payment[i].price);
        i = i + 1;
      }

      this.deposit = (sum * 20) / 100;
      this.subTotal = sum;
      if (this.method == 3) {
        this.totalCharge = (this.deposit * this.chargeRate) / 100;
        this.totalPayment = this.deposit + this.totalCharge;
      } else {
        this.totalPayment = sum;
        this.totalCharge = 0;
      }
    },

    confirmInf() {
      if (this.bookingID == "") {
        alert("Please enter the Booking ID ");
      } else if (this.date == "") {
        alert("Please enter the date ");
      } else {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_paymentDeposit.php", {
            action: "confirmInf",
            bookingID: this.bookingID,
            method: this.method,
            date: this.date,
          })
          .then(
            function(res) {
              alert(res.data.message);
              if (res.data.success == true) {
                this.bookingID = "";
              }
              this.reset();
            }.bind(this)
          );
      }
    },
    reset() {
      this.$router.go(0);
    },
  },
};
</script>

<style scoped>
.search-field {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
h4 {
  margin: 0;
  font-size: 18px;
}
input {
  width: 150px;
  height: 25px;
  margin: 0 10px;
  font-size: 14px;
  padding-left: 10px;
  color: var(--text-color);
}
.customer-info {
  border: 1px solid black;
  padding: 20px;
  margin: 20px 0;
}
.info {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 5px 0;
}
.item {
  display: flex;
}

.table-container {
  display: flex;
  height: 250px;
}
table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  margin-top: 20px;
  z-index: 0;
  font-size: 14px;
  table-layout: fixed;
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
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
.payment-action {
  display: flex;
  flex-direction: column;
  margin: 20px 0 15px 0;
  align-items: center;
}
.select {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.date-input {
  height: 30px;
  width: 150px;
  font-size: 14px;
}
.fa-calendar {
  color: var(--primary-blue);
  font-size: 25px;
  align-self: center;
  margin-left: -40px;
}
.charge-warning {
  font-size: 14px;
  color: var(--primary-red);
  margin: 5px 0 0 0;
}
.summary {
  display: flex;
  width: 70%;
  align-self: center;
  flex-direction: column;
}
.room-total {
  display: flex;
  width: 60%;
  justify-content: space-between;
  align-self: flex-end;
}
.charge-amount {
  display: flex;
  justify-content: flex-end;
}
.net-total {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  margin: 15px 0;
  background: var(--light-grey);
  font-weight: bold;
  justify-content: flex-end;
}
.buttons {
  display: flex;
  margin: 50px 0 20px 0;
  justify-content: center;
}
@media (max-width: 800px) {
  .info {
    flex-direction: column;
  }
  .item {
    margin: 5px 0;
  }
  .info {
    margin: 15px 0 0 0;
    font-size: 14px;
  }
}
@media (max-width: 750px) {
  .payment-action {
    flex-direction: column;
  }
  .summary {
    width: 100%;
  }
  .room-total {
    width: 80%;
    padding: 0 10px;
  }
  .charge-amount {
    padding: 0 10px;
  }
}
@media (max-width: 550px) {
  .customer-info {
    margin: 10px 0;
  }
  h4 {
    font-size: 16px;
  }
  input {
    width: 100px;
    margin: 0 10px;
    font-size: 12px;
  }
  table {
    font-size: 12px;
  }
}
</style>
