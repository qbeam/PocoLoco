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
      <ExpenseReport />
    </div>
    <div class="row">
      <BarChart type="guest" />
      <BarChart type="room" />
    </div>
    <div class="row">
      <PieChart />
      <PieChart />
    </div>
    <div class="row">
      <BookingReport />
      <LateEmployee />
      <AbsentReport />
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
    data() {
      return {
        earningAmount: 100000,
        earningProgress: 100,
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
      margin: 10px;
    }
  }
  @media (max-width: 550px) {
    .row {
      margin: 10px 5px;
    }
  }
</style>
