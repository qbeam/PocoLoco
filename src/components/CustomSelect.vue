<template>
  <div class="dropdown-container">
    <p v-if="type == 'Filter'">Search by</p>
    <p v-if="type == 'Year'">Year</p>
    <div
      :class="dropdownType"
      @click="showDropdown"
      :style="
        dropdownVisible && type !== 'Transparent'
          ? { borderBottom: '2px solid white' }
          : {}
      "
    >
      <div class="button-content">
        <label :class="dropdownLabel">{{ label ? label : options[0] }}</label>
        <i class="fa fa-caret-down fa-2x" :style="{ color: arrowColor }"></i>
      </div>
    </div>
    <div
      class="dropdown-list"
      v-if="dropdownVisible"
      :style="{ width: optionsWidth }"
    >
      <div
        class="option-item"
        v-for="(option, i) in options"
        :key="i"
        @click="handleSelect(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
import { useScreenWidth } from "../composables/useScreenWidth";
export default {
  name: "CustomSelect",
  props: ["type", "options", "defaultChoice"],
  setup() {
    const { width } = useScreenWidth();
    return width;
  },
  data() {
    return {
      dropdownType: "default-dropdown",
      dropdownLabel: "default-label",
      optionStyle: "default-list",
      dropdownVisible: false,
      selection: null,
      label: this.options[0],
      arrowColor: "white",
      optionsWidth: "120px",
    };
  },
  methods: {
    showDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleSelect(selected) {
      this.selection = selected;
      this.label = selected;
      this.dropdownVisible = !this.dropdownVisible;
      this.$emit("selection", this.selection);
    },
  },
  mounted() {
    if (this.defaultChoice) {
      this.label = this.defaultChoice;
    }
    if (this.type == "Transparent" || this.type == "Year") {
      this.dropdownType = "transparent-dropdown";
      this.dropdownLabel = "dark-label";
      this.arrowColor = "var(--button-blue)";
      this.optionsWidth = "74px";
    } else if (this.type == "Grey") {
      this.dropdownType = "grey-dropdown";
      this.dropdownLabel = "dark-label";
      this.arrowColor = "var(--button-blue)";
      this.optionsWidth = "150px";
    }
  },
};
</script>

<style scoped>
.dropdown-container {
  margin-top: -22px;
  position: relative;
}
p {
  margin: 0;
}
.default-dropdown {
  width: 120px;
  height: 30px;
  background: var(--primary-blue);
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}
.transparent-dropdown {
  width: 70px;
  height: 25px;
  background: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 2px solid var(--button-blue);
  cursor: pointer;
}
.grey-dropdown {
  width: 150px;
  height: 40px;
  background: #eeeeee;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  cursor: pointer;
}
.button-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.default-label {
  color: white;
  padding-left: 5px;
  z-index: 1;
}
.dark-label {
  color: var(--grey-text);
  margin: 0 auto;
}
i {
  color: white;
  font-size: 24px;
  margin-right: 5px;
}
.dropdown-list {
  width: 120px;
  max-height: 100px;
  overflow-y: auto;
  background: var(--primary-blue);
  align-self: flex-start;
  z-index: 30;
  position: absolute;
}
.option-item {
  height: 30px;
  display: flex;
  align-items: center;
  color: white;
  padding-left: 5px;
  cursor: pointer;
}
.option-item:hover {
  background: var(--button-blue);
}
@media (max-width: 700px) {
  .dropdown-button {
    width: 100px;
  }
  label {
    font-size: 14px;
  }
  i {
    font-size: 18px;
    margin-right: 5px;
  }
  .dropdown-list {
    width: 100px;
  }
  .option-item {
    font-size: 14px;
  }
}
</style>
