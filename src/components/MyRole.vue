<template>
  <div class="head">
    <b style="font-size: 20px">My Role</b>
    <hr />
  </div>
  <div class="information">
    <b>Role</b>
    <p>{{ sampleRole.role }}</p>
    <b>Salary</b>
    <p>{{ sampleRole.salary }}</p>
    <div class="group-row">
      <div class="group-item">
        <b>Start date</b>
        <p>{{ sampleRole.startDate }}</p>
        <b>Working time</b>
        <p>{{ sampleRole.shift }}</p>
      </div>
      <div class="group-item">
        <b>Department</b>
        <p>{{ sampleRole.department }}</p>
        <b>Bonus Rate</b>
        <p>{{sampleRole.bonus}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyRole",
  data() {
    return {
      sampleRole: {
        role: "Manager",
        salary: 30000,
        startDate: "11/11/2005",
        department: "Reception",
        shift: "05:00 - 13:00",
        bonus: 0.5,
      },
    };
  },
};
</script>

<style scoped>
b {
  font-size: 18px;
}
p {
  margin-top: 3px;
}
hr {
  margin-bottom: 25px;
}
.information {
  font-size: 20px;
}
.group-row {
  display: flex;
}
.group-item {
  display: flex;
  flex-direction: column;
  width: 50%;
}
</style>