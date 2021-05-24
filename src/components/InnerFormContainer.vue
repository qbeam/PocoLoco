<template>
  <div class="form">
    <div class="inner-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "InnerFormContainer",
  };
</script>

<style>
  .form {
    width: 80%;
    align-self: center;
    height: auto;
    margin-top: 30px;
    background-color: white;
  }
  .inner-container {
    padding: 40px 90px;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 768px) {
    .inner-container {
      padding: 40px;
    }
  }
</style>
