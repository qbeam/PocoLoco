<template>
  <div class="warning">
    <img src="../assets/noOrderChef.png" />
    <h2>There is no current order</h2>
  </div>
</template>

<script>
export default {
  name: "NoOrderChef",
};
</script>

<style scoped>
.warning {
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  align-self: center;
  margin: 150px;
}
img {
  width: 220px;
}
h2 {
  margin: 20px 0 5px 0;
  color: var(--primary-red);
  font-size: 24px;
}
p {
  margin: 0;
  font-size: 18px;
}
</style>
