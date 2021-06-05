<template>
  <TablePage>
    <h3>
      Hotel Expenses
      <p class="countQuery">({{ countRow }})</p>
    </h3>
    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search fa-1x"
          :style="{ position: 'absolute', zIndex: 5, marginLeft: '15px' }"
        />
        <input
          v-model="search"
          class="search-field"
          type="text"
          placeholder="search"
          :style="{ marginBottom: '0' }"
        />
      </div>
      <div class="menu-buttons">
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ marginRight: '20px' }"
          @selection="selectionFilter"
        />
        <CustomSelect
          type="Year"
          :options="past5Years"
          :style="{ marginRight: '20px' }"
          @selection="setSelectedYear"
        />
        <DefaultButton
          @click="searchData"
          type="small"
          :style="width < 650 ? { width: '70px' } : {}"
        >
          Search
        </DefaultButton>
      </div>

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '20px', top: '80px' }
            : { position: 'fixed', right: '60px', top: '170px' }
        "
        @click="goToAddExpense()"
      />
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="expenseDetail_db.length !== 0">
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
        v-for="(expense, i) in expenseDetail_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ expense.em_firstname }} {{ expense.em_lastname }}</td>
        <td>{{ expense.type }}</td>

        <td>{{ expense.expense }}</td>
        <td>{{ convertDate(expense.expenseDate) }}</td>
        <td>
          <div class="manage">
            <!--View-->
            <button
              class="manage-button"
              @click="getExpenseData('view', expense)"
            >
              <i class="fa fa-search fa-2x"></i>
            </button>
            <div class="vl"></div>
            <!--Edit-->
            <button
              class="manage-button"
              @click="getExpenseData('edit', expense)"
            >
              <i class="fa fa-pencil fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button @click="deleteData(expense)" class="manage-button">
              <i class="fa fa-trash fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(expenseDetail_db.length / tableRow)"
      :paginationVisible="expenseDetail_db.length > tableRow"
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

    <!--View-->
    <Popup v-bind:visible="viewVisible" @popReturn="viewReturn">
      <div class="popup-head">
        <div class="user-pic">
          <div class="user-icon">
            <img :src="require(`../assets/${form.picName}.png`)" />
          </div>
          <h4>{{ form.employeeID }}</h4>
        </div>
        <div>
          <h4>{{ form.em_firstname }} {{ form.em_lastname }}</h4>
          <p class="subscript-text">{{ form.roleName }}</p>
        </div>
      </div>

      <div class="view-group">
        <div>
          <p><b>Type: </b>{{ form.type }}</p>
        </div>
      </div>
      <p :style="{ textAlign: 'justify' }"><b>Detail: </b>{{ form.detail }}</p>
      <div class="view-group">
        <div class="view-item">
          <p>
            <b :style="width > 700 ? { marginRight: '10px' } : { margin: '0' }">
              Amount:
            </b>
            {{ form.expense }}
            <b :style="width > 700 ? { marginLeft: '10px' } : { margin: '0 ' }">
              Baht
            </b>
          </p>
        </div>
        <div>
          <p><b>Date: </b>{{ convertDate(form.expenseDate) }}</p>
        </div>
      </div>
    </Popup>

    <!--Edit-->
    <Popup
      v-bind:visible="editVisible"
      :buttons="true"
      @popReturn="editReturn"
      @submit="submit"
    >
      <div class="popup-head">
        <div class="user-pic">
          <div class="user-icon">
            <img :src="require(`../assets/${form.picName}.png`)" />
          </div>
          <h4>{{ form.employeeID }}</h4>
        </div>
        <div>
          <h4>{{ form.em_firstname }} {{ form.em_lastname }}</h4>
          <p class="subscript-text">{{ form.roleName }}</p>
        </div>
      </div>

      <div class="input-group" :style="{ margin: '30px 0 -10px 0' }">
        <b>Expense Type</b>
        <CustomSelect
          type="Grey"
          :defaultChoice="form.type"
          :options="expenseType"
          @selection="selectionType"
          :style="{ margin: '-10px 0 30px 10px' }"
        />
      </div>

      <div class="input-group">
        <b>Detail</b>
        <textarea v-model="form.detail" :placeholder="detail" />
      </div>

      <div class="input-group" :style="{ marginTop: '20px' }">
        <div class="group-item">
          <b :style="{ marginBottom: '10px' }">Expense Amount</b>
          <div class="input-group">
            <input
              type="text"
              v-model="form.expense"
              :placeholder="expenseAmount"
              :style="{
                width: '80px',
                marginRight: '10px',
                textAlign: 'right',
              }"
            />
            <p :style="{ margin: '10px 0 0 0' }">Baht</p>
          </div>
        </div>
        <div>
          <b>Expense Date</b>
          <div class="flex x-full" :style="{ marginTop: '10px' }">
            <v-date-picker
              v-model="form.expenseDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="dateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input
                    :value="inputValue"
                    v-on="inputEvents"
                    :placeholder="date"
                    :style="{ width: '120px' }"
                  />
                  <i
                    class="fa fa-calendar fa-2x"
                    :style="{
                      color: 'var(--primary-blue',
                      margin: '3px 0 0 -35px',
                    }"
                  ></i>
                </div>
              </template>
            </v-date-picker>
          </div>
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
import SearchError from "../components/SearchError";
import SortingArrow from "../components/SortingArrow";
import Mixins from "../Mixins";
import axios from "axios";

const selectOption = ["Name", "Type", "Expense", "Date"];

const colNames = ["Employee Name", "Type", "Expense", "Date"];
const expenseType = [
  "Housekeeping",
  "Kitchen",
  "Maintenance",
  "Electricity",
  "Water",
  "Advertisement",
  "Entertainment",
  "Other",
];
export default {
  name: "HotelExpenses",
  components: {
    TablePage,
    DefaultButton,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      past5Years: null,
      selectOption,
      colNames,
      expenseType,
      currentPage: 1,
      viewVisible: false,
      editVisible: false,
      errorSearching: false,
      check: false,
      search: "",
      sortDirection: "up",
      sort: "expenseDate",
      filter: "em_firstName",
      expenseDetail_db: "",
      countRow: "",
      year: "",
      form: {
        expenseID: "",
        employeeID: "",
        roleName: "",
        em_firstname: "",
        em_lastname: "",
        employeeRole: "",
        type: "",
        detail: "",
        expense: "",
        expenseDate: "",
        picName: "",
        status: "save",
        isEdit: false,
      },

      dateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
    };
  },
  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getAllExpense();
    }
    this.past5Years = Mixins.methods.getPastYears(5);
    this.year = this.past5Years[0];
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    viewReturn(value) {
      this.viewVisible = value;
    },
    editReturn(value) {
      this.editVisible = value;
    },
    submit(value) {
      this.editVisible = value;
      this.updateData();
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
        this.sort = "em_firstName";
      } else if (click == 1) {
        this.sort = "type";
      } else if (click == 2) {
        this.sort = "expense";
      } else if (click == 3) {
        this.sort = "expenseDate";
      }
    },
    setSelectedYear(year) {
      this.year = year;
      this.searchData();
    },
    getExpenseData(type, expense) {
      if (type === "view") {
        this.viewVisible = !this.viewVisible;
      }
      if (type === "edit") {
        this.editVisible = !this.editVisible;
      }

      this.form.expenseID = expense.expenseID;
      this.form.employeeID = expense.employeeID;
      this.form.roleName = expense.roleName;
      this.form.em_firstname = expense.em_firstname;
      this.form.em_lastname = expense.em_lastname;
      this.form.employeeRole = expense.employeeRole;
      this.form.type = expense.type;
      this.form.detail = expense.detail;
      this.form.expense = expense.expense;
      this.form.expenseDate = expense.expenseDate;

      if (expense.roleName == "Admin") {
        expense.roleName = "Owner";
      }
      this.form.picName = expense.roleName + expense.gender;
    },

    goToAddExpense() {
      this.$router.push("/AddExpense");
    },
    searchData() {
      if (this.filter == "expenseDate") {
        this.searchSent = this.converDateToQuery(this.search);
      } else {
        this.searchSent = this.search;
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_hotelExpense.php", {
          action: "searchData",
          search: this.searchSent,
          sort: this.sort,
          filter: this.filter,
          direction: this.sortDirection,
          year: this.year,
        })
        .then(
          function(res) {
            this.expenseDetail_db = res.data;
            this.countRow = this.expenseDetail_db.length;
            if (this.expenseDetail_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    updateData() {
      this.check =
        this.form.employeeID != "" &&
        this.form.detail != "" &&
        this.form.expense != "" &&
        this.form.expenseDate != "";

      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_hotelExpense.php", {
            action: "update",
            employeeID: this.form.employeeID,
            expenseID: this.form.expenseID,
            type: this.form.type,
            detail: this.form.detail,
            expense: this.form.expense,
            expenseDate: this.form.expenseDate,
          })
          .then(
            function(res) {
              console.log(this.form.type);
              if (res.data.success == true) {
                alert(res.data.message);
                this.resetData();
                this.getAllExpense();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },

    resetData() {
      this.form.expenseID = "";
      this.form.employeeID = "";
      this.form.em_firstname = "";
      this.form.em_lastname = "";
      this.form.employeeRole = "";
      this.form.detail = "";
      this.form.expense = "";
      this.form.expenseDate = "";
      this.form.isEdit = false;
    },

    getAllExpense() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_hotelExpense.php", {
          action: "getAll",
          year: this.year,
        })
        .then(
          function(res) {
            this.expenseDetail_db = res.data;
            this.countRow = this.expenseDetail_db.length;
            if (this.expenseDetail_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    deleteData(expense) {
      if (confirm("Do you want to delete ID " + expense.expenseID + "?")) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_hotelExpense.php", {
            action: "deleteData",
            expenseID: expense.expenseID,
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.resetData();
              this.getAllExpense();
            }.bind(this)
          );
      }
    },
    selectionType(value) {
      if (value === expenseType[0]) {
        this.form.type = 1;
      }
      if (value === expenseType[1]) {
        this.form.type = 2;
      }
      if (value === expenseType[2]) {
        this.form.type = 3;
      }
      if (value === expenseType[3]) {
        this.form.type = 4;
      }
      if (value === expenseType[4]) {
        this.form.type = 5;
      }
      if (value === expenseType[5]) {
        this.form.type = 6;
      }
      if (value === expenseType[6]) {
        this.form.type = 7;
      }
      if (value === expenseType[7]) {
        this.form.type = 8;
      }
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "em_firstname";
      }
      if (value === selectOption[1]) {
        this.filter = "type";
      }
      if (value === selectOption[2]) {
        this.filter = "expense";
      }
      if (value === selectOption[3]) {
        this.filter = "expenseDate";
      }
    },
    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    converDateToQuery(date) {
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
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.countQuery {
  display: inline-block;
  font-size: 25px;
}
h4 {
  font-size: 20px;
  margin-bottom: 0;
}
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
.search-container {
  display: flex;
  align-items: center;
  position: relative;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 45px;
  font-size: 16px;
  outline: none;
  z-index: 1;
  border: none;
  border-radius: 50px;
  margin-right: 20px;
}
i {
  color: #5f5f5f;
}

table {
  width: 100%;
  margin-top: 50px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  z-index: 0;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.fa-pencil:hover,
.fa-search:hover,
.fa-trash:hover {
  color: var(--primary-blue);
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
.popup-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 20px;
  margin-bottom: 25px;
  font-weight: bold;
}
.user-pic {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.user-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-yellow);
  color: white;
  margin: 15px 25px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  font-size: 20px;
  overflow: hidden;
}
img {
  width: 35px;
  padding-top: 10px;
}
.subscript-text {
  color: grey;
  font-size: 14px;
  margin: 10px 0 0 0;
}
p {
  margin-bottom: 10px;
  font-size: 18px;
}
.input-group {
  display: flex;
  width: 100%;
  flex-direction: row;
}
.group-item {
  width: 60%;
  display: flex;
  flex-direction: column;
}
input {
  width: 180px;
  height: 35px;
  padding-left: 10px;
  margin-bottom: 20px;
  color: var(--header-color);
}
textarea {
  width: 100%;
  padding: 10px;
  height: 100px;
  margin-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--text-color);
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
  text-align: center;
  justify-content: center;
  align-items: center;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
.view-group {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.view-item {
  width: 50%;
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
  h4 {
    font-size: 16px;
  }
  p {
    font-size: 16px;
  }
  .subscript-text {
    font-size: 12px;
    margin-top: 5px;
  }
  .rank {
    width: 40px;
    height: 40px;
    margin: 12px 15px 0 0;
    font-size: 16px;
  }
  input {
    width: 180px;
  }
  .fa-pencil,
  .fa-search,
  .fa-trash {
    font-size: 22px;
  }
}
@media (max-width: 700px) {
  h3 {
    font-size: 44px;
    margin: 20px 0;
    padding: 0;
  }
  .menu-bar {
    flex-direction: column;
    align-items: flex-start;
    margin-top: 0;
  }
  .search-field {
    width: 250px;
    font-size: 16px;
  }
  .menu-buttons {
    margin-top: 40px;
    width: 100%;
  }
  input {
    width: 125px;
  }
  h4 {
    font-size: 14px;
  }
  p {
    font-size: 14px;
  }
  .rank {
    width: 35px;
    height: 35px;
    margin: 10px 15px 0 0;
    font-size: 14px;
  }
  table {
    font-size: 14px;
  }
  .fa-pencil,
  .fa-search,
  .fa-trash {
    font-size: 18px;
  }
  .vl {
    margin: 0;
  }
}
</style>
