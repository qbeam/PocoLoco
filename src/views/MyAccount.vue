<template>
  <TablePage>
    <h3>My Account</h3>
    <div>
      <button
        class="menu-button"
        v-for="(menu, i) in menus"
        :key="i"
        @click="selectMenu(menu)"
        :style="
          menu == selected
            ? { borderBottom: '5px solid var(--primary-blue)' }
            : {}
        "
      >
        {{ menu }}
      </button>
    </div>

    <div class="inner-container">
      <MyProfile v-if="selected == menus[0]" />
      <MyRole v-if="selected == menus[1]" />
    </div>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage.vue";
import MyProfile from "../components/MyProfile.vue";
import MyRole from "../components/MyRole.vue";

const menus = ["My Profile", "My Role"];

export default {
  name: "MyAccount",
  components: {
    TablePage,
    MyProfile,
    MyRole,
  },
  data() {
    return {
      menus,
      selected: menus[0],
    };
  },
  methods: {
    selectMenu(menu) {
      this.selected = menu;
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.countQuery {
  display: inline-block;
  font-size: 25px;
}
.menu-button {
  width: 200px;
  height: 35px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-color);
}
.inner-container {
  display: flex;
  height: 100%;
  margin-bottom: 50px;
  padding: 35px 30px;
  background: white;
}
@media (max-width: 1000px) {
  h3 {
    margin: 40px 0 20px 0;
  }
}
@media (max-width: 700px) {
  .inner-container {
    margin-bottom: 20px;
  }
  .menu-button {
    width: 100px;
    height: 35px;
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>