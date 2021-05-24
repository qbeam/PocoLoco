<template>
  <div class="background" v-if="visible">
    <div class="box" v-bind:style="buttons ? {} : { paddingTop: '10px' }">
      <div class="exit-button" @click="returnPop()">
        <buttons class="exit-icon">
          <i class="fa fa-times fa-1x"></i>
        </buttons>
      </div>
      <slot></slot>
      <div class="buttons" v-show="buttons">
        <DefaultButton
          :style="{
            height: '40px',
            width: '110px',
            background: 'none',
            marginRight: '40px',
            border: '3px solid #777777',
            color: '#777777',
            fontSize: '15px',
          }"
          @click="returnPop()"
          >CANCEL</DefaultButton
        >
        <DefaultButton
          :style="{
            height: '40px',
            width: '110px',
            background: 'var(--primary-yellow)',
            fontSize: '15px',
          }"
          @click="submit()"
          >SAVE</DefaultButton
        >
      </div>
    </div>
  </div>
</template>

<script>
import DefaultButton from "../components/DefaultButton.vue";
export default {
  name: "Popup",
  props: ["visible", "buttons"],
  components: { DefaultButton },
  methods: {
    returnPop() {
      this.$emit("popReturn", false);
      close();
    },
    submit() {
      this.$emit("submit", false);
      close();
    },
    close() {
      this.$destroy();
      this.$el.parentNode.removeChild(this.$el);
    },
  },
};
</script>

<style scoped>
.background {
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 100;
  margin-left: -260px;
}
.box {
  width: 500px;
  max-height: 450px;
  background-color: white;
  z-index: 10;
  border-radius: 24px;
  padding: 40px 50px;
  overflow-y: auto;
}
.exit-button {
  width: 530px;
  display: flex;
  justify-content: flex-end;
}
.exit-icon:hover {
  cursor: pointer;
  color: var(--primary-blue);
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 30px;
}
@media (max-width: 1000px) {
  .background {
    margin-left: -80px;
  }
  .box {
    width: 400px;
  }
  .exit-button {
    width: 430px;
  }
}
@media (max-width: 700px) {
  .box {
    width: 300px;
  }
  .exit-button {
    width: 330px;
  }
}
</style>
