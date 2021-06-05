<template>
  <div>
    <div class="menu-bar">
      <div class="search-container">
        <i class="fa fa-search"></i>
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
          :style="{ margin: ' 0 20px 18px 0' }"
          @selection="selectionFilter"
        />
        <CustomSelect
          type="Year"
          :options="past5Years"
          :style="{ margin: ' 0 20px 18px 0' }"
          @selection="setSelectedYear"
        />
        <DefaultButton @click="searchPayment()" type="small">
          Search
        </DefaultButton>
      </div>
    </div>
    <SearchError v-if="errorSearching" :style="{ marginTop: '50px' }" />
    <div class="table-container">
      <table v-if="!errorSearching">
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
        </tr>

        <tr
          v-for="(payment, i) in payment_db.slice(
            currentPage * tableRow - tableRow,
            currentPage * tableRow
          )"
          :key="i"
          class="row"
        >
          <td :style="{ width: '15%' }">{{ payment.bookingDetailID }}</td>
          <td :style="{ width: '10%' }">{{ payment.roomID }}</td>
          <td :style="{ width: '20%' }">{{ payment.name }}</td>
          <td :style="{ width: '15%' }">{{ payment.methodName }}</td>
          <td :style="{ width: '15%' }">
            <i
              class="fa fa-circle"
              :style="{ color: getTagColor(payment.type) }"
            />
            {{ payment.type }}
          </td>
          <td :style="{ width: '10%' }">{{ payment.amountPaid }}</td>
          <td :style="{ width: '15%' }">{{ convertDate(payment.datePaid) }}</td>
        </tr>
      </table>
    </div>

    <PaginationBar
      v-if="!errorSearching"
      :pageCount="Math.ceil(payment_db.length / tableRow)"
      :paginationVisible="payment_db.length > tableRow"
      @pageReturn="pageReturn"
    />
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import DefaultButton from "../DefaultButton";
import { useScreenWidth } from "../../composables/useScreenWidth";
import PaginationBar from "../PaginationBar";
import SearchError from "../SearchError";
import SortingArrow from "../../components/SortingArrow";
import axios from "axios";
import Mixins from "../../Mixins";

const selectOption = [
  "Room No.",
  "Book Detail",
  "Name",
  "Method",
  "Type",
  "Date",
];

const colNames = [
  "Book Detail",
  "Room No.",
  "Customer Name",
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
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      past5Years: null,
      selectOption,
      sortDirection: "up",
      colNames,
      currentPage: 1,
      tableRow: 10,
      errorSearching: false,
      search: "",
      searchSent: "",
      check: false,
      payment_db: "",
      filter: "roomID",
      sort: "datePaid",
      res: "",
      year: "",
    };
  },

  created() {
    
    this.past5Years = Mixins.methods.getPastYears(6);
    this.year = this.past5Years[0];
    this.getallPayment();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
      this.setSort(clickedArrow);
      this.searchPayment();
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
        this.sort = "name";
      } else if (click == 3) {
        this.sort = "methodName";
      } else if (click == 4) {
        this.sort = "type";
      } else if (click == 5) {
        this.sort = "amountPaid";
      } else if (click == 6) {
        this.sort = "datePaid";
      }
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "roomID";
      }
      if (value === selectOption[1]) {
        this.filter = "bookingDetailID";
      }
      if (value === selectOption[2]) {
        this.filter = "name";
      }
      if (value === selectOption[3]) {
        this.filter = "methodName";
      }
      if (value === selectOption[4]) {
        this.filter = "type";
      }
      if (value === selectOption[5]) {
        this.filter = "datePaid";
      }
    },
    setSelectedYear(year) {
      this.year = year;
      this.searchPayment();
    },
    goToCustomerReg() {
      this.$router.push("/CustomerReg");
    },
    getTagColor(type) {
      if (type == "Deposit") {
        return "#ffc42e";
      } else if (type == "Check Out") {
        return "#e11818";
      }
    },
    getallPayment() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_allPayment.php", {
          action: "getAll",
          year: this.year,
        })
        .then(
          function(res) {
            this.payment_db = res.data;
          }.bind(this)
        );
    },

    searchPayment() {
      if (this.filter == "datePaid") {
        this.searchSent = this.convertDateToQuery(this.search);
      } else {
        this.searchSent = this.search;
      }

      axios
        .post("http://localhost:8080/PocoLoco_db/api_allPayment.php", {
          action: "searchPayment",
          search: this.searchSent,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
          year: this.year,
        })
        .then(
          function(res) {
            this.payment_db = res.data;
            if (this.payment_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
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

    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    convertDateToQuery(date) {
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
.fa-circle {
  font-size: 10px;
  margin-right: 5px;
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
