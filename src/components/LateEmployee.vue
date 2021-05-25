<template>
  <div class="chart-container">
    <p>Employee Punctuality in xxxx</p>
    <div class="vl"></div>
    <div class="list">
      <div class="item" v-for="(record, i) in lateSummary" :key="i">
        <div class="icon">
          <div class="user-icon">
            <img :src="require(`../assets/${record.role}.png`)" />
          </div>
        </div>

        <div class="detail">
          <p :style="{ fontWeight: 'bold' }">
            {{ record.id }} {{ record.name }}
          </p>
          <div class="item">
            <div class="progress-bar">
              <div class="progress" :style="{ width: record.late + '%' }"></div>
            </div>
            <p class="unit">{{ record.late }}% late</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const lateSummary = [
    { id: 123456, name: "Pungkung Carrot", role: "owner", late: 100 },
    { id: 123456, name: "Pungkung Turtle", role: "receptionist", late: 80 },
    { id: 123456, name: "Pungkung Rabbit", role: "manager", late: 50 },
    { id: 123456, name: "Pungkung Broccolli", role: "maid", late: 30 },
    { id: 123456, name: "Pungkung Baby", role: "owner", late: 10 },
    { id: 123456, name: "Ploypapas Pianchoopat", role: "chef", late: 5 },
    { id: 123456, name: "Supavadee Yingying", role: "receptionist", late: 2 },
  ];
  export default {
    name: "LateEmployee",
    data() {
      return {
        lateSummary,
      };
    },
  };
</script>

<style scoped>
  .chart-container {
    width: 30%;
    height: 310px;
    display: flex;
    flex-direction: column;
    background: white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
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
  .item {
    width: 90%;
    display: flex;
    align-self: center;
    border-bottom: 1px solid var(--grey-highlight);
  }
  .icon {
    width: 20%;
    display: flex;
    justify-content: center;
  }
  .user-icon {
    width: 35px;
    height: 35px;
    background: var(--primary-yellow);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    overflow: hidden;
    align-self: center;
  }
  .detail {
    width: 80%;
  }
  img {
    height: 30px;
    margin-top: 5px;
  }
  .amount {
    margin: -10px 0 10px 15px;
    font-size: 10px;
  }
  .progress-bar {
    width: 50%;
    height: 4px;
    background: #c7c7c7;
    border-radius: 50px;
    margin: -5px 0 10px 15px;
  }
  .progress {
    width: 50%;
    height: 100%;
    border-radius: 5px;
    transition: width 2s ease;
    background: #f2651d;
  }
  .unit {
    margin: -12px 0 0 10px;
    font-size: 10px;
  }
  @media (max-width: 550px) {
    .chart-container {
      width: 100%;
      height: 400px;
      margin: 15px 0;
    }
    .progress-bar {
      width: 60%;
    }
  }
</style>
