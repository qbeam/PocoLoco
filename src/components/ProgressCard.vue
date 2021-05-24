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
  width: 175px;
  height: 95px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 4px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.card-content {
  display: flex;
}
.card-icon {
  display: flex;
  width: 30%;
  justify-content: center;
}
img {
  align-self: center;
}
b {
  font-size: 10px;
  color: var(--grey-text);
}
p {
  font-size: 14px;
  margin: 0;
  color: var(--text-color);
}
.progress-bar {
  width: 100px;
  height: 4px;
  background: #c7c7c7;
  border-radius: 50px;
  margin: 5px 0 -5px 0;
}
.progress {
  width: 100px;
  height: 100%;
  border-radius: 5px;
  transition: width 2s ease;
}
.vl {
  width: 90%;
  height: 1px;
  background: #b0b0b0;
  align-self: center;
  margin-bottom: 3px;
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
</style>
