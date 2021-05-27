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
          :amount="customerProgress"
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
  import ProgressCard from "../components/ProgressCard";
  import BookingReport from "../components/BookingReport";
  import BarChart from "../components/BarChart";
  import ExpenseReport from "../components/ExpenseReport";
  import LateEmployee from "../components/LateEmployee";
  import ProfitGraph from "../components/ProfitGraph";
  import AbsentReport from "../components/AbsentReport";
  import PieChart from "../components/PieChart";
  import { useScreenWidth } from "../composables/useScreenWidth";

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
      };
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
