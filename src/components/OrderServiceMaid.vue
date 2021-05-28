<template>
  <div class="input-group">
    <p>Room Number</p>
    <input v-model="roomID" type="text" />
  </div>
  <div class="input-group">
    <p>Service Name</p>
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
    <DefaultButton type="small" @click="searchService">
      Search
    </DefaultButton>
  </div>

  <SearchError v-if="errorSearching" />
  <table class="search-table">
    <tr>
      <th v-if="width > 700">Service ID</th>
      <th>Name</th>
      <th>Price</th>
      <th>Amount</th>
      <th>Add Order</th>
    </tr>

    <tr
      v-for="(service, i) in service_db.slice(
        currentPage * resultPerPage - resultPerPage,
        currentPage * resultPerPage
      )"
      :key="i"
      class="row"
    >
      <td v-if="width > 700">{{ service.serviceID }}</td>
      <td :style="{ textAlign: 'left' }">{{ service.name }}</td>
      <td>{{ service.servicePrice }}</td>
      <td>
        <input
          class="add-amount"
          :id="`orderAmount${i}`"
          type="number"
          min="1"
          :value="startingAmount"
        />
      </td>
      <td>
        <DefaultButton
          type="small"
          @click="addToOrder(service, i)"
          :style="
            width > 700
              ? { width: '90px', height: '25px' }
              : { width: '60px', height: '25px' }
          "
        >
          Add
        </DefaultButton>
      </td>
    </tr>
    <tr
      v-if="
        currentPage == Math.ceil(service_db.length / resultPerPage) &&
          service_db.length % resultPerPage !== 0
      "
    >
      <td colspan="5" :style="{ height: '100%' }"></td>
    </tr>
  </table>

  <PaginationBar
    :pageCount="Math.ceil(service_db.length / resultPerPage)"
    :paginationVisible="service_db.length > resultPerPage"
    @pageReturn="pageReturn"
  />

  <table class="orders" v-if="orders.length >= 1">
    <tr>
      <th v-if="width > 700">Service ID</th>
      <th>Name</th>
      <th>Amount</th>
      <th>Price</th>
      <th>Total</th>
      <th>Remove</th>
    </tr>

    <tr v-for="(order, i) in orders" :key="i" class="row">
      <td v-if="width > 700">{{ order.id }}</td>
      <td :style="{ textAlign: 'left' }">{{ order.name }}</td>
      <td>{{ order.amount }}</td>
      <td>{{ order.price }}</td>
      <td>{{ order.totalPrice }}</td>
      <td>
        <button class="manage-button" @click="removeOrder(order, i)">
          <i class="fa fa-trash fa-2x"></i>
        </button>
      </td>
    </tr>
    <tr class="summary-row">
      <td v-if="width > 700"></td>
      <td :style="{ textAlign: 'right' }"><b>Total</b></td>
      <td>
        <b>{{ totalAmount }}</b>
      </td>
      <td></td>
      <td>
        <b>{{ totalPrice }}</b>
      </td>
      <td></td>
    </tr>
  </table>

  <div class="buttons" v-if="orders.length >= 1">
    <DefaultButton
      @click="clearBasket()"
      :style="{
        height: '40px',
        width: '110px',
        background: 'none',
        marginRight: '40px',
        border: '3px solid #777777',
        color: '#777777',
        fontSize: '15px',
      }"
      >CANCEL</DefaultButton
    >
    <DefaultButton
      @click="loopInsert()"
      :style="{
        height: '40px',
        width: '110px',
        background: 'var(--primary-yellow)',
        fontSize: '15px',
      }"
      >CONFIRM</DefaultButton
    >
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "OrderServiceMaid",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      currentPage: 1,
      resultPerPage: 5,
      startingAmount: 1,
      SearchError,
      roomID: "",
      search: "",
      service_db: "",
      amount: [],
      totalPrice: 0,
      amount_insert: 0,
      serviceID_insert: "",
      total_insert: "",
      count_success: 0,
      count_fail: 0,
      item: {
        id: "",
        name: "",
        amount: 0,
        price: 0,
        totalPrice: 0,
      },
      orders: [],
      totalAmount: 0,
      totalPrice: 0,
    };
  },
  created() {
    this.getAllService();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },

    getAllService() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_orderServiceMaid.php", {
          action: "getAllService",
        })
        .then(
          function(res) {
            this.service_db = res.data;
          }.bind(this)
        );
    },

    searchService() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_orderServiceMaid.php", {
          action: "searchService",
          search: this.search,
        })
        .then(
          function(res) {
            this.service_db = res.data;
          }.bind(this)
        );
    },

    addToOrder(item, index) {
      var check = true;
      const inputAmount = Number(
        document.getElementById(`orderAmount${index}`).value
      );
      this.totalAmount = this.totalAmount + inputAmount;
      this.totalPrice = this.totalPrice + item.servicePrice * inputAmount;

      if (this.orders.length == 0) {
        this.orders.push({
          id: item.serviceID,
          name: item.name,
          amount: inputAmount,
          price: item.servicePrice,
          totalPrice: inputAmount * item.servicePrice,
        });
      } else {
        for (var i = 0; i < this.orders.length; i++) {
          if (item.serviceID == this.orders[i].id) {
            var amount_order = 0;
            var amount_item = 0;

            // Update Amount
            amount_order = Number(this.orders[i].amount);
            amount_item = Number(inputAmount);
            this.orders[i].amount = amount_order + amount_item;

            // Update Total Price
            item.totalPrice = this.orders[i].amount * item.servicePrice;
            this.orders[i].totalPrice = item.totalPrice;

            // Already have
            check = false;
          }
        }
        if (check == true) {
          this.orders.push({
            id: item.serviceID,
            name: item.name,
            amount: inputAmount,
            price: item.servicePrice,
            totalPrice: inputAmount * item.servicePrice,
          });
        }
      }
    },

    removeOrder(order, index) {
      const inputAmount = Number(
        document.getElementById(`orderAmount${index}`).value
      );
      this.totalAmount = this.totalAmount - inputAmount;
      this.totalPrice = this.totalPrice - order.price * inputAmount;
      this.orders.splice(index, 1);
    },

    clearBasket() {
      this.roomID = "";
      this.orders = [];
      this.getAllService();
    },

    loopInsert() {
      var i = 0;

      while (i < this.orders.length) {
        this.serviceID_insert = this.orders[i].id;
        this.amount_insert = this.orders[i].amount;
        this.total_insert = this.orders[i].totalPrice;
        this.confirmService();
        i++;
      }
    },

    confirmService() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_orderServiceMaid.php", {
          action: "confirmService",
          serviceID: this.serviceID_insert,
          amount: this.amount_insert,
          total: this.total_insert,
          roomID: this.roomID,
        })
        .then(
          function(res) {
            console.log(res.data);
            if (res.data.success == true) {
              this.count_success++;
              if (this.count_success == this.orders.length) {
                alert(res.data.message);
                this.search = "";
                this.clearBasket();
              }
            } else {
              this.count_fail++;
              if (this.count_fail == this.orders.length) {
                alert(res.data.message);
                this.clearBasket();
              }
            }
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
}
p {
  margin-right: 20px;
}
input {
  width: 180px;
  height: 30px;
  padding-left: 10px;
  color: var(--header-color);
  font-size: 16px;
  z-index: 0;
}
i {
  color: #5f5f5f;
}
.search-container {
  position: relative;
}
.fa-search {
  position: absolute;
  z-index: 5;
  margin: 7px 0 0 12px;
  font-size: 16px;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 35px;
  font-size: 16px;
  outline: none;
  z-index: 1;
  border: 1px solid var(--light-grey);
  border-radius: 50px;
  margin-right: 20px;
  position: relative;
}
.search-table {
  width: 100%;
  height: 220px;
  max-width: 1000px;
  border-collapse: collapse;
  margin: 10px;
  position: relative;
}
th {
  height: 35px;
  text-align: center;
  border-bottom: 1px solid black;
}
td {
  height: 35px;
  width: 80px;
  text-align: center;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
.summary-row {
  height: 50px;
  border-top: 2px solid var(--light-grey);
}
.add-amount {
  width: 50px;
  height: 20px;
  font-size: 16px;
  text-align: center;
}
.orders {
  width: 100%;
  max-width: 1000px;
  border-collapse: collapse;
  margin-top: 20px;
  border: 1px solid black;
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
.fa-trash:hover {
  color: var(--primary-blue);
}
.buttons {
  margin: 0 auto;
  padding-top: 20px;
}
@media (max-width: 700px) {
  p {
    font-size: 14px;
  }
  input {
    font-size: 14px;
    width: 130px;
    height: 25px;
  }
  .search-field {
    width: 150px;
    font-size: 14px;
  }
  .search-table {
    font-size: 14px;
  }
  .add-amount {
    width: 40px;
    font-size: 14px;
  }
  .orders {
    font-size: 14px;
  }
}
</style>
