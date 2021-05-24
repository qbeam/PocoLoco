<template>
  <div class="warning">
    <img src="../assets/search-icon.png" />
    <h2>No result found</h2>
    <p>Try different key words or different filter</p>
  </div>
</template>

<script>
export default {
  name: "SearchError",
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
  margin: auto 0;
}
img {
  width: 140px;
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
