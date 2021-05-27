<template>
  <div class="chart-container">
    <div class="header">
      <p class="title">Booking in</p>
      <CustomSelect
        type="Transparent"
        :options="searchRange"
        @selection="graphRange"
        :style="{ margin: '0 0 0 10px' }"
      />
    </div>

    <div class="seasons">
      <button class="season-button" v-for="(season, i) in seasons" :key="i">
        <div class="head" :style="i % 2 !== 0 ? { background: '#455A64' } : {}">
          <b>{{ season.date }}</b>
          <div class="vl"></div>
          <b>{{ season.month }}</b>
        </div>
        <div class="detail">
          <p>{{ season.name }}</p>
          <h4>{{ season.amount }}</h4>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
  import CustomSelect from "./CustomSelect";

  const seasons = [
    {
      date: "25-27",
      start: "2020-12-25",
      end: "2020-12-27",
      month: "DEC",
      name: "Chirstmas",
      amount: 150,
    },
    {
      date: "12-15",
      month: "FEB",
      name: "Valentines",
      amount: 132,
    },
    {
      date: "10-15",
      month: "AUG",
      name: "Mother's Day",
      amount: 100,
    },
    {
      date: "13-15",
      month: "APR",
      name: "Songkran",
      amount: 90,
    },
    {
      date: "13-15",
      month: "APR",
      name: "Songkran",
      amount: 90,
    },
    {
      date: "13-15",
      month: "APR",
      name: "Songkran",
      amount: 90,
    },
    {
      date: "13-15",
      month: "APR",
      name: "Songkran",
      amount: 90,
    },
    {
      date: "13-15",
      month: "APR",
      name: "Songkran",
      amount: 90,
    },
  ];

  export default {
    name: "BookingReport",
    components: { CustomSelect },
    data() {
      return {
        seasons,
        searchRange: [2021, 2020, 2019, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        displayRange: null,
      };
    },
    methods: {
      graphRange(value) {
        this.displayRange = value;
      },
    },
  };
</script>

<style scoped>
  .chart-container {
    width: 31%;
    height: 300px;
    display: flex;
    flex-direction: column;
    background: white;
    padding: 5px 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    align-items: center;
  }
  .header {
    display: flex;
    align-items: center;
  }
  .title {
    font-size: 16px;
    margin: 10px 0;
  }

  .seasons {
    height: 250px;
    width: 95%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .season-button {
    align-self: center;
    width: 100%;
    display: flex;
    background: #ebebeb;
    margin: 3px 0;
    border-radius: 7px;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .head {
    background: #ff725e;
    width: 30%;
    height: 50px;
    border-radius: 7px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 13px;
  }
  .detail {
    width: 70%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .vl {
    width: 90%;
    height: 1px;
    background: white;
    align-self: center;
    margin: 2px 0;
  }
  p {
    font-size: 12px;
    color: var(--grey-text);
    margin: 2px 0;
  }
  h4 {
    color: var(--grey-text);
    font-size: 16px;
    margin: 0;
  }
  @media (max-width: 750px) {
    .chart-container {
      width: 47%;
    }
  }
</style>
