<template>
  <div class="menu-bar">
    <div>
      <span class="icon-wrap">
        <i class="fa fa-search fa-1x"></i>
      </span>

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

      <DefaultButton @click="searchData" type="small">
        Search
      </DefaultButton>
    </div>
  </div>

  <SearchError v-if="errorSearching" :style="{ marginTop: '80px' }" />

  <table v-if="history_db.length !== 0">
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
      v-for="(record, i) in history_db.slice(
        currentPage * tableRow - tableRow,
        currentPage * tableRow
      )"
      :key="i"
      class="row"
    >
      <td>{{ convertDate(record.date) }}</td>
      <td>{{ record.roomID }}</td>
      <td>{{ record.total }}</td>

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
    :pageCount="Math.ceil(history_db.length / tableRow)"
    :paginationVisible="history_db.length > tableRow"
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
      <h4>Date: {{ convertDate(date) }}</h4>
    </div>
    <table :style="{ marginBottom: '20px' }">
      <tr>
        <th>Service</th>
        <th>Amount</th>
        <th>Price</th>
        <th>Total</th>
      </tr>

      <tr v-for="(order, i) in order_db" :key="i" class="row">
        <td>{{ order.name }}</td>
        <td>{{ order.amount }}</td>
        <td>{{ order.servicePrice }}</td>
        <td>{{ order.amount * order.servicePrice }}</td>
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
import SearchError from "../components/SearchError";
import SortingArrow from "../components/SortingArrow";
import axios from "axios";

const selectOption = ["Room No.", "Date"];
const colNames = ["Date", "Room Number", "Spending Total"];

export default {
  name: "ServiceActivity",
  components: {
    CustomSelect,
    DefaultButton,
    PaginationBar,
    Popup,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(480);
    return { width, height, tableRow };
  },
  data() {
    return {
      selectOption,
      colNames,
      currentPage: 1,
      viewVisible: false,
      room: null,
      date: null,
      amountSum: 0,
      priceSum: 0,
      history_db: [],
      order_db: [],

      search: "",
      searchSent: "",
      filter: "roomID",
      sort: "Date",
      sortDirection: "up",
      errorSearching: false,
    };
  },
  created() {
    this.getServiceActivity();
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
        sum = sum + Number(orders[i].servicePrice) * Number(orders[i].amount);
        i = i + 1;
      }
      return sum;
    },
    getAmount(orders) {
      var i = 0;
      var sum = 0;
      while (i < orders.length) {
        sum = sum + Number(orders[i].amount);
        i = i + 1;
      }
      return sum;
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
        this.sort = "roomID";
      } else if (click == 2) {
        this.sort = "total";
      }
    },

    // ORDER_DB (Popup)
    getServiceData(record) {
      this.viewVisible = !this.viewVisible;
      this.room = record.roomID;
      this.date = record.date;
      axios
        .post("http://localhost:8080/PocoLoco_db/api_serviceActivity.php", {
          action: "getServiceData",
          roomID: record.roomID,
          date: record.date,
        })
        .then(
          function(res) {
            this.order_db = res.data;
            this.amountSum = this.getAmount(this.order_db);
            this.priceSum = this.getTotal(this.order_db);
          }.bind(this)
        );
    },

    // HISTORY_DB (table)
    getServiceActivity() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_serviceActivity.php", {
          action: "getServiceActivity",
        })
        .then(
          function(res) {
            this.history_db = res.data;
          }.bind(this)
        );
    },

    searchData() {
      if (this.filter == "date") {
        this.searchSent = this.converDateToQuery(this.search);
      } else {
        this.searchSent = this.search;
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_serviceActivity.php", {
          action: "searchActivity",
          search: this.searchSent,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.history_db = res.data;
            if (this.history_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "roomID";
      }
      if (value === selectOption[1]) {
        this.filter = "date";
      }
    },

    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    converDateToQuery(date) {
      console.log("length", date.length);
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
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
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
p,
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
