<template>
  <div class="dropdown-container">
    <p v-if="type == 'Filter'">Search by</p>
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
        <i
          class="fa fa-caret-down fa-2x"
          :style="type == 'Transparent' ? { color: 'var(--button-blue)' } : {}"
        ></i>
      </div>
    </div>
    <div
      class="dropdown-list"
      v-if="dropdownVisible"
      :style="type == 'Transparent' ? { width: '74px' } : {}"
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
    props: ["type", "options"],
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
        label: null,
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
      if (this.type == "Transparent") {
        this.dropdownType = "transparent-dropdown";
        this.dropdownLabel = "transparent-label";
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
  .transparent-label {
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
