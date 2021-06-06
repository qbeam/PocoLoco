<template>
  <SearchError v-if="error" :style="{ marginTop: '80px' }" />
  <div class="search-field">
    <div class="search-item">
      <h4>Room Number</h4>
      <input v-model="roomID" type="text" />
    </div>
    <div class="search-item">
      <DefaultButton
        @click="getInformation"
        type="small"
        :style="{ marginRight: '5px' }"
        >Add</DefaultButton
      >
      <DefaultButton
        @click="removePayment"
        type="small"
        :style="{ background: 'var(--primary-red)' }"
        >Remove</DefaultButton
      >
    </div>
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
        <th>Detail</th>
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
        <td>{{ pay.name }}</td>
        <td>{{ pay.amount }}</td>
        <td>{{ pay.total }}</td>
      </tr>
    </table>
  </div>
  <PaginationBar
    v-if="!error"
    :pageCount="Math.ceil(payment.length / tableRow)"
    :paginationVisible="payment.length > tableRow"
    :changePage="currentPage"
    @pageReturn="pageReturn"
  />

  <div class="payment-action">
    <div :style="{ display: 'flex' }">
      <p>Payment Method</p>
      <CustomSelect
        type="Grey"
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
        <p>Subtotal: {{ amount }} ฿</p>
      </div>
      <div class="item">
        <p>Discount: {{ discount }} ฿</p>
      </div>
      <div class="item">
        <p>Total: {{ total }} ฿</p>
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
      @click="clearPayment"
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
  name: "CheckOutPay",
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
      paymentMethods,
      selectedMethod: null,
      dateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },

      roomID: "",
      customerID: "",
      firstName: "",
      lastName: "",
      phone: "",
      payment: [],
      amountPaid: [],
      allRoom: [],
      bookingID: "",
      total: "",
      amount: "",
      discount: "",
      method: "1",
      chargeRate: "",
      totalCharge: "0",
      totalPayment: "",
      name: "",
    };
  },

  created() {
    this.getChargeRate();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    selectMethod(value) {
      if (value === paymentMethods[0]) {
        this.method = 1;
      }
      if (value === paymentMethods[1]) {
        this.method = 2;
      }
      if (value === paymentMethods[2]) {
        this.method = 3;
      }
      this.getAmount(this.payment);
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
        .post("http://localhost:8080/PocoLoco_db/api_paymentCheckOut.php", {
          action: "getInformation",
          roomID: this.roomID,
        })
        .then(
          function(res) {
            if (res.data == "") {
              alert("Cannot pay this room number");
              this.roomID = "";
            } else {
              if (
                this.allRoom.length == 0 ||
                this.bookingID == res.data[0]["bookingID"]
              ) {
                this.customerID = res.data[0].customerID;
                this.firstName = res.data[0].firstName;
                this.lastName = res.data[0].lastName;
                this.name = res.data[0].name;
                this.phone = res.data[0].phone;
                this.getPayment();
              } else {
                alert("Different Booking ID");
              }
            }
          }.bind(this)
        );
    },

    getPayment() {
      var i = 0;
      var room = Number(this.roomID);
      var check = 0;

      while (i < this.allRoom.length) {
        if (room == this.allRoom[i]) {
          check = 1;
          alert("Already have this roomID");
          this.roomID = "";
          break;
        }
        i++;
      }

      if (check == 0) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_paymentCheckOut.php", {
            action: "PaymentCheckOut",
            roomID: this.roomID,
          })
          .then(
            function(res) {
              
              var i = 0;
              if (
                this.allRoom.length == 0 ||
                this.bookingID == res.data[0]["bookingID"]
              ) {
                this.bookingID = res.data[0]["bookingID"];
                while (i < res.data.length) {
                  this.payment.push(res.data[i]);
                  i++;
                }
                this.calAmountPaid(res.data);
                this.getAmount(this.payment);
                this.currentPage = 1;
              } 
            }.bind(this)
          );
      }
    },

    calAmountPaid(room) {
      var roomID = 0;
      var paid = 0;
      var i = 0;
      var sumAmount = 0;
      var sumDiscount = 0;

      roomID = room[0].roomID;

      while (i < room.length) {
        if (Number(room[i].total) > 0) {
          sumAmount = sumAmount + Number(room[i].total);
        } else {
          sumDiscount = sumDiscount + Number(room[i].total);
        }
        i++;
      }

      paid = sumAmount + sumDiscount;

      if (this.paymentMethods == 3) {
        paid = this.chargeRate * paid;
      }

      this.allRoom.push(roomID);
      this.amountPaid.push(paid);
    },

    removePayment() {
      var room = Number(this.roomID);
      var i = 0;
      var j = 0;
      var length = this.payment.length;
      var lengthRoom = this.allRoom.length;

      while (i < length && this.payment.length > 0 && j < length) {
        if (room == Number(this.payment[i]["roomID"])) {
          this.payment.splice(i, 1);
          j++;
        } else {
          i++;
          j++;
        }
        this.roomID = "";
        if (this.payment.length == 0) {
          this.customerID = "";
          this.firstName = "";
          this.lastName = "";
          this.phone = "";
        }
        this.currentPage = 1;
      }

      i = 0;
      while (i < lengthRoom) {
        if (room == this.allRoom[i]) {
          this.allRoom.splice(i, 1);
          this.amountPaid.splice(i, 1);
          break;
        }
        i++;
      }

      this.getAmount(this.payment);
    },

    getAmount(payment) {
      var i = 0;
      var sumAmount = 0;
      var sumDiscount = 0;
      var total = 0;
      while (i < payment.length) {
        if (Number(payment[i].total) > 0) {
          sumAmount = sumAmount + Number(payment[i].total);
        } else {
          sumDiscount = sumDiscount + Number(payment[i].total);
        }
        i = i + 1;
      }
      this.amount = sumAmount;
      this.discount = -sumDiscount;
      total = sumAmount + sumDiscount;
      this.total = total;

      // Credit Card
      if (this.method == 3) {
        this.totalCharge = (total * this.chargeRate) / 100;
        this.totalPayment = total + this.totalCharge;
      } else {
        this.totalPayment = total;
      }
    },

    confirmInf() {
      if (this.allRoom.length == 0) {
        alert("Please fill room number");
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_paymentCheckOut.php", {
          action: "confirmInf",
          method: this.method,
          amountPaid: this.amountPaid,
          allRoom: this.allRoom,
        })
        .then(
          function(res) {
            
            alert(res.data.message);
            if (res.data.success == true) {
              this.clearPayment();
            }
          }.bind(this)
        );
    },
    clearPayment() {
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
.search-item {
  display: flex;
  align-items: center;
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
.charge-warning {
  font-size: 14px;
  color: var(--primary-red);
  margin: 5px 0 0 0;
}

.buttons {
  display: flex;
  margin: 50px 0 20px 0;
  justify-content: center;
}
.summary {
  display: flex;
  width: 70%;
  align-self: center;
  flex-direction: column;
}
.room-total {
  display: flex;
  justify-content: space-between;
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

@media (max-width: 800px) {
  .customer-info {
    margin: 10px 0;
  }
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
  p {
    margin: 10px 0;
  }
}
@media (max-width: 750px) {
  .search-field {
    flex-direction: column;
  }
  .search-item {
    margin: 10px 0;
  }
  input {
    width: 200px;
  }
  .summary {
    width: 100%;
  }
  .room-total {
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
    width: 120px;
    margin: 0 10px;
    font-size: 12px;
  }
  table {
    font-size: 12px;
  }
  p {
    font-size: 14px;
  }
}
</style>
