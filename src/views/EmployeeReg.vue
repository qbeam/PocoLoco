<template>
  <div class="EmployeeReg">
    <FormContainer>
      <div class="form-header">
        <h2>New Employee Registration</h2>
        <b>Please fill out your information below</b>
      </div>

      <InnerFormContainer>
        <div v-if="role == 'Admin' || role == 'Owner'" class="input-group">
          <!-- Department -->
          <div v-if="departmentError">
            <h4>Department</h4>
            <select @change="getRole" v-model="details.department">
              <option value="" disabled selected>Select</option>
              <option value="Admin / Owner">Admin/Owner</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Security">Security</option>
              <option value="Accounts and Credits">Accounts and Credits</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <!-- Department Error-->
          <div v-else>
            <h4 style="color:red">Department</h4>
            <select @change="getRole" v-model="details.department">
              <option value="" disabled selected>Select</option>
              <option value="Admin / Owner">Admin/Owner</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Security">Security</option>
              <option value="Accounts and Credits">Accounts and Credits</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <!-- Role -->
          <div v-if="roleError">
            <h4>Role</h4>
            <select v-model="details.roleID">
              <option value="" disabled selected>Select</option>
              <option
                v-for="(role, index) in roleDB"
                v-bind:key="index"
                :value="role.roleID"
              >
                {{ role.roleName }}
              </option>
            </select>
          </div>
          <!-- Role Error-->
          <div v-else>
            <h4 style="color:red">Role</h4>
            <select v-model="details.roleID">
              <option value="" disabled selected>Select</option>
              <option
                v-for="(role, index) in roleDB"
                v-bind:key="index"
                :value="role.roleID"
              >
                {{ role.roleName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Not Admin / Owner -->
        <div v-else>
          <h4>Department : {{ details.department }}</h4>
          <!-- Role -->
          <div v-if="roleError">
            <h4>Role</h4>
            <select v-model="details.roleID">
              <option value="" disabled selected>Select</option>
              <option
                v-for="(role, index) in roleDB"
                v-bind:key="index"
                :value="role.roleID"
              >
                {{ role.roleName }}
              </option>
            </select>
          </div>
          <!-- Role Error-->
          <div v-else>
            <h4 style="color:red">Role</h4>
            <select v-model="details.roleID">
              <option value="" disabled selected>Select</option>
              <option
                v-for="(role, index) in roleDB"
                v-bind:key="index"
                :value="role.roleID"
              >
                {{ role.roleName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Start Date -->
        <div v-if="startDateError">
          <h4>Start Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="details.startDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="startDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input
                    :value="inputValue"
                    v-on="inputEvents"
                    :style="{ width: '150px', marginRight: '0' }"
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
        <!-- Start Date Error -->
        <div v-else>
          <h4 style="color:red">Start Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="details.startDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="startDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input
                    :value="inputValue"
                    v-on="inputEvents"
                    :style="{ width: '150px', marginRight: '0' }"
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>

        <!-- Shift -->
        <div v-if="shiftError">
          <h4>Shift</h4>
          <select v-model="details.shift">
            <option value="" disabled selected>Select</option>
            <option value="1">05.00 - 13.00</option>
            <option value="2">13.00 - 21.00</option>
            <option value="3">21.00 - 05.00</option>
          </select>
        </div>
        <!-- Shift Error-->
        <div v-else>
          <h4 style="color:red">Shift</h4>
          <select v-model="details.shift">
            <option value="" disabled selected>Select</option>
            <option value="1">05.00 - 13.00</option>
            <option value="2">13.00 - 21.00</option>
            <option value="3">21.00 - 05.00</option>
          </select>
        </div>

        <hr />

        <div class="input-group">
          <!-- First Name -->
          <div v-if="firstNameError">
            <h4>First Name</h4>
            <input
              type="text"
              v-model="details.firstName"
              placeholder="ex. Poco"
            />
          </div>
          <!-- First Name Error-->
          <div v-else>
            <h4 style="color:red">First Name</h4>
            <input
              type="text"
              v-model="details.firstName"
              placeholder="ex. Poco"
            />
          </div>

          <!-- Lastname -->
          <div v-if="lastNameError">
            <h4>Last Name</h4>
            <input
              type="text"
              v-model="details.lastName"
              placeholder="ex. Loco"
            />
          </div>
          <!-- Lastname Error -->
          <div v-else>
            <h4 style="color:red">Last Name</h4>
            <input
              type="text"
              v-model="details.lastName"
              placeholder="ex. Loco"
            />
          </div>
        </div>

        <!-- Identification -->
        <div v-if="identificationError">
          <h4>ID Number</h4>

          <input
            type="number"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            v-model="details.identification"
            pattern="^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$"
          />
        </div>
        <!-- Identification Error-->
        <div v-else>
          <h4 style="color:red">ID Number (13 digits)</h4>
          <input
            type="number"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            v-model="details.identification"
            pattern="^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$"
          />
        </div>

        <div class="input-group">
          <!-- DOB -->
          <div v-if="DOBError">
            <h4>Date of Birth</h4>
            <div class="flex x-full">
              <v-date-picker
                v-model="details.DOB"
                :masks="{ input: ['DD/MM/YYYY'] }"
                :model-config="birthDateConfig"
                mode="single"
                class="flex-group"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <div :style="{ display: 'flex', flexDirection: 'row' }">
                    <input
                      :value="inputValue"
                      v-on="inputEvents"
                      :style="{ width: '150px', marginRight: '0' }"
                    />
                    <i class="fa fa-calendar fa-2x"></i>
                  </div>
                </template>
              </v-date-picker>
            </div>
          </div>
          <!-- DOBError -->
          <div v-else>
            <h4 style="color:red">Date of Birth</h4>
            <div class="flex x-full">
              <v-date-picker
                v-model="details.DOB"
                :masks="{ input: ['DD/MM/YYYY'] }"
                :model-config="birthDateConfig"
                mode="single"
                class="flex-group"
              >
                <template v-slot="{ inputValue, inputEvents }">
                  <div :style="{ display: 'flex', flexDirection: 'row' }">
                    <input
                      :value="inputValue"
                      v-on="inputEvents"
                      :style="{ width: '150px', marginRight: '0' }"
                    />
                    <i class="fa fa-calendar fa-2x"></i>
                  </div>
                </template>
              </v-date-picker>
            </div>
          </div>

          <!-- Gender -->
          <div v-if="genderError">
            <h4>Gender</h4>
            <select v-model="details.gender">
              <option value="" disabled selected>Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <!-- Gender Error -->
          <div v-else>
            <h4 style="color:red">Gender</h4>
            <select v-model="details.gender">
              <option value="" disabled selected>Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>

        <!-- Phone -->
        <div v-if="phoneError">
          <h4>Phone</h4>
          <input
            type="number"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            v-model="details.phone"
            placeholder="ex. 0812345678"
          />
        </div>
        <!-- Phone Error -->
        <div v-else>
          <h4 style="color:red">Phone (10 digits)</h4>
          <input
            type="number"
            onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
            v-model="details.phone"
            placeholder="ex. 0812345678"
          />
        </div>

        <!-- Email -->
        <div v-if="emailError">
          <h4>Email</h4>
          <input
            type="text"
            v-model="details.email"
            placeholder="ex. employee@mail.com"
          />
        </div>
        <!-- Email Error-->
        <div v-else>
          <h4 style="color:red">Email</h4>
          <input
            type="text"
            v-model="details.email"
            placeholder="ex. employee@mail.com"
          />
        </div>

        <div class="input-group">
          <!-- Password -->
          <div v-if="passwordError">
            <h4>Password</h4>
            <input
              type="password"
              v-model="details.password"
              placeholder="Password"
            />
          </div>
          <!-- Password Error-->
          <div v-else>
            <h4 style="color:red">Password</h4>
            <input
              type="password"
              v-model="details.password"
              placeholder="Password"
            />
          </div>

          <!-- Confirm Password -->
          <div v-if="conPasswordError">
            <h4>Confirm Password</h4>
            <input
              type="password"
              v-model="details.cf_pass"
              placeholder="Password"
            />
          </div>
          <!-- Confirm Password Error-->
          <div v-else>
            <h4 style="color:red">Confirm Password</h4>
            <input
              type="password"
              v-model="details.cf_pass"
              placeholder="Password"
            />
          </div>
        </div>
      </InnerFormContainer>
      <div class="buttons">
        <DefaultButton
          @click="backToEmployee"
          :style="{
            background: 'none',
            marginRight: '110px',
            border: '3px solid white',
          }"
          >CANCEL</DefaultButton
        >
        <DefaultButton @click="addEmployee">ADD</DefaultButton>
      </div>
    </FormContainer>
  </div>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import axios from "axios";

export default {
  name: "EmployeeReg",
  components: { FormContainer, DefaultButton, InnerFormContainer },

  data() {
    return {
      startDate: null,
      birthDate: null,
      roleDB: null,
      role: "",
      department: "",

      departmentError: true,
      roleError: true,
      startDateError: true,
      shiftError: true,
      firstNameError: true,
      lastNameError: true,
      identificationError: true,
      DOBError: true,
      genderError: true,
      phoneError: true,
      emailError: true,
      passwordError: true,
      conPasswordError: true,
      check: false,

      details: {
        department: "Housekeeping",
        roleID: "",
        startDate: "",
        shift: "",
        firstName: "",
        lastName: "",
        identification: "",
        DOB: "",
        gender: "",
        phone: "",
        email: "",
        password: "",
        cf_pass: "",
      },
      selected: "role",
      startDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      birthDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
    };
  },

  created() {
    this.role = this.$store.state.employeeDetail.role;
    // this.details.department = this.$store.state.employeeDetail.department;
    this.getRole();
  },

  methods: {
    backToEmployee() {
      this.$router.push("/Employee");
    },
    getRole() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_addEmployee.php", {
          action: "getRole",
          department: this.details.department,
          role: this.role,
        })
        .then(
          function(res) {
            this.roleDB = res.data;
          }.bind(this)
        );
    },

    addEmployee() {
      this.validateCheck();
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addEmployee.php", {
            action: "addEmployee",
            department: this.details.department,
            roleID: this.details.roleID,
            shift: this.details.shift,
            startDate: this.details.startDate,
            firstName: this.details.firstName,
            lastName: this.details.lastName,
            identification: this.details.identification,
            DOB: this.details.DOB,
            gender: this.details.gender,
            phone: this.details.phone,
            email: this.details.email,
            password: this.details.password,
            cf_pass: this.details.cf_pass,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert(res.data.message);
                this.backToEmployee();
              }
            }.bind(this)
          );
      }
    },
    validateCheck() {
      if (this.details.department == "") {
        this.departmentError = false;
      }
      if (this.details.department != "") {
        this.departmentError = true;
      }
      if (this.details.roleID == "") {
        this.roleError = false;
      }
      if (this.details.roleID != "") {
        this.roleError = true;
      }
      if (this.details.shift == "") {
        this.shiftError = false;
      }
      if (this.details.shift != "") {
        this.shiftError = true;
      }
      if (this.details.startDate == "") {
        this.startDateError = false;
      }
      if (this.details.startDate != "") {
        this.startDateError = true;
      }
      if (this.details.firstName == "") {
        this.firstNameError = false;
      }
      if (this.details.firstName != "") {
        this.firstNameError = true;
      }
      if (this.details.lastName == "") {
        this.lastNameError = false;
      }
      if (this.details.lastName != "") {
        this.lastNameError = true;
      }
      if (this.details.identification == "") {
        this.identificationError = false;
      }
      if (this.details.identification != "") {
        this.identificationError = true;
      }
      if (this.details.DOB == "") {
        this.DOBError = false;
      }
      if (this.details.DOB != "") {
        this.DOBError = true;
      }
      if (this.details.gender == "") {
        this.genderError = false;
      }
      if (this.details.gender != "") {
        this.genderError = true;
      }
      if (this.details.phone == "") {
        this.phoneError = false;
      }
      if (this.details.phone != "") {
        this.phoneError = true;
      }
      if (this.details.email == "") {
        this.emailError = false;
      }
      if (this.details.email != "") {
        this.emailError = true;
      }
      if (this.details.password == "") {
        this.passwordError = false;
      }
      if (this.details.password != "") {
        this.passwordError = true;
      }
      if (this.details.cf_pass == "") {
        this.conPasswordError = false;
      }
      if (this.details.cf_pass != "") {
        this.conPasswordError = true;
      }
      this.check =
        this.departmentError &&
        this.roleError &&
        this.shiftError &&
        this.startDateError &&
        this.firstNameError &&
        this.lastNameError &&
        this.identificationError &&
        this.DOBError &&
        this.genderError &&
        this.phoneError &&
        this.emailError &&
        this.passwordError &&
        this.conPasswordError;
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
h3 {
  font-size: 24px;
  padding-bottom: 15px;
}
b {
  color: white;
  font-size: 18px;
}
hr {
  width: 80%;
  color: black;
  margin: 40px auto;
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
.checkbox {
  width: 20px;
  height: 20px;
  margin: 0 10px 10px 0;
}
select {
  width: 220px;
  height: 40px;
  margin: 0 180px 30px 0;
  padding-left: 10px;
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
.choices {
  display: flex;
  justify-content: flex-start;
  width: 320px;
}
.container {
  display: block;
  position: relative;
  padding: 0 0 0 35px;
  margin: 0 0 15px 0;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
  background: none;
  width: 150px;
}
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #d3d3d3;
  border-radius: 50%;
}
.container:hover input ~ .checkmark {
  background-color: #ccc;
}
.container input:checked ~ .checkmark {
  background-color: var(--button-blue);
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
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
}
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
