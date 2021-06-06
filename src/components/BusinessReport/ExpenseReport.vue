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
          <p :style="{ fontWeight: 'bold' }">{{ setExpense(expense.type) }}</p>
          <p class="amount">{{ expense.expense }} ฿</p>
        </div>
      </div>
    </div>
    <div class="error-img">
      <img src="../../assets/search-icon.png" v-if="errorSearching" />
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ExpenseReport",
  data() {
    return {
      errorSearching: false,
      expenseSum: [],
      date: "",
      day: "",
      month: "",
      year: "",
    };
  },
  created() {
    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.getDate();
  },
  methods: {
    getDate() {
      if (this.day < 10) {
        this.day = "0" + this.day;
      }
      if (this.month < 10) {
        this.month = "0" + this.month;
      }
      this.date = this.year + "-" + this.month;
      this.getExpense();
    },
    getExpense() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_businessAnalysis.php", {
          action: "getMontlyExpenses",
          date: this.date,
        })
        .then(
          function(res) {
            if (res.data == "") {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
              console.log(res.data);
              for (var i = 0; i < res.data.length; i++) {
                this.expenseSum.push(res.data[i]);
              }
            }
          }.bind(this)
        );
    },
    setExpense(data) {
      var expenseName = "";

      if (data == "1") {
        expenseName = "Housekeeping";
      } else if (data == "2") {
        expenseName = "Kitchen";
      } else if (data == "3") {
        expenseName = "Maintenance";
      } else if (data == "4") {
        expenseName = "Electricity";
      } else if (data == "5") {
        expenseName = "Water";
      } else if (data == "6") {
        expenseName = "Advertisement";
      } else if (data == "7") {
        expenseName = "Entertainment";
      } else if (data == "8") {
        expenseName = "Others";
      }

      return expenseName;
    },
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
