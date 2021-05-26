<template>
  <div>
    <button>
      <i :class="arrow" :style="{ color: color }" @click="toggleDirection()" />
    </button>
  </div>
</template>

<script>
  const up = "fa fa-caret-up";
  const down = "fa fa-caret-down";
  const blue = "#0A96B7";
  const grey = "#8c8c8c";
  
  export default {
    name: "SortingArrow",
    props: ["active", "firstClick"],
    data() {
      return {
        arrow: down,
        color: "#8c8c8c",
      };
    },
    created() {
      if (this.active) {
        this.color = blue;
      }
    },
    watch: {
      active: function() {
        if (this.active) {
          this.color = blue;
        } else {
          this.color = grey;
          this.arrow = down;
        }
      },
    },
    methods: {
      toggleDirection() {
        if (this.arrow == up) {
          this.arrow = down;
          this.$emit("sortReturn", "down");
        } else if (this.arrow == down) {
          this.arrow = up;
          this.$emit("sortReturn", "up");
        }
      },
    },
  };
</script>

<style scoped>
  button {
    border: none;
    cursor: pointer;
  }
  i {
    color: #8c8c8c;
  }
  .fa-caret-up,
  .fa-caret-down {
    font-size: 24px;
  }
  @media (max-width: 750px) {
    .fa-caret-up,
    .fa-caret-down {
      font-size: 20px;
    }
  }
</style>
