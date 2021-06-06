<template>
  <TablePage>
    <h3>
      Order
      <p class="countQuery">({{ countRow }})</p>
    </h3>
    <div class="menu-bar">
      <AddButton
        :style="{ position: 'fixed', right: '5%', top: '80px' }"
        @click="goToAddOrder()"
      />
    </div>
    <NoServiceOrder v-if="noOrder" :type="type" />

    <table v-if="order_db.length !== 0" style="margin-top: 20px">
      <tr>
        <th v-for="(colName, i) in colNames" :key="i">
          <div class="tb-head">
            {{ colName }}
          </div>
        </th>
        <th>Manage</th>
      </tr>

      <tr
        v-for="(order, i) in order_db.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ order.roomID }}</td>
        <td>{{ order.serviceName }}</td>
        <td>{{ order.amount }}</td>
        <div class="manage">
          <DefaultButton
            type="small"
            @click="finishOrderChef(order)"
            :style="
              width > 700
                ? { width: '90px', height: '25px' }
                : { width: '60px', height: '25px' }
            "
          >
            OK
          </DefaultButton>
        </div>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(order_db.length / tableRow)"
      :paginationVisible="order_db.length > tableRow"
      :changePage="currentPage"
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
import NoServiceOrder from "../components/ServicePages/NoServiceOrder";
import axios from "axios";

const colNames = ["Room Number", "Detail", "Amount"];

export default {
  name: "ServiceToDo",
  components: {
    DefaultButton,
    TablePage,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,

    NoServiceOrder,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      colNames,
      order: [],
      currentPage: 1,
      visible: false,
      activeArrow: 0,
      sortDirection: "down",
      noOrder: false,
      order_db: "",
      check: false,
      countRow: "",
      type: "",
      role: "",
      department: "",
    };
  },

  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userDepartment") !== "Kitchen" &&
      localStorage.getItem("userDepartment") !== "Housekeeping"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.storeData();
      this.checkRole();
      this.getOrder();
    }
  },
  methods: {
    storeData() {
      this.role = localStorage.getItem("userRole");
      this.department = localStorage.getItem("userDepartment");
    },
    pageReturn(page) {
      this.currentPage = page;
    },
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    goToAddOrder() {
      this.$router.push({ name: "Services" });
    },
    async getOrder() {
      await axios
        .post("http://localhost:8080/PocoLoco_db/api_serviceToDo.php", {
          action: "getAll",
          type: this.type,
        })
        .then(
          function(res) {
            this.order_db = res.data;
            this.countRow = this.order_db.length;
            if (this.order_db != "") {
              this.noOrder = false;
            } else {
              this.noOrder = true;
            }
          }.bind(this)
        );
    },

    finishOrderChef(order) {
      if (
        confirm(
          'Served "' + order.serviceName + '" to Room ' + order.roomID + "?"
        )
      ) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_serviceToDo.php", {
            action: "finishOrderChef",
            DATETIME: order.DATETIME,
            serviceID: order.serviceID,
            roomID: order.roomID,
            serviceName: order.serviceName,
            STATUS: order.STATUS,
            type: this.type,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                this.getOrder();
              } else {
                alert(res.data.message);
              }
              this.currentPage = 1;
            }.bind(this)
          );
      }
    },
    checkRole() {
      if (
        this.role == "Maid" ||
        (this.role === "Manager" && this.department === "Housekeeping")
      ) {
        this.type = 1;
      } else if (
        this.role == "Chef" ||
        (this.role === "Manager" && this.department === "Kitchen")
      ) {
        this.type = 2;
      }
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
.fa-pencil:hover,
.fa-trash:hover {
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
  margin: 0 5px;
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
  display: flex;
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
.container {
  display: block;
  position: relative;
  padding: 0 0 0 35px;
  margin: 0 0 15px 0;
  cursor: pointer;

  user-select: none;
  background: none;
  width: 150px;
}
.container input {
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
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  background-color: #ffc42e;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
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
  table {
    font-size: 14px;
  }
}
</style>
