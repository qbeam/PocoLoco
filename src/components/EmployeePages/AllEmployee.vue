<template>
  <div>
    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search fa-1x"
          style="
          position: absolute;
          z-index: 5;
          margin: 9px 15px;
          font-size: 16px;
        "
        ></i>

        <input
          class="search-field"
          type="text"
          placeholder="search"
          v-model="search"
          :style="{ marginBottom: '0' }"
        />
      </div>
      <div class="menu-button">
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ marginRight: '20px' }"
          @selection="selectionFilter"
        />
        <DefaultButton @click="searchData" type="small"> Search </DefaultButton>
      </div>
      <AddButton
        @click="goToEmployeeReg()"
        :style="{ position: 'absolute', right: '2%' }"
      />
    </div>

    <SearchError v-if="errorSearching" :style="{ marginTop: '80px' }" />
    <div class="table-container">
      <table v-if="employee_db.length !== 0">
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
              <i class="table-circle" v-if="width > 700">
                <img :src="require(`../../assets/${employee.picName}.png`)" />
              </i>
              <p>{{ employee.employeeID }}</p>
            </div>
          </td>
          <td>{{ employee.em_name }}</td>
          <td>{{ employee.roleName }}</td>
          <td>{{ employee.departmentName }}</td>
          <td>{{ employee.salary }}</td>
          <td>
            <div>
              <p style="margin-top: 5px; margin-bottom: 2px;">
                <i
                  v-if="employee.workStatus == 'Employed'"
                  class="fa fa-circle"
                  :style="{ color: '#24BA45' }"
                />
                <i
                  v-if="employee.workStatus == 'Suspended'"
                  class="fa fa-circle"
                  :style="{ color: '#FFC42E' }"
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
    </div>
    <PaginationBar
      :pageCount="Math.ceil(employee_db.length / tableRow)"
      :paginationVisible="employee_db.length > tableRow"
      @pageReturn="pageReturn"
    />

    <!-- View -->
    <Popup
      :visible="searchVisible"
      @popReturn="popReturn"
      :style="{ top: '0', left: '0', margin: '0' }"
    >
      <div class="popup-head">
        <div class="group-row">
          <div class="group-item">
            <div class="group-row">
              <div class="group-item-left">
                <div class="circle">
                  <img :src="require(`../../assets/${employee.picName}.png`)" />
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
          <p><b>Department: </b> {{ employee.departmentName }}</p>
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
      @submit="validateCheck"
      :style="{ top: '0', left: '0', margin: '0' }"
    >
      <div class="group-row">
        <div class="group-item">
          <h4>Department</h4>
          <CustomSelect
            type="Grey"
            :defaultChoice="form.departmentName"
            :options="selectDepartment"
            @selection="selectionDepartment"
          />
          <h4>Shift</h4>
          <CustomSelect
            type="Grey"
            :defaultChoice="form.shift"
            :options="selectShift"
            @selection="selectionShift"
          />
        </div>
        <div class="group-item">
          <h4>Role</h4>
          <CustomSelect
            type="Grey"
            :defaultChoice="form.roleName"
            :options="role_db"
            @selection="selectionRole"
          />
        </div>
      </div>
      <h4 style="margin-bottom: 20px">Work status</h4>
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
      <div class="group-row">
        <div class="group-item">
          <p><b>Name</b></p>
          <input type="text" :placeholder="name" v-model="form.firstName" />
          <p><b>Phone</b></p>
          <input
            v-model="form.phone"
            type="number"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107 && event.keyCode !== 110 && event.keyCode !== 190"
            :placeholder="phone"
          />
        </div>
        <div class="group-item">
          <p><b>Lastname</b></p>
          <input type="text" :placeholder="lastname" v-model="form.lastName" />
          <p><b>Email</b></p>
          <input type="text" :placeholder="email" v-model="form.email" />
        </div>
      </div>
    </Popup>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import DefaultButton from "../DefaultButton";
import AddButton from "../AddButton";
import { useScreenWidth } from "../../composables/useScreenWidth";
import { useScreenHeight } from "../../composables/useScreenHeight";
import PaginationBar from "../PaginationBar";
import Popup from "../Popup";
import SortingArrow from "../SortingArrow";
import SearchError from "../SearchError";
import axios from "axios";

const colNames = ["ID", "Name", "Role", "Dept", "Salary", "Status"];
const selectOption = [
  "Name",
  "ID",
  "Role",
  "Department",
  "Salary",
  "Status",
  "Duration",
];

const selectDepartment = [
  "Admin / Owner",
  "Receptionist",
  "Kitchen",
  "Housekeeping",
  "Security",
  "Accounts and Credits",
  "Maintenance",
];

const selectShift = ["05:00 - 13:00", "13:00 - 21:00", "21:00 - 05:00"];
const workStatus = ["Employed", "Suspended", "Quited"];

export default {
  name: "AllEmployee",
  components: {
    CustomSelect,
    DefaultButton,
    AddButton,
    PaginationBar,
    Popup,
    SortingArrow,
    SearchError,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      colNames,
      errorSearching: false,
      searchVisible: false,
      editVisible: false,
      currentPage: 1,
      activeArrow: 0,
      tableRow: 7,
      sortDirection: "up",
      selectOption,
      selectDepartment,
      selectShift,
      workStatus,
      employee: [],
      sort: "employeeID",
      filter: "em_name",
      search: "",
      employee_db: "",
      department_db: "",
      role_db: "",
      roleName: "",
      totalData: 0,
      isView: false,
      isEdit: false,
      countRow: "",
      form: {
        employeeID: "",
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
        departmentName: "",
        picName: "",
      },
    };
  },

  created() {
    this.getAllEmployee();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.searchVisible = value;
      this.editVisible = value;
    },
    submit(value) {
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
    setSort(click) {
      if (click == 0) {
        this.sort = "employeeID";
      } else if (click == 1) {
        this.sort = "em_name";
      } else if (click == 2) {
        this.sort = "roleName";
      } else if (click == 3) {
        this.sort = "departmentName";
      } else if (click == 4) {
        this.sort = "salary";
      } else if (click == 5) {
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
    returnQuery() {
      this.$emit("countQuery", this.countRow);
    },
    getAllEmployee() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "getEmployee",
        })
        .then(
          function(res) {
            this.employee_db = res.data;
            this.countRow = this.employee_db.length;
            this.returnQuery();
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
      this.form.firstName = employee.firstName;
      this.form.lastName = employee.lastName;
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
      if (employee.roleName == "Admin") {
        employee.roleName = "Owner";
      }
      this.form.picName = employee.roleName + employee.gender;
    },

    validateCheck(value) {
      if (this.form.firstName == "") {
        alert("Please fill name");
      } else if (this.form.lastName == "") {
        alert("Please fill lastname");
      } else if (this.form.phone == "") {
        alert("Please fill phone number");
      } else if (this.form.phone != "") {
        if (this.form.phone.length != 10) {
          alert("Phone number must be 10 digits");
        } else if (this.form.email == "") {
          alert("Please fill email");
        } else if (this.form.email != "") {
          this.checkEmail(value);
        }
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
              this.saveData(value);
            }
          }.bind(this)
        );
    },

    saveData(value) {
      this.form.workStatus = this.convertWorkStatus(this.form.workStatus);
      this.form.shift = this.converShift(this.form.shift);

      axios
        .post("http://localhost:8080/PocoLoco_db/api_employee.php", {
          action: "updateData",
          employeeID: this.form.employeeID,
          department: this.form.departmentName,
          role: this.form.roleName,
          shift: this.form.shift,
          workStatus: this.form.workStatus,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          phone: this.form.phone,
          email: this.form.email,
        })
        .then(
          function(res) {
            if (res.data.success == true) {
              alert(res.data.message);
              this.editVisible = value;
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
          action: "searchData",
          search: this.search,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.employee_db = res.data;
            this.countRow = this.employee_db.length;
            this.returnQuery();
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
        this.filter = "em_name";
      }
      if (value === selectOption[1]) {
        this.filter = "employeeID";
      }
      if (value === selectOption[2]) {
        this.filter = "roleName";
      }
      if (value === selectOption[3]) {
        this.filter = "departmentName";
      }
      if (value === selectOption[4]) {
        this.filter = "salary";
      }
      if (value === selectOption[5]) {
        this.filter = "workStatus";
      }
      if (value === selectOption[6]) {
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
      if (value === selectShift[0]) {
        this.form.shift = "1";
      }
      if (value === selectShift[1]) {
        this.form.shift = "2";
      }
      if (value === selectShift[2]) {
        this.form.shift = "3";
      }
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
.menu-bar {
  display: flex;
  flex-direction: row;
  position: relative;
}
.menu-button {
  display: flex;
  align-items: center;
}
.search-container {
  position: relative;
  display: flex;
}
i {
  color: #5f5f5f;
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
}
.inner-container {
  display: flex;
  height: 100%;
  margin-bottom: 50px;
  padding: 35px 30px;
  background: white;
}
.table-container {
  display: flex;
  height: 500px;
}
table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  margin-top: 50px;
  z-index: 0;
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
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
.sub-row {
  font-size: 12px;
  margin-top: 2px;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
.profile {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.table-circle {
  width: 35px;
  height: 35px;
  background: var(--primary-yellow);
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}
.circle {
  width: 40px;
  height: 40px;
  background: var(--primary-yellow);
  display: flex;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  overflow: hidden;
}
.fa-circle {
  font-size: 10px;
  margin-right: 5px;
}

.fa-pencil,
.fa-search {
  font-size: 25px;
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
.popup-head {
  /* display: flex; */
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 20px;
  margin-bottom: 25px;
  font-weight: bold;
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
.group-row {
  display: flex;
}
h4 {
  font-size: 18px;
  margin-bottom: 35px;
}
select {
  width: 150px;
  height: 35px;
  padding-left: 10px;
  margin: 10px 0 20px 0;
}
.input-group {
  display: flex;
  align-items: center;
}
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  color: var(--header-color);
}
@media (max-width: 1100px) {
  .search-field {
    width: 300px;
  }
  .menu-bar {
    flex-direction: column;
  }
  .menu-button {
    margin-top: 40px;
  }
}
@media (max-width: 700px) {
  .search-field {
    width: 180px;
  }
  .table-container {
    display: flex;
    height: 450px;
  }
  table {
    margin-top: 30px;
    font-size: 12px;
  }
  td {
    height: 50px;
  }
  .vl {
    margin: 0 1px;
  }
  .fa-pencil,
  .fa-search {
    font-size: 18px;
  }
}
@media (max-width: 550px) {
  .table-container {
    height: 480px;
  }
  table {
    font-size: 8px;
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
