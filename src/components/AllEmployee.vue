<template>
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
        :style="{ marginBottom: '0' }"
      />
    </div>
    <div class="menu-button">
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C', 'Sleep tight']"
        :style="{ marginRight: '20px' }"
      />
      <DefaultButton type="small"> Search </DefaultButton>
    </div>
    <AddButton
      @click="goToEmployeeReg()"
      :style="{ position: 'absolute', right: '2%' }"
    />
  </div>

  <div class="table-container">
    <table v-if="sampleEmployee.length !== 0">
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
        v-for="(sampleEmployee, i) in sampleEmployee.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ sampleEmployee.id }}</td>
        <td>{{ sampleEmployee.firstname }} {{ sampleEmployee.lastname }}</td>
        <td>{{ sampleEmployee.role }}</td>
        <td>{{ sampleEmployee.department }}</td>
        <td>{{ sampleEmployee.salary }}</td>
        <td>
          <div>
            <p style="margin-top: 5px; margin-bottom: 2px;">
              <i v-if="sampleEmployee.status == 'Employed'" class="fa fa-circle" :style="{ color: '#24BA45' }" />
              <i v-if="sampleEmployee.status == 'Suspended'" class="fa fa-circle" :style="{ color: '#FFC42E' }" />
              <i v-if="sampleEmployee.status == 'Quited'" class="fa fa-circle" :style="{ color: '#FF0000' }" />
              {{ sampleEmployee.status }}
            </p>
            <p class="sub-row">2 years</p>
          </div>
        </td>
        <td>
          <div class="manage">
            <button
              class="manage-button"
              @click="getSearchRecord(sampleEmployee)"
            >
              <i class="fa fa-search fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button
              class="manage-button"
              @click="getEditRecord(sampleEmployee)"
            >
              <i class="fa fa-pencil fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <PaginationBar
    :pageCount="Math.ceil(sampleEmployee.length / tableRow)"
    :paginationVisible="sampleEmployee.length > tableRow"
    @pageReturn="pageReturn"
  />
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
                <img src="../assets/receptionist.png" />
              </div>
            </div>
            <div class="group-item-left" style="margin-top: 7px">
              {{ employee.id }}
            </div>
          </div>
        </div>
        <div class="group-item">
          <div style="font-size: 20px">
            {{ employee.firstname }} {{ employee.lastname }}
          </div>
          <div style="font-weight: normal; font-size: 18px">
            {{ employee.role }}
          </div>
        </div>
      </div>
    </div>

    <div class="group-row">
      <div class="group-item">
        <p>Department: {{ employee.department }}</p>
        <p>Working time: {{ employee.workingTime }}</p>
        <p>Identification: {{ employee.identification }}</p>
        <p>Gender: {{ employee.gender }}</p>
        <p>Email: {{ employee.email }}</p>
      </div>
      <div class="group-item">
        <p>Salary: {{ employee.salary }}</p>
        <p>Start Date: {{ employee.startDate }}</p>
        <p>&nbsp;</p>
        <p>Date of Birth: {{ employee.DOB }}</p>
        <p>Phone: {{ employee.phone }}</p>
      </div>
    </div>
  </Popup>

  <Popup
    :visible="editVisible"
    :buttons="true"
    @popReturn="popReturn"
    @submit="submit"
    :style="{ top: '0', left: '0', margin: '0' }"
  >
    <div class="group-row">
      <div class="group-item">
        <h4>Department</h4>
        <CustomSelect type="Grey" :options="['Kitchen', 'Rise']" />
        <h4>Shift</h4>
        <CustomSelect
          type="Grey"
          :options="['05:00 - 13:00', '13:00 - 21:00', '21:00 - 05:00']"
        />
      </div>
      <div class="group-item">
        <h4>Role</h4>
        <CustomSelect type="Grey" :options="['Manager', 'Maid']" />
      </div>
    </div>
    <h4 style="margin-bottom: 20px">Work status</h4>
    <div class="choices">
      <label class="container1">
        Employed
        <input type="radio" value="Employed" v-model="employee.status" />
        <span class="checkmark"></span>
      </label>
      <label class="container2"
        >Suspended
        <input type="radio" value="Suspended" v-model="employee.status" />
        <span class="checkmark"></span>
      </label>
      <label class="container3"
        >Quited
        <input type="radio" value="Quited" v-model="employee.status" />
        <span class="checkmark"></span>
      </label>
    </div>
    <div class="group-row">
      <div class="group-item">
        <p>Name</p>
        <input type="text" :placeholder="name" />
        <p>Phone</p>
        <input
          type="number"
          onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107 && event.keyCode !== 110 && event.keyCode !== 190"
          :placeholder="phone"
        />
      </div>
      <div class="group-item">
        <p>Surname</p>
        <input type="text" :placeholder="surname" />
        <p>Email</p>
        <input type="text" :placeholder="email" />
      </div>
    </div>
  </Popup>
</template>

<script>
import CustomSelect from "../components/CustomSelect";
import DefaultButton from "../components/DefaultButton";
import AddButton from "../components/AddButton";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import PaginationBar from "../components/PaginationBar";
import Popup from "../components/Popup";
import SortingArrow from "../components/SortingArrow";

const colNames = [
  "EmployeeID",
  "Name",
  "Role",
  "Department",
  "Salary",
  "Status",
];

const sampleEmployee = [
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Employed",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Employed",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Suspended",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
  {
    id: 120001,
    firstname: "Supavadee",
    lastname: "Phusanam",
    role: "Manager",
    department: "Kitchen",
    salary: 30000,
    workingTime: "1",
    startDate: "22/06/2015",
    identification: 1201230121201,
    gender: "Female",
    DOB: "19/08/2000",
    email: "yingsu@gmail.com",
    phone: "0820116484",
    status: "Quited",
  },
];

export default {
  name: "AllEmployee",
  components: {
    CustomSelect,
    DefaultButton,
    AddButton,
    PaginationBar,
    Popup,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      colNames,
      sampleEmployee,
      employee: [],
      searchVisible: false,
      editVisible: false,
      currentPage: 1,
      activeArrow: 0,
      tableRow: 5,
      sortDirection: "down",
    };
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
      console.log(this.sampleEmployee.id);
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    getSearchRecord(employees) {
      this.searchVisible = !this.searchVisible;
      this.employee = employees;
    },
    getEditRecord(employees) {
      this.editVisible = !this.editVisible;
      this.employee = employees;
    },
    goToEmployeeReg() {
      this.$router.push("/EmployeeReg");
    },
  },
};
</script>

<style scoped>
.icon-wrap {
  position: absolute;
  z-index: 5;
  padding: 5px 20px;
}
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
  height: 460px;
}
table {
  width: 100%;
  max-width: 1000;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  margin-top: 40px;
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
  margin-top: 2px
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
.fa-pencil:hover,
.fa-trash:hover,
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
  .menu-buttons {
    margin-top: 40px;
  }
}
@media (max-width: 700px) {
  .search-field {
    width: 180px;
  }
  .table-container {
    height: 450px;
  }
  table {
    margin-top: 30px;
    font-size: 14px;
  }
  .vl {
    margin: 0 2px;
  }
  .fa-pencil,
  .fa-trash {
    font-size: 20px;
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