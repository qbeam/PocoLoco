
<template>
  <div class="menu-bar">
    <div class="search-container">
      <i class="fa fa-search"></i>
      <input class="search-field" type="text" placeholder="search" />
    </div>
    <div class="menu-buttons">
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C', 'D']"
        :style="{ margin: ' 0 20px 18px 0' }"
        @selection="selectionFilter"
      />
      <DefaultButton type="small">
        Search
      </DefaultButton>
    </div>
  </div>
  <SearchError v-if="error" :style="{ marginTop: '80px' }" />
  <div class="table-container">
    <table v-if="payments.length !== 0 && !error">
      <tr>
        <th v-for="(colname, i) in colnames" :key="i">
          {{ colname }}
        </th>
      </tr>

      <tr
        v-for="(payment, i) in payments.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td :style="{ width: '10%' }">{{ payment.id }}</td>
        <td :style="{ width: '15%' }">{{ payment.detailID }}</td>
        <td :style="{ width: '20%' }">{{ payment.customer }}</td>
        <td :style="{ width: '15%' }">{{ payment.payment }}</td>
        <td :style="{ width: '15%' }">{{ payment.type }}</td>
        <td :style="{ width: '10%' }">{{ payment.amount }}</td>
        <td :style="{ width: '15%' }">{{ payment.date }}</td>
      </tr>
    </table>
  </div>

  <PaginationBar
    v-if="!error"
    :pageCount="Math.ceil(payments.length / tableRow)"
    :paginationVisible="payments.length > tableRow"
    @pageReturn="pageReturn"
  />
</template>

<script>
import CustomSelect from "./CustomSelect";
import DefaultButton from "./DefaultButton";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "./PaginationBar";
import Popup from "./Popup";
import SearchError from "./SearchError";

const payments = [
  {
    id: 1000081105,
    detailID: 1002500120,
    customer: "Supavadee Phusanam",
    payment: "Credit card",
    type: "Deposit",
    amount: "230",
    date: "16-10-2020",
  },
  {
    id: 1000081106,
    detailID: 1002500121,
    customer: "Supavadee Phusanam",
    payment: "Credit card",
    type: "Check OUT",
    amount: "2300",
    date: "18-10-2020",
  },
  {
    id: 1000081107,
    detailID: 1002500120,
    customer: "Nacha Banana",
    payment: "Cash",
    type: "Deposit",
    amount: "530",
    date: "19-10-2020",
  },

  {
    id: 1000081108,
    detailID: 1002500121,
    customer: "Nacha Banana",
    payment: "Cash",
    type: "Deposit",
    amount: "530",
    date: "19-10-2020",
  },
  {
    id: 1000081109,
    detailID: 1002500120,
    customer: "Mew Sic",
    payment: "Bank transfer",
    type: "Deposit",
    amount: "1300",
    date: "19-10-2020",
  },
  {
    id: 1000081109,
    detailID: 1002500120,
    customer: "Mew Sic",
    payment: "Bank transfer",
    type: "Check OUT",
    amount: "13000",
    date: "20-10-2020",
  },
  {
    id: 10000811010,
    detailID: 1002500122,
    customer: "Nacha Banana",
    payment: "Cash",
    type: "Check OUT",
    amount: "5300",
    date: "25-10-2020",
  },

  {
    id: 1000081111,
    detailID: 1002500123,
    customer: "Nacha Banana",
    payment: "Cash",
    type: "Check OUT",
    amount: "5300",
    date: "25-10-2020",
  },
  {
    id: 10000811012,
    detailID: 1002500120,
    customer: "Ploypapas Pianchoopat",
    payment: "Bank transfer",
    type: "Deposit",
    amount: "1300",
    date: "19-10-2020",
  },
  {
    id: 1000081113,
    detailID: 1002500123,
    customer: "Nacha Banana",
    payment: "Cash",
    type: "Check OUT",
    amount: "5300",
    date: "25-10-2020",
  },
  {
    id: 10000811014,
    detailID: 1002500120,
    customer: "Ploypapas Pianchoopat",
    payment: "Bank transfer",
    type: "Deposit",
    amount: "13000",
    date: "28-10-2020",
  },
];

const colnames = [
  "Payment ID",
  "Book Detail",
  "Customer",
  "Method",
  "Type",
  "Amount",
  "Date",
];
export default {
  name: "AllPayment",
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
      payments,
      colnames,
      currentPage: 1,
      tableRow: 10,
      error: false,
    };
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.menu-bar {
  display: flex;
  flex-direction: row;
  position: relative;
}
.menu-buttons {
  display: flex;
  align-items: center;
}
.search-container {
  position: relative;
  display: flex;
  align-items: center;
}
.fa-search {
  position: absolute;
  z-index: 5;
  font-size: 16px;
  color: #5f5f5f;
  margin-left: 15px;
}
.search-field {
  width: 180px;
  height: 30px;
  font-size: 16px;
  outline: none;
  z-index: 1;
  padding-left: 45px;
  border: 1px solid var(--light-grey);
  border-radius: 50px;
  margin-right: 20px;
  color: var(--text-color);
}
.table-container {
  display: flex;
  height: 460px;
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

@media (max-width: 700px) {
  .search-field {
    width: 70%;
  }
  .menu-bar {
    flex-direction: column;
  }
  .menu-buttons {
    margin-top: 20px;
  }
  .fa-search {
    margin: 8px 10px;
  }
  .table-container {
    height: 450px;
  }
  table {
    margin-top: 20px;
    font-size: 12px;
  }
}
@media (max-width: 580px) {
  table {
    font-size: 8px;
  }
}
</style>
