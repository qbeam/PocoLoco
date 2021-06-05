<template>
  <TablePage>
    <h3>Payment</h3>
    <div>
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

    <div class="inner-container">
      <AllPayment v-if="selected == menus[0]" />
      <DepositPay v-if="selected == menus[1]" />
      <CheckOutPay v-if="selected == menus[2]" />
    </div>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage.vue";
import AllPayment from "../components/PaymentPages/AllPayment";
import DepositPay from "../components/PaymentPages/DepositPay";
import CheckOutPay from "../components/PaymentPages/CheckOutPay";
import Mixins from "../Mixins";

const menus = ["All Payment", "Pay Deposit", "Check Out"];
export default {
  name: "Payment",
  components: {
    TablePage,
    AllPayment,
    DepositPay,
    CheckOutPay,
  },
  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userDepartment") !== "Receptionist"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    }
  },
  data() {
    return {
      menus,
      selected: menus[0],
    };
  },
  methods: {
    selectMenu(menu) {
      this.selected = menu;
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.menu-button {
  width: 150px;
  height: 35px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-color);
}
.inner-container {
  display: flex;
  height: fit-content;
  margin-bottom: 50px;
  padding: 35px 30px;
  background: white;
}
@media (max-width: 1000px) {
  h3 {
    margin: 40px 0 20px 0;
  }
}
@media (max-width: 700px) {
  h3 {
    font-size: 44px;
    margin: 20px 0;
    padding: 0;
  }
  .inner-container {
    margin-bottom: 20px;
  }
  .menu-button {
    width: 100px;
    height: 35px;
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
