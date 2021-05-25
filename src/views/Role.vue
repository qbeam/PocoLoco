<template>
  <TablePage>
    <h3>Role</h3>
    <div class="menu-bar">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input
          class="search-field"
          type="text"
          placeholder="search"
          v-model="search"
        />
      </div>
      <CustomSelect
        type="Filter"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionFilter"
      />
      <CustomSelect
        type="Sort by"
        :options="selectOption"
        :style="{ marginRight: '20px' }"
        @selection="selectionSort"
      />
      <DefaultButton @click="searchData()" type="small">Search</DefaultButton>

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToAddRole"
      />
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="role_db.length !== 0">
      <tr>
        <th>Role ID</th>
        <th>Department</th>
        <th>Name</th>

        <th>Salary</th>
        <th>Bonus Rate</th>
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
        <td>{{ role.departmentName }}</td>
        <td>{{ role.roleName }}</td>

        <td>{{ role.salary }}</td>
        <td>{{ role.bonusRate }}</td>
        <td>
          <div class="manage">
            <button class="manage-button" @click="getRecord(role.roleID)">
              <i class="fa fa-pencil fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button class="manage-button">
              <i class="fa fa-trash fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(role_db.length / tableRow)"
      :paginationVisible="role_db.length > tableRow"
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

    <Popup
      v-bind:visible="visible"
      :buttons="true"
      @popReturn="popReturn"
      @submit="submit"
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
import axios from "axios";

const selectOption = [
  "Default",
  "Role ID",
  "Department",
  "Name",
  "Salary",
  "Borate Rate",
];

export default {
  name: "Role",
  components: {
    TablePage,
    DefaultButton,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SearchError,
  },
  data() {
    return {
      numberPerPage: 4,
      currentPage: 1,
      visible: false,
      selectOption,
      errorSearching: false,

      role_db: "",
      departmentID: null,
      roleID: null,
      roleName: "",
      salary: 0,
      bonusRate: 0,

      sort: "all",
      filter: "all",
      search: "",
      status: "save",
      isEdit: false,
      check: false,

      navOpen: true,
      windowWidth: self.innerWidth,
      windowHeight: self.innerHeight,
    };
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  created() {
    this.getAllusers();
  },
  mounted() {
    this.$nextTick(() => {
      self.addEventListener("resize", this.onResize);
    });
  },
  beforeUnmount() {
    self.removeEventListener("resize", this.onResize);
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.visible = value;
    },
    submit(value) {
      this.visible = value;
      this.submitData();
    },
    selectionSort(value) {
      if (value === selectOption[0]) {
        this.sort = "all";
      }
      if (value === selectOption[1]) {
        this.sort = "roleID";
      }
      if (value === selectOption[2]) {
        this.sort = "departmentName";
      }
      if (value === selectOption[3]) {
        this.sort = "roleName";
      }
      if (value === selectOption[4]) {
        this.sort = "salary";
      }
      if (value === selectOption[5]) {
        this.sort = "bonusRate";
      }
    },
    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "all";
      }
      if (value === selectOption[1]) {
        this.filter = "roleID";
      }
      if (value === selectOption[2]) {
        this.filter = "departmentName";
      }
      if (value === selectOption[3]) {
        this.filter = "roleName";
      }
      if (value === selectOption[4]) {
        this.filter = "salary";
      }
      if (value === selectOption[5]) {
        this.filter = "bonusRate";
      }
    },
    clearValue() {
      this.roleID = "";
      this.salary = "";
      this.bonusRate = "";
      this.departmentID = "";
      this.roleName = "";
      this.isEdit = false;
    },
    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_role.php", {
          action: "getSearchData",
          search: this.search,
          sort: this.sort,
          filter: this.filter,
        })
        .then(
          function(res) {
            this.role_db = res.data;
            if (this.role_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },
    getRecord(roleID) {
      this.visible = !this.visible;
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
              this.getAllusers();
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

    getAllusers() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_role.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.role_db = res.data;
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
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
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.fa-pencil:hover,
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
input {
  width: 250px;
  height: 35px;
  align-self: center;
  padding-left: 10px;
  color: var(--header-color);
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
}
</style>
