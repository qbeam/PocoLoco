<template>
  <div
    class="container"
    :style="width > 1000 ? { padding: '0 100px 0 250px' } : {}"
  >
    <slot></slot>
  </div>
</template>

<script>
import { useScreenWidth } from "../composables/useScreenWidth";
export default {
  name: "Container",
  setup() {
    const { width } = useScreenWidth();
    return { width };
  },
};
</script>

<style>
.container {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100%;
  margin: 0 auto;
  padding: 0 100px;
  flex-wrap: wrap;
  background: #f8f8f8;
}
@media (max-width: 700px) {
  .container {
    padding: 0 80px;
  }
}
</style>
