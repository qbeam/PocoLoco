<template>
  <div class="header">
    <h4>My Role</h4>
  </div>

  <h5>Role</h5>
  <p>{{ role }}</p>

  <h5>Salary</h5>
  <p>{{ salary }}</p>

  <div class="group">
    <div class="group-item">
      <h5>Start Date</h5>
      <p>{{ start }}</p>
    </div>
    <div class="group-item">
      <h5>Department</h5>
      <p>{{ dept }}</p>
    </div>
  </div>

  <div class="group">
    <div class="group-item">
      <h5>Working Time</h5>
      <p>{{ shift }}</p>
    </div>
    <div class="group-item">
      <h5>Bonus Rate</h5>
      <p>{{ bonus }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyRole",

  data() {
    return {
      role: "Manager",
      salary: "30000",
      start: "2000/10/01",
      dept: "Reception",
      shift: "05:000 - 13:00",
      bonus: "0.15",
    };
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e5e5e5;
}
h5 {
  margin: 30px 0 0 0;
}
.group {
  display: flex;
}
.group-item {
  width: 40%;
}

@media (max-width: 750px) {
  .group {
    flex-direction: column;
  }
}
</style>
