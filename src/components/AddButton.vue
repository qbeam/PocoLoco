<template>
  <button class="add-button">
    <span :style="{ color: 'white' }">
      <i class="fa fa-plus fa-3x"></i>
    </span>
  </button>
</template>

<script>
export default {
  name: "AddButton",
};
</script>

<style scoped>
.add-button {
  width: 55px;
  height: 55px;
  border-radius: 50px;
  background: var(--button-blue);
  outline: none;
  border: none;
  align-items: center;
}
.add-button:hover {
  cursor: pointer;
  opacity: 0.7;
}
i {
  margin-top: 4px;
}
@media (max-width: 700px) {
  .add-button {
    width: 45px;
    height: 45px;
    margin-top: 5px;
  }
  i {
    margin-top: 3px;
  }
}
</style>
