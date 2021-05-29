<template>
  <button :class="customClass">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "DefaultButton",
  props: ["type"],
  data() {
    return {
      customClass: "default-button-style",
    };
  },
  mounted() {
    if (this.type === "small") {
      this.customClass = "small-button-style";
    } else if (this.type == "transparent") {
      this.customClass = "transparent-button";
    }
  },
};
</script>

<style>
.default-button-style {
  height: 50px;
  width: 190px;
  font-size: 20px;
  background: var(--button-blue);
  color: white;
  border: none;
  outline: none;
}
.default-button-style:hover {
  cursor: pointer;
  opacity: 0.7;
}
.transparent-button {
  height: 50px;
  width: 190px;
  font-size: 20px;
  background: none;
  color: #777777;
  border: 2px solid #777777;
  outline: none;
  cursor: pointer;
}
.transparent-button:hover {
  border: 4px solid #777777;
  font-weight: bold;
}
.small-button-style {
  height: 30px;
  width: 110px;
  font-size: 14px;
  background: var(--button-blue);
  color: white;
  font-weight: bold;
  border: none;
  outline: none;
}
.small-button-style:hover {
  cursor: pointer;
  opacity: 0.7;
}
*:focus {
  outline: 0;
}
@media (max-width: 768px) {
  .default-button-style {
    height: 40px;
    width: 120px;
    font-size: 16px;
  }
  .transparent-button {
    height: 40px;
    width: 120px;
    font-size: 16px;
  }
}
</style>
