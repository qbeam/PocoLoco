<template>
  <FormContainer>
    <div class="form-header">
      <h2>Add New Role</h2>
    </div>

    <InnerFormContainer>
      <div class="input-row">
        <!-- Department -->
        <div v-if="departmentError">
          <h4>Department</h4>
          <select
            :style="{ width: '300px', marginRight: '180px' }"
            v-model="details.departmentID"
          >
            <option value="" disabled selected>Select</option>
            <option value="1">Admin/Owner</option>
            <option value="2">Receptionist</option>
            <option value="3">Kitchen</option>
            <option value="4">Housekeeping</option>
            <option value="5">Security</option>
            <option value="6">Accounts and Credits</option>
            <option value="7">Maintenance</option>
          </select>
        </div>

        <!-- Department Error -->
        <div v-else>
          <h4 style="color:red">Department</h4>
          <select
            :style="{ width: '300px', marginRight: '180px' }"
            v-model="details.departmentID"
          >
            <option value="" disabled selected>Select</option>
            <option value="1">Admin/Owner</option>
            <option value="2">Receptionist</option>
            <option value="3">Kitchen</option>
            <option value="4">Housekeeping</option>
            <option value="5">Security</option>
            <option value="6">Accounts and Credits</option>
            <option value="7">Maintenance</option>
          </select>
        </div>

        <!-- Role Name -->
        <div v-if="roleNameError">
          <h4>Role Name</h4>
          <input
            name="roleName"
            type="text"
            v-model="details.roleName"
            placeholder="ex. Manager"
            pattern="[a-zA-Z]+"
            oninvalid="alert('Please enter a valid Role Name (only characters)')"
            required
          />
        </div>
        <!-- Role Name Error-->
        <div v-else>
          <h4 style="color:red">Role Name</h4>
          <input
            name="roleName"
            type="text"
            v-model="details.roleName"
            placeholder="ex. Manager"
            pattern="[a-zA-Z]+"
            oninvalid="alert('Please enter a valid Role Name (only characters)')"
            required
          />
        </div>
      </div>

      <div class="input-row">
        <!-- salary -->
        <div v-if="salaryError">
          <h4>Salary</h4>
          <div class="input-row">
            <div :style="{ display: 'flex', flexDirection: 'row' }">
              <input
                type="number"
                :style="{ marginRight: '10px' }"
                v-model="details.salary"
                onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
                placeholder="20000"
                min="0"
                oninvalid="alert('Please enter a valid Salary')"
                required
              />
              <p class="unit">Baht/month</p>
            </div>
          </div>
        </div>
        <!-- salary Error-->
        <div v-else>
          <h4 style="color:red">Salary</h4>
          <div class="input-row">
            <div :style="{ display: 'flex', flexDirection: 'row' }">
              <input
                type="number"
                :style="{ marginRight: '10px' }"
                v-model="details.salary"
                onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
                placeholder="20000"
                min="0"
                oninvalid="alert('Please enter a valid Salary')"
                required
              />
              <p class="unit">Baht/month</p>
            </div>
          </div>
        </div>

        <!-- Bonus Rate -->
        <div v-if="bonusRateError">
          <h4>% Bonus Rate</h4>
          <input
            type="number"
            :style="{ width: '150px' }"
            v-model="details.bonusRate"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            placeholder="0 - 100"
            step="0.01"
            min="0"
            oninvalid="alert('Please enter a valid Bonus Rate')"
            required
          />
        </div>
        <!-- Bonus Rate Error-->
        <div v-else>
          <h4 style="color:red">% Bonus Rate</h4>
          <input
            type="number"
            :style="{ width: '150px' }"
            v-model="details.bonusRate"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            placeholder="0 - 100"
            step="0.01"
            min="0"
            oninvalid="alert('Please enter a valid Bonus Rate')"
            required
          />
        </div>
      </div>
    </InnerFormContainer>
    <div class="buttons">
      <DefaultButton
        :style="{
          background: 'none',
          marginRight: '110px',
          border: '3px solid white',
        }"
        @click="backToRolePage"
        >CANCEL</DefaultButton
      >
      <DefaultButton @click="addRoleFn">ADD</DefaultButton>
    </div>
  </FormContainer>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import axios from "axios";

export default {
  name: "AddRole",
  components: { FormContainer, DefaultButton, InnerFormContainer },
  data() {
    return {
      message: "Add New Role",
      departmentError: true,
      roleNameError: true,
      salaryError: true,
      bonusRateError: true,
      check: false,

      details: {
        departmentID: "",
        roleName: "",
        salary: "",
        bonusRate: "",
      },
      selected: "role",
    };
  },
  created() {
    if (localStorage.getItem("userRole") !== "Owner" && localStorage.getItem("userRole") !== "Admin") {
      this.$router.push("/Home")
      alert("You don't have permission to access this page")
    }
  },
  methods: {
    backToRolePage() {
      this.$router.push("/Employee");
    },
    fetch() {
      axios
        .get("http://localhost:8080/PocoLoco_db/api_addRole.php")
        .then((response) => {
          console.log("SUCCESS");
        })
        .catch(() => {
          console.log("ERROR");
        });
    },
    validateCheck() {
      if (this.details.departmentID == "") {
        this.departmentError = false;
      }
      if (this.details.departmentID != "") {
        this.departmentError = true;
      }
      if (this.details.roleName == "") {
        this.roleNameError = false;
      }
      if (this.details.roleName != "") {
        this.roleNameError = true;
      }
      if (this.details.salary == "") {
        this.salaryError = false;
      }
      if (this.details.salary != "") {
        this.salaryError = true;
      }
      if (this.details.bonusRate == "") {
        this.bonusRateError = false;
      }
      if (this.details.bonusRate != "") {
        var bonus = 0;
        bonus = Number(this.details.bonusRate);
        if (bonus < 0 || bonus > 100) {
          // console.log(bonus);
          this.bonusRateError = false;
        } else {
          this.bonusRateError = true;
        }
      }

      this.check =
        this.departmentError &&
        this.roleNameError &&
        this.salaryError &&
        this.bonusRateError;
    },
    addRoleFn() {
      this.validateCheck();
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addRole.php", {
            action: "addRole",
            departmentID: this.details.departmentID,
            roleName: this.details.roleName,
            salary: this.details.salary,
            bonusRate: this.details.bonusRate,
          })
          .then(
            function(res) {
              alert(res.data.message);
              this.backToRolePage();
            }.bind(this)
          );
      }
    },
  },
};
</script>

<style scoped>
.form-header {
  padding: 90px 0 10px 10%;
}
h2 {
  color: white;
  font-size: 36px;
  margin-bottom: 10px;
}
.input-group {
  width: 100%;
  display: flex;
  flex-direction: row;
}
input {
  width: 300px;
  height: 35px;
  margin: 0 80px 40px 0;
  padding-left: 10px;
}
select {
  width: 220px;
  height: 40px;
  margin: 0 180px 30px 0;
  padding-left: 10px;
}
.unit {
  margin-right: 80px;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 45px 0;
}
i {
  color: var(--primary-blue);
  margin: 5px 0 0 -35px;
  padding-right: 240px;
}
*:focus {
  outline: 0;
}
@media (max-width: 1000px) {
  .input-group {
    flex-direction: column;
  }
  .form-header {
    padding: 20px 0 10px 10%;
  }
  .unit {
    margin-right: 0;
  }
}
.unit {
  margin-right: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
