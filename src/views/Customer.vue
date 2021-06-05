<template>
  <TablePage>
    <h3>
      Customer
      <p class="countQuery">({{ countRow }})</p>
    </h3>
    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search fa-1x"
          :style="{
            position: 'absolute',
            zIndex: 5,
            marginLeft: '15px',
            pointerEvents: 'none',
          }"
        />

        <input
          v-model="search"
          class="search-field"
          type="text"
          placeholder="search"
          :style="{ marginBottom: '0' }"
        />
      </div>
      <CustomSelect
        type="Filter"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />
      <DefaultButton
        @click="searchData()"
        type="small"
        :style="width < 650 ? { width: '70px' } : {}"
        >Search</DefaultButton
      >

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '20px', top: '50px' }
            : { position: 'fixed', right: '60px', top: '170px' }
        "
        @click="goToCustomerReg()"
      />
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="customer_db.length > 0">
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
        v-for="(customer, index) in customer_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        v-bind:key="index"
        class="row"
      >
        <td>{{ customer.rank }}</td>
        <td>{{ customer.customerID }}</td>
        <td>{{ customer.firstName }} {{ customer.lastName }}</td>
        <td>{{ customer.phone }}</td>
        <td v-if="customer.numberVisit != NULL">{{ customer.numberVisit }}</td>
        <td v-else>0</td>
        <td>
          <div class="manage">
            <!-- Search Button -->
            <button
              class="manage-button"
              @click="getCustomerData('view', customer)"
            >
              <i class="fa fa-search fa-2x"></i>
            </button>
            <!-- Edit Button -->
            <div class="vl"></div>
            <!--Edit-->
            <button
              class="manage-button"
              @click="getCustomerData('edit', customer)"
            >
              <i class="fa fa-pencil fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(customer_db.length / tableRow)"
      :paginationVisible="customer_db.length > tableRow"
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
        <div class="ranking">
          <div class="rank">{{ form.rank }}</div>
          <h4>ID: {{ form.customerID }}</h4>
        </div>

        <div>
          <h4>{{ form.firstName }} {{ form.lastName }}</h4>
          <p v-if="form.numberVisit != NULL" class="subscript-text">
            Number of visit: {{ form.numberVisit }}
          </p>
          <p v-else class="subscript-text">Number of visit: 0</p>
        </div>
      </div>
      <div class="view-group">
        <div class="view-item">
          <p><b>Phone: </b>{{ form.phone }}</p>
        </div>
        <div>
          <p><b>Email: </b>{{ form.email }}</p>
        </div>
      </div>
      <div class="view-group">
        <div class="view-item">
          <p v-if="form.gender == 'M'"><b>Gender: </b>Male</p>
          <p v-else><b>Gender: </b>Female</p>
        </div>
        <div>
          <p><b>Birthday: </b>{{ form.DOB }}</p>
        </div>
      </div>
      <p :style="{ textAlign: 'justify' }">
        <b>Address: </b>{{ form.address }}
      </p>
    </Popup>

    <!--Edit-->
    <Popup
      v-bind:visible="editVisible"
      :buttons="true"
      @popReturn="editReturn"
      @submit="validateCheck"
    >
      <div class="input-group">
        <p
          :style="
            width > 700 ? { marginRight: '130px' } : { marginRight: '90px' }
          "
        >
          <b>First Name</b>
        </p>
        <p><b>Last Name</b></p>
      </div>
      <div class="input-group">
        <input
          type="text"
          v-model="form.firstName"
          :placeholder="fname"
          :style="{ marginRight: '20px' }"
        />
        <input type="text" v-model="form.lastName" :placeholder="lname" />
      </div>
      <p><b>Phone</b></p>
      <input type="number" v-model="form.phone" :placeholder="phone" onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107 && event.keyCode !== 110 && event.keyCode !== 190"/>
      <p><b>Email</b></p>
      <input
        type="text"
        v-model="form.email"
        :placeholder="email"
        :style="{ width: '250px' }"
      />
      <p><b>Address</b></p>
      <textarea v-model="form.address" />
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
import axios from "axios";

const selectOption = ["Name", "ID", "Rank", "No. of visit"];
const colNames = ["Rank", "Customer ID", "Name", "Phone", "Number of visit"];

export default {
  name: "Customer",
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
      viewVisible: false,
      editVisible: false,
      errorSearching: false,
      currentPage: 1,
      selectOption,
      colNames,

      search: "",
      sort: "rank",
      filter: "name",
      customer_db: "",
      check: false,
      closeTable: false,
      isSearch: false,
      sortDirection: "down",
      countRow: "",
      form: {
        rank: "",
        customerID: "",
        firstName: "",
        lastName: "",
        DOB: "",
        phone: "",
        email: "",
        address: "",
        numberVisit: "",
        isEdit: false,
      },
    };
  },

  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userDepartment") !== "Receptionist"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getAllCustomer();
    }
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
        this.sort = "name";
      } else if (click == 1) {
        this.sort = "customerID";
      } else if (click == 2) {
        this.sort = "rank";
      } else if (click == 3) {
        this.sort = "phone";
      } else if (click == 4) {
        this.sort = "numberVisit";
      }
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "name";
      }
      if (value === selectOption[1]) {
        this.filter = "customerID";
      }
      if (value === selectOption[2]) {
        this.filter = "rank";
      }
      if (value === selectOption[3]) {
        this.filter = "numberVisit";
      }
    },
    goToCustomerReg() {
      this.$router.push("/CustomerReg");
    },

    getCustomerData(type, customer) {
      if (type === "view") {
        this.viewVisible = !this.viewVisible;
      }
      if (type === "edit") {
        this.editVisible = !this.editVisible;
        this.form.isEdit = true;
      }

      this.form.rank = customer.rank;
      this.form.customerID = customer.customerID;
      this.form.firstName = customer.firstName;
      this.form.lastName = customer.lastName;
      this.form.phone = customer.phone;
      this.form.email = customer.email;
      this.form.DOB = customer.DOB;
      this.form.address = customer.address;
      this.form.numberVisit = customer.numberVisit;
      this.form.gender = customer.gender;
    },

    getAllCustomer() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_customer.php", {
          action: "getAllCustomer",
          sort: this.sort,
          filter: this.filter,
        })
        .then(
          function(res) {
            this.customer_db = res.data;
            this.countRow = this.customer_db.length;
            this.isSearch = false;
            if (this.customer_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_customer.php", {
          action: "searchData",
          search: this.search,
          sort: this.sort,
          filter: this.filter,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.customer_db = res.data;
            this.countRow = this.customer_db.length;
            this.isSearch = true;
            if (this.customer_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    validateCheck(value) {
      if (
        this.form.firstName == "" ||
        this.form.lastName == "" ||
        this.form.phone == "" ||
        this.form.email == "" ||
        this.form.address == ""
      ) {
        alert("Please fill the required fields");
      } else if (this.form.phone.length != 10) {
        alert("Phone number must be 10 digits");
      } else if (this.form.email != "") {
        this.checkEmail(value);
      }
    },

    checkEmail(value) {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_addEmployee.php", {
          action: "checkEmail",
          email: this.form.email,
        })
        .then(
          function(res) {
            if (res.data == true) {
              alert("Invalid Email");
            } else {
              this.updateData(value);
            }
          }.bind(this)
        );
    },

    updateData(value) {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_customer.php", {
          action: "updateData",
          customerID: this.form.customerID,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          DOB: this.form.DOB,
          phone: this.form.phone,
          email: this.form.email,
          address: this.form.address,
        })
        .then(
          function(res) {
            if (res.data.success == true) {
              alert(res.data.message);
              this.editVisible = value;
              this.resetData();
              this.getAllCustomer();
            } else {
              alert(res.data.message);
            }
          }.bind(this)
        );
    },

    resetData() {
      this.form.firstName = "";
      this.form.lastName = "";
      this.form.DOB == "";
      this.form.phone == "";
      this.form.email == "";
      this.form.address == "";
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
  max-width: 1000;
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
.fa-search:hover {
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
  margin: 0 15px;
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
.ranking {
  display: flex;
  flex-direction: row;
}
.rank {
  width: 50px;
  height: 50px;
  background: var(--button-blue);
  color: white;
  margin: 15px 25px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  font-size: 20px;
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
input {
  width: 180px;
  height: 35px;
  align-self: center;
  padding-left: 10px;
  margin-bottom: 20px;
  color: var(--header-color);
}
textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
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
  width: 40%;
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
}
@media (max-width: 700px) {
  .search-field {
    width: 150px;
    font-size: 16px;
  }
  input {
    width: 125px;
  }
  h3 {
    font-size: 44px;
    margin: 20px 0;
    padding: 0;
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
}
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
} 
</style>
