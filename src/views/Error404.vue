<template>
  <div class="container">
    <div class="image">
      <img src="../assets/error.png" />
    </div>
    <h1>Sorry, but this page doesn’t exist.</h1>
    <p>Maybe you would like to go back to our <a href="/"> Login</a></p>
  </div>
</template>

<script>
export default {
  name: "Error404",
};
</script>

<style scoped>
.container {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 200px;
  align-self: center;
  margin-bottom: 20px;
}
p {
  margin-top: 0;
}
@media (max-width: 550px) {
  h1 {
    font-size: 24px;
  }
  p {
    font-size: 14px;
  }
}
</style>
