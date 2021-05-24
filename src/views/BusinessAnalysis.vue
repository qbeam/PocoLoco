<template>
  <TablePage>
    <h3>Business Analysis</h3>
    <div class="cards">
      <ProgressCard title="earning" amount="1,000,000 $" progress="50" />
      <ProgressCard title="booking" amount="30" progress="50" />
      <ProgressCard title="order" amount="20" progress="50" />
      <ProgressCard title="customer" amount="250" progress="50" />
    </div>
    <div class="bottom">
      <ProfitGraph />
    </div>
    <div class="bottom">
      <BarChart type="cancel" />
      <ExpenseReport />
    </div>
    <div class="bottom">
      <BarChart type="guest" />
      <BarChart type="room" />
    </div>
    <div class="bottom">
      <BookingReport />
      <LateEmployee />
      <LateEmployee />
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
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .bottom {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
  }
  @media (max-width: 1000px) {
    h3 {
      margin: 40px 0 20px 0;
    }
  }
</style>
