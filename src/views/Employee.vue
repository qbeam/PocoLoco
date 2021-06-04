<template>
  <TablePage>
    <h3>
      Employee
      <p class="countQuery">({{ countRow }})</p>
    </h3>

    <!-- Menu For Owner -->
    <div v-if="role === 'Owner' || role === 'Admin'" class="tabs">
      <button
        class="menu-button"
        v-for="(menu, i) in menus"
        :key="i"
        @click="selectMenu(menu)"
        :style="
          menu == selected
            ? { borderBottom: '5px solid var(--primary-blue)' }
            : {}
        "
      >
        {{ menu }}
      </button>
    </div>

    <!-- For Business -->
    <div class="inner-container" v-if="role === 'Owner' || role === 'Admin'">
      <AllEmployee @countQuery="countQuery" v-if="selected == menus[0]" />
      <AllEmployeeRole @countQuery="countQuery" v-if="selected == menus[1]" />
    </div>

    <!-- Menu For Manager -->
    <div class="menu-bar" v-if="role === 'Manager'">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input
          class="search-field"
          v-model="search"
          type="text"
          placeholder="search"
        />
      </div>
      <CustomSelect
        type="Filter"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />
      <DefaultButton @click="searchData" type="small">Search</DefaultButton>

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToEmployeeReg()"
      />
    </div>

    <!-- Employee Table For Manager -->
    <SearchError v-if="errorSearching" :style="{ marginTop: '80px' }" />
    <table v-if="employee_db.length !== 0 && role === 'Manager'">
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
        v-for="(employee, i) in employee_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>
          <div class="profile">
            <i class="table-circle">
              <img :src="require(`../assets/${employee.picName}.png`)" />
            </i>
            <p>{{ employee.employeeID }}</p>
          </div>
        </td>
        <td>{{ employee.em_name }}</td>
        <td>{{ employee.roleName }}</td>
        <td>{{ employee.salary }}</td>
        <td>
          <div>
            <p style="margin-top: 5px; margin-bottom: 2px">
              <i
                v-if="employee.workStatus == 'Employed'"
                class="fa fa-circle"
                :style="{ color: '#24BA45' }"
              />
              <i
                v-if="employee.workStatus == 'Suspended'"
                class="fa fa-circle"
                :style="{ color: 'FFC42E#' }"
              />
              <i
                v-if="employee.workStatus == 'Quited'"
                class="fa fa-circle"
                :style="{ color: '#FF0000' }"
              />
              {{ employee.workStatus }}
            </p>
            <div v-if="employee.duration == 1 || employee.duration == 0">
              <p class="sub-row">{{ employee.duration }} year</p>
            </div>
            <div v-else>
              <p class="sub-row">{{ employee.duration }} years</p>
            </div>
          </div>
        </td>

        <td>
          <div class="manage">
            <button class="manage-button" @click="viewEmployee(employee)">
              <i class="fa fa-search fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button class="manage-button" @click="editEmployee(employee)">
              <i class="fa fa-pencil fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      v-if="role === 'Manager'"
      :pageCount="Math.ceil(employee_db.length / tableRow)"
      :paginationVisible="employee_db.length > tableRow"
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

    <!-- View -->
    <Popup :visible="searchVisible" @popReturn="popReturn">
      <div class="popup-head">
        <div class="group-row">
          <div class="group-item">
            <div class="group-row">
              <div class="group-item-left">
                <div class="circle">
                  <!-- <img src="../assets/ReceptionistF.png" /> -->
                  <img :src="require(`../assets/${employee.picName}.png`)" />
                </div>
              </div>
              <div class="group-item-left" style="margin-top: 7px">
                {{ employee.employeeID }}
              </div>
            </div>
          </div>
          <div class="group-item">
            <div style="font-size: 20px">
              {{ employee.em_name }}
            </div>
            <div style="font-weight: normal; font-size: 18px">
              {{ employee.roleName }}
            </div>
          </div>
        </div>
      </div>

      <div class="group-row">
        <div class="group-item">
          <p><b>Department: </b>{{ employee.departmentName }}</p>
          <p><b>Working time: </b>{{ employee.shift }}</p>
          <p><b>Identification: </b>{{ employee.identification }}</p>
          <p><b>Gender: </b>{{ employee.gender }}</p>
          <p><b>Email: </b>{{ employee.email }}</p>
        </div>
        <div class="group-item">
          <p><b>Salary: </b>{{ employee.salary }}</p>
          <p><b>Start Date: </b>{{ convertDate(employee.startDate) }}</p>
          <p>&nbsp;</p>
          <p><b>Date of Birth: </b>{{ convertDate(employee.DOB) }}</p>
          <p><b>Phone: </b>{{ employee.phone }}</p>
        </div>
      </div>
    </Popup>

    <!-- Edit -->
    <Popup
      :visible="editVisible"
      :buttons="true"
      @popReturn="popReturn"
      @submit="updateData"
    >
      <div class="popup-head">
        <div class="group-row">
          <div class="group-item">
            <div class="group-row">
              <div class="group-item-left">
                <div class="circle">
                  <img :src="require(`../assets/${form.picName}.png`)" />
                </div>
              </div>
              <div class="group-item-left" style="margin-top: 7px">
                {{ form.employeeID }}
              </div>
            </div>
          </div>
          <div class="group-item">
            <div style="font-size: 20px">
              {{ form.em_name }}
            </div>
            <div style="font-weight: normal; font-size: 18px">
              {{ form.roleName }}
            </div>
          </div>
        </div>
      </div>

      <h4 style="margin-bottom: 35px">Shift</h4>
      <CustomSelect
        type="Grey"
        :options="selectShift"
        :defaultChoice="form.shift"
        @selection="selectionShift"
        :style="{ marginRight: '20px' }"
      />

      <h4>Work status</h4>
      <div class="choices">
        <label class="container1">
          Employed
          <input type="radio" value="Employed" v-model="form.workStatus" />
          <span class="checkmark"></span>
        </label>
        <label class="container2"
          >Suspended
          <input type="radio" value="Suspended" v-model="form.workStatus" />
          <span class="checkmark"></span>
        </label>
        <label class="container3"
          >Quited
          <input type="radio" value="Quited" v-model="form.workStatus" />
          <span class="checkmark"></span>
        </label>
      </div>
    </Popup>
  </TablePage>
</template>

<script>
import AllEmployee from "../components/EmployeePages/AllEmployee";
import AllEmployeeRole from "../components/EmployeePages/AllEmployeeRole";
import TablePage from "../components/TablePage";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import AddButton from "../components/AddButton.vue";
import Popup from "../components/Popup.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SortingArrow from "../components/SortingArrow";
import SearchError from "../components/SearchError";
import axios from "axios";

const menus = ["All Employees", "All Employees Roles"];

const selectOption = [
  "Employee ID",
  "Name",
  "Role",
  "Salary",
  "Status",
  "Duration",
];

const colNames = ["Employee ID", "Name", "Role", "Salary", "Status"];
const selectShift = ["05:00 - 13:00", "13:00 - 21:00", "21:00 - 05:00"];
const workStatus = ["Employed", "Suspended", "Quited"];

export default {
  name: "Employee",
  components: {
    AllEmployee,
    AllEmployeeRole,
    DefaultButton,
    TablePage,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SortingArrow,
    SearchError,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      colNames,
      menus,
      selected: menus[0],
      employee: [],
      errorSearching: false,
      searchVisible: false,
      editVisible: false,
      currentPage: 1,
      activeArrow: 0,
      sortDirection: "up",
      role: "",
      departmentName: "",
      countRow: "",
      selectOption,
      selectShift,
      sort: "employeeID",
      filter: "employeeID",
      search: "",
      employee_db: "",
      department_db: "",
      role_db: "",
      totalData: 0,
      isView: false,
      isEdit: false,

      form: {
        employeeID: "",
        em_name: "",
        firstName: "",
        lastName: "",
        salary: "",
        workStatus: "",
        identification: "",
        gender: "",
        DOB: "",
        email: "",
        phone: "",
        workTime: "",
        startDate: "",
        roleName: "",
        department: "",
        shift: "",
      },
    };
  },

  created() {
    this.role = localStorage.getItem("userRole");
    this.departmentName = localStorage.getItem("userDepartment");
    // if (this.role == "") {
    //   this.error404();
    // }
    this.getAllEmployee();
    this.selected = this.$store.state.employeeMenu;
  },

  methods: {
    goToEmployeeReg() {
      this.$router.push("/EmployeeReg");
    },
    selectMenu(menu) {
      this.selected = menu;
      this.$store.state.employeeMenu = menu;
    },
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.searchVisible = value;
      this.editVisible = value;
    },
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
      this.setSort(clickedArrow);
      this.searchData();
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    countQuery(value) {
      this.countRow = value;
    },
    setSort(click) {
      if (click == 0) {
        this.sort = "employeeID";
      } else if (click == 1) {
        this.sort = "em_name";
      } else if (click == 2) {
        this.sort = "roleName";
      } else if (click == 3) {
        this.sort = "salary";
      } else if (click == 4) {
        this.sort = "duration";
      }
    },

    viewEmployee(employees) {
      this.searchVisible = !this.searchVisible;
      this.employee = employees;
    },
    goToEmployeeReg() {
      this.$router.push("/EmployeeReg");
    },

    getAllEmployee() {
      console.log(this.departmentName);
      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "getEmployeeManager",
          department: this.departmentName,
        })
        .then(
          function(res) {
            console.log(res);
            this.employee_db = res.data;
            this.countRow = this.employee_db.length;
            if (this.employee_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    getRole(departmentName) {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "getRole",
          department: departmentName,
        })
        .then(
          function(res) {
            this.role_db = res.data;
          }.bind(this)
        );
    },

    editEmployee(employee) {
      this.editVisible = !this.editVisible;
      this.getRole(employee.departmentName);
      this.getData(employee);
    },

    getData(employee) {
      this.form.employeeID = employee.employeeID;
      this.form.em_name = employee.em_name;
      this.form.salary = employee.salary;
      this.form.workStatus = employee.workStatus;
      this.form.identification = employee.identification;
      this.form.gender = employee.gender;
      this.form.DOB = employee.DOB;
      this.form.email = employee.email;
      this.form.phone = employee.phone;
      this.form.workTime = employee.workTime;
      this.form.startDate = employee.startDate;
      this.form.roleName = employee.roleName;
      this.form.departmentName = employee.departmentName;
      this.form.shift = employee.shift;
      this.form.picName = employee.picName;
    },

    updateData(value) {
      this.editVisible = value;
      this.form.workStatus = this.convertWorkStatus(this.form.workStatus);
      this.form.shift = this.converShift(this.form.shift);
      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "updateDataManager",
          employeeID: this.form.employeeID,
          shift: this.form.shift,
          workStatus: this.form.workStatus,
        })
        .then(
          function(res) {
            console.log(res.data);
            if (res.data.success == true) {
              alert(res.data.message);
              this.getAllEmployee();
            } else {
              alert(res.data.message);
            }
          }.bind(this)
        );
    },

    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "searchDataManager",
          search: this.search,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
          department: this.departmentName,
        })
        .then(
          function(res) {
            console.log(res);
            this.employee_db = res.data;
            this.countRow = this.employee_db.length;
            if (this.employee_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },

    convertWorkStatus(s) {
      var status = "";
      if (s == workStatus[0]) {
        status = "E";
      } else if (s == workStatus[1]) {
        status = "S";
      } else if (s == workStatus[2]) {
        status = "Q";
      }
      return status;
    },

    convertDate(date) {
      var datearray = date.split("-");
      var newdate = datearray[2] + "/" + datearray[1] + "/" + datearray[0];
      return newdate;
    },

    yearsDiff(startDate) {
      startDate = new Date(startDate);
      var today = new Date();

      var yearsDiff = today.getFullYear() - startDate.getFullYear();
      return yearsDiff;
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "employeeID";
      }
      if (value === selectOption[1]) {
        this.filter = "em_name";
      }
      if (value === selectOption[2]) {
        this.filter = "roleName";
      }
      if (value === selectOption[3]) {
        this.filter = "salary";
      }
      if (value === selectOption[4]) {
        this.filter = "workStatus";
      }
      if (value === selectOption[5]) {
        this.filter = "duration";
      }
    },
    selectionDepartment(value) {
      this.form.department = value;
      this.getRole(value);
    },
    selectionRole(value) {
      this.roleName = value;
    },
    selectionShift(value) {
      this.form.shift = value;
    },
    converShift(value) {
      var shift = 0;
      if (value == selectShift[0]) {
        shift = 1;
      } else if (value == selectShift[1]) {
        shift = 2;
      } else if (value == selectShift[3]) {
        shift = 3;
      }

      return shift;
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
  font-size: 18px;
  margin-bottom: 15px;
}
.sub-row {
  font-size: 12px;
  margin-top: 2px;
}
.tabs {
  display: flex;
}
.menu-button {
  width: 200px;
  height: 35px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-color);
}
.inner-container {
  display: flex;
  height: 100%;
  margin-bottom: 50px;
  padding: 35px 30px;
  background: white;
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
  font-size: 18px;
  outline: none;
  z-index: 1;
  border: none;
  border-radius: 50px;
  margin-right: 20px;
}
i {
  color: #5f5f5f;
}

.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
}
table {
  width: 100%;
  max-width: 1000;
  margin-top: 50px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.circle {
  width: 45px;
  height: 45px;
  background: var(--primary-yellow);
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
}
.profile {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.table-circle {
  width: 40px;
  height: 40px;
  background: var(--primary-yellow);
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
}
.fa-circle {
  font-size: 10px;
  margin-right: 5px;
}
.fa-pencil:hover,
.fa-search:hover {
  color: var(--primary-blue);
}
.fa-calendar {
  color: var(--primary-blue);
  margin: 5px 0 0 -35px;
  padding-right: 100px;
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
.vl {
  border-left: 3px solid #eeeeee;
  height: 25px;
  margin: 0 10px;
}
.popup-head1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 0px;
  font-weight: bold;
  font-size: 30px;
}
.popup-head {
  /* display: flex; */
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 20px;
  margin-bottom: 25px;
  font-weight: bold;
}
.choices {
  display: flex;
  justify-content: flex-start;
  width: 550px;
}
.container1,
.container2,
.container3 {
  display: block;
  position: relative;
  padding: 0 0 0 35px;
  margin: 0 0 15px 0;
  cursor: pointer;

  user-select: none;
  background: none;
  width: 150px;
}
.container1 input,
.container2 input,
.container3 input {
  position: fixed;
  opacity: 0;
  cursor: pointer;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #d3d3d3;
  border-radius: 50%;
}
.container1:hover input ~ .checkmark,
.container2:hover input ~ .checkmark,
.container3:hover input ~ .checkmark {
  background-color: #ccc;
}
.container1 input:checked ~ .checkmark {
  background-color: #24ba45;
}
.container2 input:checked ~ .checkmark {
  background-color: #ffc42e;
}
.container3 input:checked ~ .checkmark {
  background-color: #e11818;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container1 input:checked ~ .checkmark:after,
.container2 input:checked ~ .checkmark:after,
.container3 input:checked ~ .checkmark:after {
  display: block;
}
.container1 .checkmark:after,
.container2 .checkmark:after,
.container3 .checkmark:after {
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  color: var(--header-color);
}
select {
  width: 220px;
  height: 40px;
  margin: 0 0 10px 0;
  padding-left: 10px;
}
th {
  height: 35px;
  text-align: center;
  background-color: #eeeeee;
  border-bottom: 1px solid black;
}
td {
  text-align: center;
  justify-content: center;
  align-items: center;
}
.group-row {
  display: flex;
}
.group-item {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.group-item-left {
  display: flex;
  flex-direction: column;
  width: 35%;
  font-size: 22px;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
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
}
@media (max-width: 700px) {
  .search-field {
    width: 150px;
    font-size: 16px;
  }
  .inner-container {
    margin-bottom: 20px;
  }
}
</style>
