<template>
  <div class="menu-bar">
    <div>
      <span class="icon-wrap">
        <i class="fa fa-search fa-1x"></i>
      </span>

      <input class="search-field" type="text" placeholder="search" />
    </div>
    <div class="menu-buttons">
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C']"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />
      <CustomSelect
        type="Sort by"
        :options="['A', 'B', 'C']"
        :style="{ marginRight: '20px' }"
        @selection="selectionSort"
      />
      <DefaultButton type="small">
        Search
      </DefaultButton>
    </div>
  </div>
  <table v-if="history.length !== 0">
    <tr>
      <th>Date</th>
      <th>Room</th>
      <th>Spending Total</th>
      <th>View</th>
    </tr>

    <tr
      v-for="(record, i) in history.slice(
        currentPage * tableRow - tableRow,
        currentPage * tableRow
      )"
      :key="i"
      class="row"
    >
      <td>{{ record.date }}</td>
      <td>{{ record.room }}</td>
      <td>{{ getTotal(record.order) }}</td>

      <td>
        <div class="manage">
          <button class="manage-button" @click="getServiceData(record)">
            <i class="fa fa-search fa-2x"></i>
          </button>
        </div>
      </td>
    </tr>
  </table>

  <PaginationBar
    :pageCount="Math.ceil(history.length / tableRow)"
    :paginationVisible="history.length > tableRow"
    @pageReturn="pageReturn"
    :style="
      width <= 700
        ? {
            position: 'fixed',
            bottom: '30px',
            margin: '0 auto',
            right: '0',
            left: '60px',
          }
        : width <= 1000
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
  <Popup
    v-bind:visible="viewVisible"
    @popReturn="viewReturn"
    :style="{ top: '0', left: '0', margin: '0' }"
  >
    <div class="popup-head">
      <p>Room Number: {{ room }}</p>
      <h4>Date: {{ date }}</h4>
    </div>
    <table :style="{ marginBottom: '20px' }">
      <tr>
        <th>Service</th>
        <th>Amount</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      <tr v-for="(order, i) in orders" :key="i" class="row">
        <td>{{ order.name }}</td>
        <td>{{ order.amount }}</td>
        <td>{{ order.price }}</td>
        <td>{{ order.amount * order.price }}</td>
      </tr>
      <tr class="summary">
        <td>
          <b>Total</b>
        </td>
        <td>
          <b>{{ amountSum }}</b>
        </td>
        <td></td>
        <td>
          <b>{{ priceSum }}</b>
        </td>
      </tr>
    </table>
  </Popup>
</template>

<script>
import CustomSelect from "../components/CustomSelect";
import DefaultButton from "../components/DefaultButton";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import PaginationBar from "../components/PaginationBar";
import Popup from "../components/Popup";
const history = [
  {
    date: "17/07/2021",
    room: "1010",
    order: [
      { name: "French Fries", amount: 1, price: 150 },
      { name: "Coke", amount: 2, price: 50 },
      { name: "Extra Towel", amount: 1, price: 150 },
    ],
  },
  {
    date: "23/08/2021",
    room: "1005",
    order: [{ name: "toothbrush", amount: 1, price: 30 }],
  },
  {
    date: "13/10/2021",
    room: "2003",
    order: [
      { name: "Roasted beef", amount: 1, price: 250 },
      { name: "soju", amount: 2, price: 200 },
    ],
  },
  {
    date: "31/12/2021",
    room: "2022",
    order: [
      { name: "ramyoen", amount: 1, price: 60 },
      { name: "kimchi", amount: 2, price: 30 },
      { name: "chopstick", amount: 1, price: 5 },
    ],
  },
  {
    date: "04/02/2021",
    room: "3010",
    order: [{ name: "Fanta", amount: 1, price: 25 }],
  },
  {
    date: "10/04/2021",
    room: "3003",
    order: [
      { name: "salmon sashimi", amount: 1, price: 280 },
      { name: "Hot green tea", amount: 1, price: 60 },
    ],
  },
  {
    date: "24/06/2021",
    room: "4021",
    order: [{ name: "spaketti", amount: 1, price: 140 }],
  },
  {
    date: "27/07/2021",
    room: "1010",
    order: [
      { name: "cup noodele", amount: 3, price: 90 },
      { name: "lemon tea", amount: 1, price: 60 },
      { name: "slipper", amount: 1, price: 90 },
      { name: "Lay", amount: 1, price: 40 },
      { name: "sneaker", amount: 1, price: 290 },
    ],
  },
  {
    date: "27/07/2021",
    room: "1010",
    order: [
      { name: "cup noodele", amount: 3, price: 90 },
      { name: "lemon tea", amount: 1, price: 60 },
      { name: "slipper", amount: 1, price: 90 },
      { name: "Lay", amount: 1, price: 40 },
      { name: "sneaker", amount: 1, price: 290 },
    ],
  },
  {
    date: "27/07/2021",
    room: "1010",
    order: [
      { name: "cup noodele", amount: 3, price: 90 },
      { name: "lemon tea", amount: 1, price: 60 },
      { name: "slipper", amount: 1, price: 90 },
      { name: "Lay", amount: 1, price: 40 },
      { name: "sneaker", amount: 1, price: 290 },
    ],
  },
];
export default {
  name: "ServiceActivity",
  components: { CustomSelect, DefaultButton, PaginationBar, Popup },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(480);
    return { width, height, tableRow };
  },
  data() {
    return {
      history,
      currentPage: 1,
      viewVisible: false,
      room: null,
      date: null,
      amountSum: 0,
      priceSum: 0,
      orders: [],
    };
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    viewReturn(value) {
      this.viewVisible = value;
    },
    getTotal(orders) {
      var i = 0;
      var sum = 0;
      while (i < orders.length) {
        sum = sum + orders[i].price * orders[i].amount;
        i = i + 1;
      }
      return sum;
    },
    getAmount(orders) {
      var i = 0;
      var sum = 0;
      while (i < orders.length) {
        sum = sum + orders[i].amount;
        i = i + 1;
      }
      return sum;
    },
    getServiceData(record) {
      this.viewVisible = !this.viewVisible;
      this.room = record.room;
      this.date = record.date;
      this.orders = record.order;
      this.amountSum = this.getAmount(record.order);
      this.priceSum = this.getTotal(record.order);
    },
  },
};
</script>

<style scoped>
.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.menu-buttons {
  display: flex;
  align-items: center;
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
  font-size: 16px;
  outline: none;
  z-index: 1;
  border: 1px solid var(--light-grey);
  border-radius: 50px;
  margin-right: 20px;
}
i {
  color: #5f5f5f;
}
table {
  width: 100%;
  max-width: 1000;
  margin-top: 30px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  z-index: 0;
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
.manage-button {
  border: none;
  background: none;
}
.fa-search:hover {
  color: var(--primary-blue);
  cursor: pointer;
}
.popup-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  margin-bottom: 25px;
  font-weight: bold;
}
h4 {
  margin: 10px 0;
}
.summary {
  height: 45px;
  border-top: 2px solid var(--light-grey);
}
@media (max-width: 800px) {
  .menu-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .menu-buttons {
    margin-top: 40px;
  }
  .search-field {
    width: 300px;
  }
  .popup-head {
    flex-direction: column;
    padding-bottom: 15px;
  }
}
</style>
