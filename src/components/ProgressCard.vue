<template>
  <div class="card-container">
    <div class="card-content">
      <div class="card-icon">
        <img :src="require(`../assets/${title}.png`)" />
      </div>
      <div>
        <b>{{ heading }}</b>
        <p>{{ amount }}</p>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: progress + '%', background: color }"
          ></div>
        </div>
        <b :style="{ fontSize: '8px' }">{{ progress }}%</b>
      </div>
    </div>
    <div class="vl"></div>
    <button class="refresh">
      <i class="fa fa-refresh"></i>
      Update now
    </button>
  </div>
</template>

<script>
  export default {
    name: "ProgressCard",
    props: ["title", "amount", "progress"],
    data() {
      return {
        heading: null,
        text: null,
        percent: 0,
        color: "#ffc42e",
      };
    },
    mounted() {
      if (this.title === "earning") {
        this.heading = "Total Earning";
      }
      if (this.title === "booking") {
        this.heading = "New Booking";
        this.color = "#0A96B7";
      }
      if (this.title === "order") {
        this.heading = "Orders";
        this.color = " #F2651D";
      }
      if (this.title === "customer") {
        this.heading = "New Customer";
        this.color = "  #354579";
      }
    },
  };
</script>

<style scoped>
  .card-container {
    width: 45%;
    height: 100px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 4px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    padding: 5px;
    margin: 0 auto;
  }
  .card-content {
    display: flex;
  }
  .card-icon {
    display: flex;
    width: 30%;
    justify-content: center;
    padding: 5px;
  }
  img {
    align-self: center;
    width: 65%;
  }
  b {
    font-size: 14px;
    color: var(--grey-text);
  }
  p {
    font-size: 18px;
    margin: 0;
    color: var(--text-color);
  }
  .progress-bar {
    width: 130px;
    height: 4px;
    background: #c7c7c7;
    border-radius: 50px;
    margin: 5px 5px 0 0;
  }
  .progress {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    transition: width 2s ease;
  }
  .percent {
    font-size: 10px;
  }
  .vl {
    width: 90%;
    height: 1px;
    background: #b0b0b0;
    align-self: center;
    margin: 3px 0;
  }
  .refresh {
    width: 100px;
    height: 15px;
    display: flex;
    border: none;
    background: none;
    cursor: pointer;
    align-items: center;
    margin-left: 10px;
    font-size: 9px;
  }
  i {
    color: #bdbdbd;
    font-size: 12px;
    margin: 0 10px 0 5px;
  }
  @media (max-width: 1250px) {
    .card-container {
      height: 90px;
    }
    b {
      font-size: 12px;
    }
    .progress-bar {
      width: 100px;
      margin: 5px 5px -5px 0;
    }
    img {
      width: 70%;
    }
    .percent {
      font-size: 8px;
    }
    .vl {
      margin: 0;
    }
  }
  @media (max-width: 750px) {
    .card-container {
      margin: 8px auto;
      height: 100px;
    }
    .vl {
      margin: 5px 0;
    }
    .progress-bar {
      width: 140px;
    }
  }
  @media (max-width: 550px) {
    .progress-bar {
      width: 100px;
    }
  }
</style>
