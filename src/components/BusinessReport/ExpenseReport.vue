<template>
  <div class="chart-container">
    <p class="report-head">
      Monthly expenses
    </p>
    <div class="vl"></div>
    <div class="list">
      <div class="expense-item" v-for="(expense, i) in expenseSum" :key="i">
        <img src="../../assets/expense.png" />
        <div>
          <p :style="{ fontWeight: 'bold' }">{{ expense.type }}</p>
          <p class="amount">{{ expense.amount }} ฿</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const expenseSum = [
  { type: "Electricity Bill", amount: 1200000 },
  { type: "Kitchen", amount: 3200000 },
  { type: "Laundry", amount: 800000 },
  { type: "Maintenance", amount: 2993578 },
  { type: "Security", amount: 800000 },
  { type: "Others", amount: 50000 },
];
export default {
  name: "ExpenseReport",
  data() {
    return {
      expenseSum,
    };
  },
};
</script>

<style scoped>
.chart-container {
  width: 30%;
  height: 275px;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.report-head {
  font-size: 16px;
}
.list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
p {
  margin-left: 15px;
  font-size: 14px;
  color: var(--grey-text);
}
.vl {
  width: 100%;
  height: 1px;
  background: var(--grey-highlight);
}
.expense-item {
  width: 90%;
  display: flex;
  align-self: center;
  border-bottom: 1px solid var(--grey-highlight);
}
img {
  width: 30px;
  height: 30px;
  align-self: center;
}
.amount {
  margin: -10px 0 10px 15px;
  font-size: 12px;
}
@media (max-width: 750px) {
  .chart-container {
    width: 42%;
    height: 250px;
    margin: 25px auto;
  }
  p {
    margin: 10px 0 10px 15px;
    font-size: 14px;
    color: var(--grey-text);
  }
}
</style>
