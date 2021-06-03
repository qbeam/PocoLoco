<template>
  <div>
    <Navbar />
    <div class="page-container">
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
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 60px 0 260px;
  overflow: scroll;
}
@media (max-width: 1000px) {
  .page-container {
    padding: 0 20px 0 80px;
  }
}
</style>
