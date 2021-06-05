<template>
  <FormContainer>
    <div class="form-header">
      <h2>Add New Promotion</h2>
    </div>

    <InnerFormContainer>
      <div class="input-group">
        <!-- Season -->
        <div v-if="seasonError">
          <h4>Season</h4>
          <select
            name="seasonID"
            v-model="details.seasonID"
            oninvalid="alert('Please select Season')"
            required
          >
            <option value="" selected hidden>Select</option>
            <option
              v-for="(season, index) in seasonDB"
              v-bind:key="index"
              :value="season.seasonID"
            >
              {{ season.seasonName }}
            </option>
          </select>
        </div>

        <!-- Season Error -->
        <div v-else>
          <h4 style="color:red">Season</h4>
          <select
            name="seasonID"
            v-model="details.seasonID"
            oninvalid="alert('Please select Season')"
            required
          >
            <option value="" selected hidden>Select</option>
            <option
              v-for="(season, index) in seasonDB"
              v-bind:key="index"
              :value="season.seasonID"
            >
              {{ season.seasonName }}
            </option>
          </select>
        </div>

        <!-- Room Type -->
        <div v-if="roomTypeError">
          <h4>Room Type</h4>
          <select
            name="roomTypeID"
            v-model="details.roomTypeID"
            oninvalid="alert('Please select Room Type')"
            required
          >
            <option value="" selected hidden>Select</option>
            <option
              v-for="(room, index) in typeDB"
              v-bind:key="index"
              :value="room.roomTypeID"
            >
              {{ room.roomType }}
            </option>
          </select>
        </div>

        <!-- Room Type Error -->
        <div v-else>
          <h4 style="color:red">Room Type</h4>
          <select
            name="roomTypeID"
            v-model="details.roomTypeID"
            oninvalid="alert('Please select Room Type')"
            required
          >
            <option value="" selected hidden>Select</option>
            <option
              v-for="(room, index) in typeDB"
              v-bind:key="index"
              :value="room.roomTypeID"
            >
              {{ room.roomType }}
            </option>
          </select>
        </div>
      </div>

      <!-- Promotion -->
      <div v-if="promotionError">
        <h4>Promotion Name</h4>
        <input
          type="text"
          name="promotionName"
          v-model="details.promotionName"
          class="form-control"
          placeholder="ex. Christmas Promotion"
          pattern="[a-zA-Z]+"
          oninvalid="alert('Please enter Promotion Name')"
          required
        />
      </div>

      <!-- Promotion Error -->
      <div v-else>
        <h4 style="color:red">Promotion</h4>
        <input
          type="text"
          name="promotionName"
          v-model="details.promotionName"
          class="form-control"
          placeholder="ex. Christmas Promotion"
          pattern="[a-zA-Z]+"
          oninvalid="alert('Please enter Promotion Name')"
          required
        />
      </div>

      <!-- Start Date -->
      <div class="input-group">
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

        <!-- End Date -->
        <div v-if="endDateError">
          <h4>End Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="details.endDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="endDateConfig"
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
        <!-- End Date Error -->
        <div v-else>
          <h4 style="color:red">End Date</h4>
          <div class="flex x-full">
            <v-date-picker
              v-model="details.endDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="endDateConfig"
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
      </div>

      <!-- Discount -->
      <div v-if="discountError">
        <h4>% Discount</h4>
        <input
          type="number"
          onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
          name="discount"
          placeholder="0 - 100"
          v-model="details.discount"
          :style="{ width: '200px' }"
        />
      </div>

      <!-- Discount Error -->
      <div v-else>
        <h4 style="color:red">% Discount (0 - 100)</h4>
        <input
          type="number"
          onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
          name="discount"
          placeholder="0 - 100"
          v-model="details.discount"
          :style="{ width: '200px' }"
        />
      </div>
    </InnerFormContainer>

    <div class="buttons">
      <DefaultButton
        :style="{
          background: 'none',
          marginRight: '110px',
          border: '3px solid white',
        }"
        @click="backToPromo()"
        >CANCEL</DefaultButton
      >
      <DefaultButton @click="addPromotionFn">ADD</DefaultButton>
    </div>
  </FormContainer>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import axios from "axios";

export default {
  name: "AddPromotion",
  components: { FormContainer, DefaultButton, InnerFormContainer },
  data() {
    return {
      message: "Add New Promotion",
      typeDB: "",
      seasonDB: "",
      seasonError: true,
      roomTypeError: true,
      promotionError: true,
      startDateError: true,
      endDateError: true,
      discountError: true,
      check: false,

      details: {
        seasonID: "",
        roomTypeID: "",
        promotionName: "",
        startDate: "",
        endDate: "",
        discount: "",
      },
      selected: "promotion",

      startDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      endDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
    };
  },

  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin" &&
      localStorage.getItem("userRole") !== "Manager"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getRoomType();
      this.getSeason();
    }
  },

  methods: {
    backToPromo() {
      this.$router.push("/Promotion");
    },

    getSeason() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_addPromo.php", {
          action: "getSeason",
        })
        .then(
          function(res) {
            this.seasonDB = res.data;
          }.bind(this)
        );
    },

    getRoomType() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_addPromo.php", {
          action: "getRoomType",
        })
        .then(
          function(res) {
            this.typeDB = res.data;
          }.bind(this)
        );
    },

    validatecCheck() {
      if (this.details.seasonID == "") {
        this.seasonError = false;
      }
      if (this.details.seasonID != "") {
        this.seasonError = true;
      }
      if (this.details.roomTypeID == "") {
        this.roomTypeError = false;
      }
      if (this.details.roomTypeID != "") {
        this.roomTypeError = true;
      }
      if (this.details.promotionName == "") {
        this.promotionError = false;
      }
      if (this.details.promotionName != "") {
        this.promotionError = true;
      }
      if (this.details.startDate == "") {
        this.startDateError = false;
      }
      if (this.details.startDate != "") {
        this.startDateError;
      }
      if (this.details.endDate == "") {
        this.endDateError = false;
      }
      if (this.details.endDate != "") {
        if (
          this.details.startDate >= this.details.endDate ||
          this.details.startDate == this.details.endDate
        ) {
          alert("Please check your date again");
          this.startDateError = false;
          this.endDateError = false;
        } else {
          this.startDateError = true;
          this.endDateError = true;
        }
      }
      if (this.details.discount == "") {
        this.discountError = false;
      }
      if (this.details.discount != "") {
        this.details.discount = Number(this.details.discount);
        if (this.details.discount >= 0 && this.details.discount < 100) {
          this.discountError = true;
        } else {
          this.discountError = false;
        }
      }

      this.check =
        this.seasonError &&
        this.roomTypeError &&
        this.promotionError &&
        this.startDateError &&
        this.endDateError &&
        this.discountError;
    },

    addPromotionFn() {
      this.validatecCheck();

      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addPromo.php", {
            action: "addPromotion",
            seasonID: this.details.seasonID,
            roomTypeID: this.details.roomTypeID,
            promotionName: this.details.promotionName,
            startDate: this.details.startDate,
            endDate: this.details.endDate,
            discount: this.details.discount,
          })
          .then(
            function(res) {
              console.log(res.date);
              if (res.data.success == true) {
                alert(res.data.message);
                this.backToPromo();
                this.resetData();
              } else {
                alert(res.data.message);
              }
            }.bind(this)
          );
      }
    },

    resetData() {
      this.details.seasonID = "";
      this.details.roomTypeID = "";
      this.details.promotionName = "";
      this.details.startDate = "";
      this.details.endDate = "";
      this.details.discount = "";
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
