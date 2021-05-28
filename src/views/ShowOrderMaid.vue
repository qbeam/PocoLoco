<template>
  <h1 align="center">Show Order Maid</h1>

  <table>
    <thead>
      <tr>
        <th>Room Number</th>
        <th>Name</th>
        <th>Amount</th>
        <th>Manage</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(order, index) in order_db" v-bind:key="index">
        <td>{{ order.roomID }}</td>
        <td>{{ order.serviceName }}</td>
        <td>{{ order.amount }}</td>
        <td>
          <button @click="finishOrderMaid(order)">OK</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import DefaultButton from "../components/DefaultButton";
import { useScreenHeight } from "../composables/useScreenHeight";
import { useScreenWidth } from "../composables/useScreenWidth";
import PaginationBar from "../components/PaginationBar";
import SearchError from "../components/SearchError";
import axios from "axios";

export default {
  name: "ShowOrderMaid",
  components: { DefaultButton, PaginationBar, DefaultButton },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      order_db: "",
      check: false,
    };
  },
  created() {
    this.getOrderMaid();
  },

  methods: {
    getOrderMaid() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_showOrderMaid.php", {
          action: "getAll",
        })
        .then(
          function(res) {
            this.order_db = res.data;
            console.log(res);
          }.bind(this)
        );
    },

    finishOrderMaid(order) {
      if (
        confirm(
          "Are you done " + order.serviceName + " of Room " + order.roomID + "?"
        )
      ) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_showOrderMaid.php", {
            action: "finishOrderMaid",
            DATETIME: order.DATETIME,
            serviceID: order.serviceID,
            roomID: order.roomID,
            serviceName: order.serviceName,
            STATUS: order.STATUS,
          })
          .then(
            function(res) {
              console.log(res.data);
              if (res.data.success == true) {
                this.getOrderMaid();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },
  },
};
</script>
