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
        <DefaultButton @click="searchData()" type="small">
          Search
        </DefaultButton>
      </div>
      <AddButton
        @click="goToAddRole()"
        :style="{ position: 'absolute', right: '2%' }"
      />
    </div>

    <SearchError v-if="errorSearching" :style="{ marginTop: '80px' }" />

    <div class="table-container">
      <table v-if="role_db.length !== 0">
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
          v-for="(role, i) in role_db.slice(
            currentPage * tableRow - tableRow,
            currentPage * tableRow
          )"
          :key="i"
          class="row"
        >
          <td>{{ role.roleID }}</td>
          <td>{{ role.roleName }}</td>
          <td>{{ role.departmentName }}</td>
          <td>{{ role.salary }}</td>
          <td>{{ role.bonusRate }}</td>

          <td>
            <div class="manage">
              <button class="manage-button" @click="getRecord(role.roleID)">
                <i class="fa fa-pencil fa-2x"></i>
              </button>
              <div class="vl"></div>
              <button class="manage-button" @click="deleteData(role)">
                <i class="fa fa-trash fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <PaginationBar
      :pageCount="Math.ceil(role_db.length / tableRow)"
      :paginationVisible="role_db.length > tableRow"
      @pageReturn="pageReturn"
    />

    <Popup
      :visible="editVisible"
      :buttons="true"
      @popReturn="popReturn"
      @submit="submit"
      :style="{ top: '0', left: '0', margin: '0' }"
    >
      <div class="popup-head">
        <div>Department: {{ departmentID }}</div>
        <div>Role: {{ roleName }}</div>
      </div>
      <p>Salary</p>
      <div :style="{ paddingBottom: '20px' }">
        <input
          type="text"
          v-model="salary"
          :placeholder="salary"
          :style="{ marginRight: '10px' }"
        />
        Baht
      </div>
      <p>Bonus Rate</p>
      <input
        type="text"
        v-model="bonusRate"
        :placeholder="bonusRate"
        :style="{ width: '95%', marginBottom: '30px' }"
      />
    </Popup>
  </div>
</template>

<script>
import CustomSelect from "../CustomSelect";
import DefaultButton from "../DefaultButton";
import AddButton from "../AddButton";
import { useScreenWidth } from "../../composables/useScreenWidth";
import PaginationBar from "../../components/PaginationBar";
import Popup from "../Popup";
import SortingArrow from "../SortingArrow";
import SearchError from "../SearchError";
import axios from "axios";

const colNames = ["ID", "Role Name", "Department", "Salary", "Bonus Rate"];
const selectOption = ["Name", "Role ID", "Department", "Salary", "Borate Rate"];

export default {
  name: "AllEmployeeRole",
  components: {
    CustomSelect,
    DefaultButton,
    AddButton,
    PaginationBar,
    Popup,
    CustomSelect,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      selectOption,
      colNames,
      role: [],
      editVisible: false,
      numberPerPage: 4,
      currentPage: 1,
      activeArrow: 0,
      tableRow: 10,
      sortDirection: "down",
      errorSearching: false,
      countRow: "",

      role_db: "",
      departmentID: null,
      roleID: null,
      roleName: "",
      salary: 0,
      bonusRate: 0,

      sort: "roleID",
      filter: "roleName",
      search: "",
      status: "save",
      isEdit: false,
      check: false,
    };
  },

  created() {
    this.getAllRole();
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
      this.submitData();
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
        this.sort = "roleID";
      } else if (click == 1) {
        this.sort = "departmentName";
      } else if (click == 2) {
        this.sort = "roleName";
      } else if (click == 3) {
        this.sort = "salary";
      } else if (click == 4) {
        this.sort = "bonusRate";
      }
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "roleName";
      }
      if (value === selectOption[1]) {
        this.filter = "roleID";
      }
      if (value === selectOption[2]) {
        this.filter = "departmentName";
      }
      if (value === selectOption[3]) {
        this.filter = "salary";
      }
      if (value === selectOption[4]) {
        this.filter = "bonusRate";
      }
    },
    // getEditRecord(role) {
    //   this.editVisible = !this.editVisible;
    //   this.role = role;
    // },

    clearValue() {
      this.roleID = "";
      this.salary = "";
      this.bonusRate = "";
      this.departmentID = "";
      this.roleName = "";
      this.isEdit = false;
    },
    returnQuery() {
      this.$emit("countQuery", this.countRow);
    },
    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_role.php", {
          action: "getSearchData",
          search: this.search,
          sort: this.sort,
          filter: this.filter,
          direction: this.sortDirection,
        })
        .then(
          function(res) {
            this.role_db = res.data;
            
            if (this.role_db == "") {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
              this.countRow = this.role_db.length; 
            }
            this.returnQuery();
          }.bind(this)
        );
    },
    getRecord(roleID) {
      this.editVisible = !this.editVisible;
      this.isEdit = true;
      axios
        .post("http://localhost:8080/PocoLoco_db/api_role.php", {
          action: "getEditUser",
          roleID: roleID,
        })
        .then(
          function(res) {
            this.roleID = res.data.roleID;
            this.salary = res.data.salary;
            this.bonusRate = res.data.bonusRate;
            this.departmentID = res.data.departmentID;
            this.roleName = res.data.roleName;
          }.bind(this)
        );
    },
    deleteData(role) {
      if (confirm("Delete '" + role.roleName + "' ?")) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_role.php", {
            action: "deleteData",
            roleID: role.roleID,
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.getAllRole();
            }.bind(this)
          );
      }
    },
    submitData() {
      this.check = this.salary != "" && this.bonusRate != "";
      if (this.check && this.isEdit) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_role.php", {
            roleID: this.roleID,
            salary: this.salary,
            bonusRate: this.bonusRate,
            departmentID: this.departmentID,
            roleName: this.roleName,
            action: "update",
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.getAllRole();
              this.clearValue();
            }.bind(this)
          );
      }
    },
    goToAddRole() {
      this.$router.push("/AddRole");
    },
    navReturn(isOpen) {
      this.navOpen = isOpen;
    },
    onResize() {
      this.windowWidth = self.innerWidth;
      this.windowHeight = self.innerHeight;
      this.numberPerPage = Math.floor((this.windowHeight - 450) / 35);
      if (this.windowWidth <= 1000) {
        this.visible = false;
      }
    },

    getAllRole() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_role.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.role_db = res.data;
            this.countRow = this.role_db.length;
            this.returnQuery();
          }.bind(this)
        );
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
  display: flex;
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
    height: 450px;
  }
  table {
    margin-top: 30px;
    font-size: 10px;
  }
  .vl {
    margin: 0 1px;
  }
  .fa-pencil,
  .fa-trash {
    font-size: 18px;
  }
}
@media (max-width: 550px) {
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
