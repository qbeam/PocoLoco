<template>
  <div class="menu-bar">
    <div class="search-container">
      <i class="fa fa-search fa-1x"></i>

      <input
        v-model="search"
        class="search-field"
        type="text"
        placeholder="search"
        :style="{ marginBottom: '0' }"
      />
    </div>
    <div class="menu-buttons">
      <div
        v-if="
          role == 'Owner' || role == 'Manager Reception' || role == 'Reception'
        "
      >
        <CustomSelect
          type="Filter"
          :options="selectOptionOwner"
          :style="{ marginRight: '20px' }"
          @selection="selectionFilterOwner"
        />
      </div>

      <div v-else>
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ marginRight: '20px' }"
          @selection="selectionFilter"
        />
      </div>

      <DefaultButton type="small" @click="searchData">
        Search
      </DefaultButton>
    </div>
    <AddButton
      @click="goToAddService()"
      :style="{ position: 'absolute', right: '2%' }"
    />
  </div>

  <SearchError v-if="errorSearching" :style="{ marginTop: '80px' }" />

  <div class="table-container">
    <table v-if="service_db.length !== 0">
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
        <th
          v-if="
            role == 'Owner' ||
              role == 'Manager Reception' ||
              role == 'Manager Chef' ||
              role == 'Manager Maid'
          "
        >
          Manage
        </th>
      </tr>

      <tr
        v-for="(service, i) in service_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>
          {{ service.name }}
        </td>
        <td>{{ service.type }}</td>
        <td>{{ service.servicePrice }}</td>

        <td>
          <div
            v-if="
              role == 'Owner' ||
                role == 'Manager Reception' ||
                role == 'Manager Chef' ||
                role == 'Manager Maid'
            "
            class="manage"
          >
            <button class="manage-button" @click="getServiceEdit(service)">
              <i class="fa fa-pencil fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button class="manage-button" @click="deleteService(service)">
              <i class="fa fa-trash fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <PaginationBar
    :pageCount="Math.ceil(service_db.length / tableRow)"
    :paginationVisible="service_db.length > tableRow"
    @pageReturn="pageReturn"
  />

  <Popup
    v-bind:visible="editVisible"
    :buttons="true"
    @popReturn="editReturn"
    @submit="submit"
    :style="{ top: '0', left: '0', margin: '0' }"
  >
    <div
      v-if="
        role == 'Owner' || role == 'Reception' || role == 'Manager Reception'
      "
    >
      <h4>Service Type</h4>
      <select v-model="form.type">
        <option :value="form.type" selected disabled hidden>
          {{ form.type }}
        </option>
        <option
          v-for="(option, i) in serviceOptions"
          :key="i"
          :value="serviceOptions[i]"
          :selected="option == form.type ? 'selected' : null"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <h4>Service Name</h4>
    <input
      type="text"
      v-model="form.name"
      :placeholder="serviceName"
      :style="{ width: '280px' }"
    />
    <h4>Price</h4>
    <div class="input-group">
      <input
        v-model="form.servicePrice"
        :placeholder="servicePrice"
        :style="{ marginRight: '10px', textAlign: 'right' }"
      />
      <p>Baht</p>
    </div>
  </Popup>
</template>

<script>
import CustomSelect from "../CustomSelect";
import DefaultButton from "../DefaultButton";
import AddButton from "../AddButton";
import { useScreenWidth } from "../../composables/useScreenWidth";
import PaginationBar from "../PaginationBar";
import Popup from "../Popup";
import SearchError from "../SearchError";
import SortingArrow from "../SortingArrow";
import axios from "axios";

const selectOptionOwner = ["Name", "Type", "Price"];

const selectOption = ["Name", "Price"];

const colNames = ["Name", "Type", "Price"];

export default {
  name: "AllService",
  components: {
    CustomSelect,
    DefaultButton,
    AddButton,
    PaginationBar,
    Popup,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      currentPage: 1,
      tableRow: 10,
      editVisible: false,
      selectOption,
      selectOptionOwner,
      colNames,
      serviceOptions: ["Room Facilities", "Food & Beverage"],
      service_db: "",
      type_db: "",
      search: "",
      filter: "name",
      sort: "name",
      sortDirection: "down",
      errorSearching: false,
      check: false,
      countRow: "",
      form: {
        serviceID: "",
        type: "",
        name: "",
        servicePrice: "",
        isEdit: false,
      },
      //role: "Owner",
      //role: "Manager Reception",
       role: "Manager Chef",
      //role: "Manager Maid",
      //role: "Reception",
      // role: "Chef",
      // role: "Maid",
      type: "",
    };
  },
  created() {
    this.getAllService();
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    goToAddService() {
      this.$router.push("/AddNewService");
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
        this.sort = "type";
      } else if (click == 2) {
        this.sort = "servicePrice";
      }
    },
    returnQuery() {
      this.$emit("countQuery", this.countRow);
    },
    getAllService() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_allService.php", {
          action: "getAllService",
          role: this.role,
        })
        .then(
          function(res) {
            this.service_db = res.data;
            this.countRow = this.service_db.length;
            this.returnQuery();
          }.bind(this)
        );
    },
    updateData() {
      this.serviceOption(this.form.type);
      this.validate();
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_allService.php", {
            action: "updateData",
            serviceID: this.form.serviceID,
            type: this.form.type,
            name: this.form.name,
            servicePrice: this.form.servicePrice,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.resetData();
                this.getAllService();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },
    deleteService(service) {
      if (confirm("Delete '" + service.name + "' ?")) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_allService.php", {
            action: "deleteService",
            serviceID: service.serviceID,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.getAllService();
              }
            }.bind(this)
          );
      }
    },
    searchData() {
      if (this.role == "Chef" || this.role == "Manager Chef") {
        this.type = "Food & Beverage";
      } else if (this.role == "Maid" || this.role == "Manager Maid") {
        this.type = "Room Facilities";
      }
      axios
        .post("http://localhost:8080/PocoLoco_db/api_allService.php", {
          action: "searchService",
          search: this.search,
          filter: this.filter,
          sort: this.sort,
          direction: this.sortDirection,
          role: this.role,
          type: this.type,
        })
        .then(
          function(res) {
            this.service_db = res.data;
            this.countRow = this.service_db.length;
            this.returnQuery();
            if (this.service_db != "") {
              this.errorSearching = false;
            } else {
              this.errorSearching = true;
            }
          }.bind(this)
        );
    },
    validate() {
      this.check =
        this.form.type != "" &&
        this.form.name != "" &&
        this.form.servicePrice != "";
    },
    resetData() {
      this.form.serviceID = "";
      this.form.type = "";
      this.form.name = "";
      this.form.servicePrice = "";
      this.search = "";
      this.filter = "";
      this.sort = "";
    },

    selectionFilter(value) {
      if (value === selectOption[0]) {
        this.filter = "name";
      }
      if (value === selectOption[1]) {
        this.filter = "servicePrice";
      }
    },
    selectionFilterOwner(value) {
      if (value === selectOption[0]) {
        this.filter = "name";
      }
      if (value === selectOption[1]) {
        this.filter = "type";
      }
      if (value === selectOption[2]) {
        this.filter = "servicePrice";
      }
    },
    serviceOption(option) {
      if (option === this.serviceOptions[0]) {
        this.form.type = 1;
      }
      if (option === this.serviceOptions[1]) {
        this.form.type = 2;
      }
    },
    getServiceEdit(service) {
      this.editVisible = !this.editVisible;
      this.form.serviceID = service.serviceID;
      this.form.type = service.type;
      this.form.name = service.name;
      this.form.servicePrice = service.servicePrice;
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
  margin-top: 10px;
}
.search-container {
  position: relative;
  display: flex;
}
i {
  color: #5f5f5f;
}
.fa-search {
  position: absolute;
  z-index: 5;
  margin: 17px 10px;
  font-size: 16px;
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
  margin: 0 5px;
}
h4 {
  margin: 0;
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
  width: 100px;
  height: 30px;
  padding-left: 10px;
  margin: 10px 0 20px 0;
}

@media (max-width: 750px) {
  .menu-bar {
    flex-direction: column;
  }
  .menu-buttons {
    margin-top: 40px;
  }
  .search-field {
    width: 180px;
  }
  .table-container {
    height: 450px;
  }
  table {
    table-layout: fixed;
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
</style>
