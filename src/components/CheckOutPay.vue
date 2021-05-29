Skip to content Search or jump to… Pulls Issues Marketplace Explore
<template>
  <SearchError v-if="error" :style="{ marginTop: '80px' }" />
  <div class="search-field">
    <div class="search-item">
      <h4>Booking ID</h4>
      <input type="text" />
    </div>
    <div class="search-item">
      <DefaultButton type="small" :style="{ marginRight: '5px' }"
        >Add</DefaultButton
      >
      <DefaultButton type="small" :style="{ background: 'var(--primary-red)' }"
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
        Name: {{ customerName }}
      </div>
      <div class="item">Phone: {{ phone }}</div>
    </div>
  </div>
  <div class="table-container">
    <table v-if="bookings.length !== 0 && !error">
      <tr>
        <th>Room Number</th>
        <th>Room type</th>
        <th>Night</th>
        <th>Room Price</th>
        <th>Total</th>
      </tr>

      <tr
        v-for="(booking, i) in bookings.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ booking.roomNumber }}</td>
        <td>{{ booking.type }}</td>
        <td>{{ booking.day }}</td>
        <td>{{ booking.price }}</td>
        <td>{{ booking.day * booking.price }}</td>
      </tr>
    </table>
  </div>
  <PaginationBar
    v-if="!error"
    :pageCount="Math.ceil(bookings.length / tableRow)"
    :paginationVisible="bookings.length > tableRow"
    @pageReturn="pageReturn"
  />
  <div class="payment-action">
    <p>Payment Method</p>
    <CustomSelect
      type="Grey"
      :options="paymentMethods"
      @selection="selectMethod"
      :style="{ margin: 'auto 10px' }"
    />
  </div>
  <div class="summary">
    <div class="item" :style="width > 800 ? { marginRight: '10px' } : {}">
      <p>Amount: {{ totalAmount }} ฿</p>
    </div>
    <div class="item" :style="width > 800 ? { marginRight: '10px' } : {}">
      <p>Discount: {{ discount * 100 }} %</p>
    </div>
    <div class="item">
      <p>
        Total: <b>{{ (1 - discount) * totalAmount }}</b> ฿
      </p>
    </div>
  </div>

  <div class="buttons">
    <DefaultButton type="transparent" :style="{ marginRight: '50px' }"
      >CANCEL</DefaultButton
    >
    <DefaultButton @click="addEmployee">CONFIRM</DefaultButton>
  </div>
</template>

<script>
import CustomSelect from "./CustomSelect";
import DefaultButton from "./DefaultButton";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "./PaginationBar";
import SearchError from "./SearchError";

const bookings = [
  { roomNumber: 1502, type: "Suite", day: 2, price: 7000 },
  { roomNumber: 1503, type: "Suite", day: 2, price: 7000 },
  { roomNumber: 1504, type: "Suite", day: 2, price: 7000 },
  { roomNumber: 1505, type: "Suite", day: 2, price: 7000 },
  { roomNumber: 1512, type: "Deluxe", day: 2, price: 6500 },
  { roomNumber: 1520, type: "Standard", day: 2, price: 3500 },
];

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
      bookings,
      currentPage: 1,
      tableRow: 5,
      error: false,
      customerID: 666666,
      customerName: "Ploypapas LonglonglongSurname",
      phone: "0888888888",
      totalAmount: 35000,
      discount: 0.1,
      deposit: 100, // 20% of total price
      paymentMethods: ["Bank Transfer", "Cash", "Credit Card"],
      selectedMethod: null,
      dateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
    };
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    selectMethod(value) {
      this.selectedMethod = value;
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
  max-width: 1000;
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
  margin: 20px 0;
  justify-content: center;
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
  justify-content: space-between;
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
    flex-direction: column;
    align-items: center;
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
