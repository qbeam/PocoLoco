<template>
  <div>
    <Navbar />
    <div class="inner-container">
      <slot />
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
export default {
  components: { Navbar },
};
</script>

<style scoped>
.inner-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 60px 0 260px;
  overflow: scroll;
}
@media (max-width: 1000px) {
  .inner-container {
    padding: 0 20px 0 80px;
  }
}
</style>
