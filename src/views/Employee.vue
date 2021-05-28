<template>
  <TablePage>
    <h3>Employee
      <p class="countQuery">(62)</p>
    </h3>
    <div v-if="role === 'Business Owner'">
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

    <div class="inner-container" v-if="role === 'Business Owner'">
      <AllEmployee v-if="selected == menus[0]" />
      <AllEmployeeRole v-if="selected == menus[1]" />
    </div>

    <div class="menu-bar" v-if="role === 'Receptionist'">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input class="search-field" type="text" placeholder="search" />
      </div>
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C', 'Sleep tight']"
        :style="{ marginRight: '20px' }"
      />
      <DefaultButton type="small">Search</DefaultButton>

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToEmployeeReg()"
      />
    </div>

    <table v-if="sampleEmployee.length !== 0 && role === 'Receptionist'">
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
        <td>{{ sampleEmployee.salary }}</td>
        <td>
          <div>
            <p style="margin-top: 5px; margin-bottom: 2px;">
              <i v-if="sampleEmployee.status == 'Employed'" class="fa fa-circle" :style="{ color: '#24BA45' }" />
              <i v-if="sampleEmployee.status == 'Suspended'" class="fa fa-circle" :style="{ color: '#FFC42E' }" />
              <i v-if="sampleEmployee.status == 'Quited'" class="fa fa-circle" :style="{ color: '#FF0000' }" />
              {{ sampleEmployee.status }}
            </p>
            <p class="sub-row">2 year</p>
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

    <PaginationBar
      :pageCount="Math.ceil(sampleEmployee.length / tableRow)"
      :paginationVisible="sampleEmployee.length > tableRow"
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

    <Popup :visible="searchVisible" @popReturn="popReturn">
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

      <h4 style="margin-bottom: 35px">Shift</h4>
      <CustomSelect
        type="Grey"
        :options="['05:00 - 13:00', '13:00 - 21:00', '21:00 - 05:00']"
        :style="{ marginRight: '20px' }"
      />

      <h4>Work status</h4>
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
    </Popup>
  </TablePage>
</template>

<script>
import AllEmployee from "../components/AllEmployee";
import AllEmployeeRole from "../components/AllEmployeeRole";
import TablePage from "../components/TablePage";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import AddButton from "../components/AddButton.vue";
import Popup from "../components/Popup.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SortingArrow from "../components/SortingArrow";

const menus = ["All Employees", "All Employees Roles"];

const colNames = ["EmployeeID", "Name", "Role", "Salary", "Status"];

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
    firstname: "Supavadeesa",
    lastname: "Phusanamsad",
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
];

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
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      sampleEmployee,
      colNames,
      menus,
      selected: menus[0],
      employee: [],
      searchVisible: false,
      editVisible: false,
      currentPage: 1,
      activeArrow: 0,
      sortDirection: "down",
      role: "Receptionist",
    };
  },
  methods: {
    selectMenu(menu) {
      this.selected = menu;
    },
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
    deleteData() {},
    goToEmployeeReg() {
      this.$router.push("/EmployeeReg");
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
  margin-top: 2px
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
