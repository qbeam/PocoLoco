<template>
  <FormContainer>
    <div class="form-header">
      <h2>Add New Service</h2>
    </div>

    <InnerFormContainer>
      <div v-if="departmentName == 'Kitchen'">
        <h4>Service Type : Food & Beverage</h4>
      </div>
      <div v-else-if="departmentName == 'Housekeeping'">
        <h4>Service Type : Room Facilities</h4>
      </div>
      <div v-else>
        <!-- Service Type Error -->
        <div v-if="serviceTypeError">
          <h4 style="color:red">Service Type</h4>
          <select v-model="serviceType">
            <option disabled value="">Service Type</option>
            <option value="1">Room Facilities</option>
            <option value="2">Food & Beverage</option>
          </select>
        </div>

        <!-- Service Type -->
        <div v-else>
          <h4>Service Type</h4>
          <select v-model="serviceType">
            <option disabled value="">Service Type</option>
            <option value="1">Room Facilities</option>
            <option value="2">Food & Beverage</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <!-- Service Name Error -->
        <div v-if="serviceNameError">
          <h4 style="color:red">Service Name</h4>
          <input v-model="serviceName" type="text" />
        </div>

        <!-- Service Name -->
        <div v-else>
          <h4>Service Name</h4>
          <input v-model="serviceName" type="text" />
        </div>

        <!-- Price Error -->
        <div v-if="priceError">
          <h4 style="color:red">Price</h4>
          <div :style="{ display: 'flex', flexDirection: 'row' }">
            <input
              v-model="price"
              type="number"
              onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
              :style="{ marginRight: '10px', width: '200px' }"
            />
            <p class="unit">Baht</p>
          </div>
        </div>

        <!-- Price -->
        <div v-else>
          <h4>Price</h4>
          <div :style="{ display: 'flex', flexDirection: 'row' }">
            <input
              v-model="price"
              type="number"
              onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
              :style="{ marginRight: '10px', width: '200px' }"
            />
            <p class="unit">Baht</p>
          </div>
        </div>
      </div>
    </InnerFormContainer>
    <div class="buttons">
      <DefaultButton
        @click="backToAllService"
        :style="{
          background: 'none',
          marginRight: '110px',
          border: '3px solid white',
        }"
        >CANCEL</DefaultButton
      >
      <DefaultButton @click="addNewService">ADD</DefaultButton>
    </div>
  </FormContainer>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import axios from "axios";

export default {
  name: "AddNewService",
  components: { FormContainer, DefaultButton, InnerFormContainer },
  data() {
    return {
      serviceType: "",
      serviceName: "",
      price: "",
      departmentName: "",

      check: false,
      serviceTypeError: false,
      serviceNameError: false,
      priceError: false,
    };
  },
  created() {
    this.departmentName = localStorage.getItem("userDepartment");
    if (this.departmentName == "Housekeeping") {
      this.serviceType = 1;
    } else if (this.departmentName == "Kitchen") {
      this.serviceType = 2;
    }
    console.log(this.departmentName);
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userRole") !== "Manager"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    }
  },
  methods: {
    backToAllService() {
      this.$router.push("/Services");
    },
    addNewService() {
      this.validate();
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addNewService.php", {
            action: "addNewService",
            serviceType: this.serviceType,
            serviceName: this.serviceName,
            price: this.price,
          })
          .then(
            function(res) {
              console.log(res);
              if (res.data.success == true) {
                alert("Saved Successful");
                this.resetData();
                this.backToAllService();
              } else {
                this.message = res.data.message;
              }
            }.bind(this)
          );
      }
    },

    validate() {
      this.check =
        this.serviceType != "" && this.serviceName != "" && this.price != "";

      if (this.serviceType == "") {
        this.serviceTypeError = true;
      }
      if (this.serviceName == "") {
        this.serviceNameError = true;
      }
      if (this.price == "") {
        this.priceError = true;
      }
      if (this.serviceType != "") {
        this.serviceTypeError = false;
      }
      if (this.serviceName != "") {
        this.serviceNameError = false;
      }
      if (this.price != "") {
        this.priceError = false;
      }
    },

    resetData() {
      this.serviceType = "";
      this.serviceName = "";
      this.price = "";
      this.serviceTypeError = false;
      this.serviceNameError = false;
      this.priceError = false;
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
}
input[type="number"] {
  -moz-appearance: textfield;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
