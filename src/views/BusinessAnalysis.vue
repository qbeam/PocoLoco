<template>
  <TablePage>
    <h3>Business Analysis</h3>

    <div class="cards">
      <div class="card-group">
        <ProgressCard
          title="earning"
          :amount="earningAmount"
          :progress="earningProgress"
        />
        <ProgressCard
          title="booking"
          :amount="bookingAmount"
          :progress="bookingProgress"
        />
      </div>
      <div class="card-group">
        <ProgressCard
          title="order"
          :amount="orderAmount"
          :progress="orderProgress"
        />
        <ProgressCard
          title="customer"
          :amount="customerAmount"
          :progress="customerProgress"
        />
      </div>
    </div>

    <div class="row">
      <ProfitGraph />
    </div>

    <div class="row">
      <BarChart type="cancel" />
      <ExpenseReport v-if="width > 750" />
    </div>

    <div class="row">
      <BarChart type="guest" />
      <div class="subgroup">
        <BarChart
          type="room"
          :style="width > 750 ? {} : { marginTop: '25px' }"
        />
        <ExpenseReport v-if="width <= 750" />
      </div>
    </div>

    <div class="row">
      <PieChart type="service" />
      <PieChart type="food" />
    </div>

    <div class="reports">
      <BookingReport />
      <LateEmployee v-if="width > 750" />
      <AbsentReport />
    </div>
    <div class="row">
      <LateEmployee v-if="width <= 750" />
    </div>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage";
import ProgressCard from "../components/BusinessReport/ProgressCard";
import BookingReport from "../components/BusinessReport/BookingReport";
import BarChart from "../components/BusinessReport/BarChart";
import ExpenseReport from "../components/BusinessReport/ExpenseReport";
import LateEmployee from "../components/BusinessReport/LateEmployee";
import ProfitGraph from "../components/BusinessReport/ProfitGraph";
import AbsentReport from "../components/BusinessReport/AbsentReport";
import PieChart from "../components/BusinessReport/PieChart";
import { useScreenWidth } from "../composables/useScreenWidth";
import axios from "axios";

export default {
  name: "BusinessAnalysis",
  components: {
    TablePage,
    ProgressCard,
    BookingReport,
    BarChart,
    ExpenseReport,
    LateEmployee,
    ProfitGraph,
    AbsentReport,
    PieChart,
  },
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
  data() {
    return {
      earningAmount: 0,
      earningProgress: 0,
      bookingAmount: 0,
      bookingProgress: 0,
      orderAmount: 0,
      orderProgress: 0,
      customerAmount: 0,
      customerProgress: 0,

      lastMEarningAmount: 0,
      lastMBookingAmount: 0,
      lastMOrderAmount: 0,
      lastMCustomerAmount: 0,
      month: "",
      year: "",
      date: "",
      lastMDate: "",
      lastMonth: "",
      lastYear: "",
    };
  },
  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getDate();
    }
  },
  methods: {
    getDate() {
      this.month = new Date().getMonth() + 1;
      this.year = new Date().getFullYear();
      if (this.month == 1) {
        this.lastYear = this.year - 1;
        this.lastMonth = 12;
      } else if (this.month < 10) {
        this.lastMonth = this.month - 1;
        this.lastMonth = "0" + this.lastMonth;
        this.month = "0" + this.month;
      }
      this.lastMDate = this.year + "-" + this.lastMonth;
      this.date = this.year + "-" + this.month;

      this.getTotal();
      this.getBookingAmountNew();
      this.getOrderNew();
      this.getCustomerNew();
    },

    //Earning
    getTotal() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalEarning",
          date: this.lastMDate,
        })
        .then(
          function(res) {
            this.lastMEarningAmount = res.data[0].totalEarning;
            this.getTotalNew();
          }.bind(this)
        );
    },
    getTotalNew() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalEarning",
          date: this.date,
        })
        .then(
          function(res) {
            this.earningAmount = res.data[0].totalEarning;
            this.getEarningProgress();
          }.bind(this)
        );
    },
    getEarningProgress() {
      const getEarningProgress =
        (this.earningAmount / this.lastMEarningAmount) * 100;
      if (getEarningProgress > 100) {
        this.earningProgress = 100;
      } else {
        this.earningProgress = getEarningProgress.toFixed(2);
      }
    },
    //Booking
    getBookingAmountNew() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalBooking",
          date: this.date,
        })
        .then(
          function(res) {
            this.bookingAmount = res.data[0].numBookingDetail;
            this.getBookingAmount();
          }.bind(this)
        );
    },
    getBookingAmount() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalBooking",
          date: this.lastMDate,
        })
        .then(
          function(res) {
            this.lastMBookingAmount = res.data[0].numBookingDetail;
            this.getBookingProgress();
          }.bind(this)
        );
    },
    getBookingProgress() {
      var getBookingProgress = 0;

      getBookingProgress = (this.bookingAmount / this.lastMBookingAmount) * 100;
      if (getBookingProgress > 100) {
        this.bookingProgress = 100;
      } else {
        this.bookingProgress = getBookingProgress.toFixed(2);
      }
    },
    //Order
    getOrderNew() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalOrder",
          date: this.date,
        })
        .then(
          function(res) {
            this.orderAmount = res.data[0].numOrder;
            this.getOrder();
          }.bind(this)
        );
    },
    getOrder() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalOrder",
          date: this.lastMDate,
        })
        .then(
          function(res) {
            this.lastMOrderAmount = res.data[0].numOrder;
            this.getOrderProgress();
          }.bind(this)
        );
    },
    getOrderProgress() {
      var getOrderProgress = 0;
      getOrderProgress = (this.orderAmount / this.lastMOrderAmount) * 100;
      if (getOrderProgress > 100) {
        this.orderProgress = 100;
      } else {
        this.orderProgress = getOrderProgress.toFixed(2);
      }
    },
    //Customer
    getCustomerNew() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalCustomer",
          date: this.date,
        })
        .then(
          function(res) {
            this.customerAmount = res.data[0].numCustomer;

            this.getCustomer();
          }.bind(this)
        );
    },
    getCustomer() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getTotalCustomer",
          date: this.lastMDate,
        })
        .then(
          function(res) {
            this.lastMCustomerAmount = res.data[0].numCustomer;

            this.getCustomerProgress();
          }.bind(this)
        );
    },
    getCustomerProgress() {
      var getCustomerProgress = 0;

      getCustomerProgress =
        (this.customerAmount / this.lastMCustomerAmount) * 100;
      if (getCustomerProgress > 100) {
        this.customerProgress = 100;
      } else {
        this.customerProgress = getCustomerProgress.toFixed(2);
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
.cards {
  display: flex;
  margin-bottom: 10px;
}
.card-group {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.row {
  margin: 10px 5px;
  display: flex;
  justify-content: space-between;
}
.reports {
  margin: 10px 5px;
  display: flex;
  justify-content: space-between;
}
.subgroup {
  display: flex;
  width: 31%;
  justify-content: space-between;
  padding-left: 5px;
}
@media (max-width: 1000px) {
  h3 {
    margin: 40px 0 20px 0;
  }
}
@media (max-width: 750px) {
  .cards {
    flex-direction: column;
    margin: 0;
  }
  .row {
    flex-direction: column;
  }
  .subgroup {
    width: 100%;
    height: 270px;
  }
}
</style>
