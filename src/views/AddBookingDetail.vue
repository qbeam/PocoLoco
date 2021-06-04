<template>
  <FormContainer>
    <div class="form-header">
      <h2>Add Booking Detail</h2>
    </div>

    <InnerFormContainer
      class="styled-inner"
      :style="
        roomDB.length === 0
          ? { height: '500px' }
          : windowWidth <= 1000
          ? { height: '1100px', position: 'relative' }
          : { height: '800px', position: 'relative' }
      "
    >
      <div :style="{ alignSelf: 'center', paddingLeft: '60px' }">
        <div class="input-group">
          <!-- Guest's First Name -->
          <div>
            <div v-if="firstNameError">
              <h4>Guest's First Name</h4>
            </div>
            <div v-else>
              <h4 style="color:red">Guest's First Name</h4>
            </div>
            <input
              v-model="details.guestFirstName"
              @change="validate"
              type="text"
              placeholder="ex. Poco"
            />
          </div>

          <!-- Guest's Last Name -->
          <div>
            <div v-if="lastNameError">
              <h4>Guest's Last Name</h4>
            </div>
            <div v-else>
              <h4 style="color:red">Guest's Last Name</h4>
            </div>
            <input
              v-model="details.guestLastName"
              @change="validate"
              type="text"
              placeholder="ex. Loco"
            />
          </div>
        </div>

        <!-- Room Type -->
        <div>
          <div v-if="roomTypeError">
            <h4>Room Type</h4>
          </div>
          <div v-else>
            <h4 style="color:red">Room Type</h4>
          </div>

          <select v-model="details.roomType" @change="validate">
            <option value="" disabled selected>Select</option>
            <option
              v-for="(room, index) in typeDB"
              v-bind:key="index"
              :value="room.roomTypeID"
            >
              {{ room.roomType }}
            </option>
          </select>
        </div>

        <!-- Check In Date -->
        <div class="input-group">
          <div>
            <div v-if="inDateError">
              <h4>Check In Date</h4>
            </div>
            <div v-else>
              <h4 style="color:red">Check In Date</h4>
            </div>
            <div class="flex x-full">
              <v-date-picker
                v-model="details.checkIn"
                @click="validate"
                :masks="{ input: ['DD/MM/YYYY'] }"
                :model-config="inDateConfig"
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

          <!-- Check Out Date -->
          <div>
            <div v-if="outDateError">
              <h4>Check Out Date</h4>
            </div>
            <div v-else>
              <h4 style="color:red">Check Out Date</h4>
            </div>
            <div class="flex x-full">
              <v-date-picker
                v-model="details.checkOut"
                :masks="{ input: ['DD/MM/YYYY'] }"
                :model-config="outDateConfig"
                mode="single"
                class="flex-grow"
                @click="validate"
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
      </div>

      <!-- Room Number Table -->
      <table v-bind:style="roomDB.length !== 0 ? {} : { display: 'none' }">
        <tr>
          <th>Room Number</th>
          <!-- <th>Room Type</th> -->
          <th>Select</th>
        </tr>

        <tr
          v-for="(room, index) in roomDB.slice(
            currentPage * numberPerPage - numberPerPage,
            currentPage * numberPerPage
          )"
          v-bind:key="index"
          :value="room"
          :style="[
            details.roomNumber.includes(room.roomID)
              ? { background: '#adffb4' }
              : {},
          ]"
        >
          <!-- room number -->
          <td>{{ room.roomID }}</td>

          <!-- Select Button -->
          <td>
            <input
              type="checkbox"
              v-model="details.roomNumber"
              :value="room.roomID"
              class="checkbox"
            />
          </td>
        </tr>
      </table>

      <PaginationBar
        :pageCount="Math.ceil(roomDB.length / numberPerPage)"
        :paginationVisible="roomDB.length > numberPerPage"
        @pageReturn="pageReturn"
        :style="{
          position: 'absolute',
          bottom: '35px',
          margin: '0 auto',
          left: '0',
          right: '0',
        }"
      />
    </InnerFormContainer>
    <div class="buttons">
      <DefaultButton
        @click="
          $router.push({
            name: 'AddBooking',
            params: { customerID },
          })
        "
        :style="{
          background: 'none',
          marginRight: '110px',
          border: '3px solid white',
        }"
        >CANCEL</DefaultButton
      >
      <DefaultButton @click="addBookingDetail">ADD</DefaultButton>
    </div>
  </FormContainer>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import PaginationBar from "../components/PaginationBar.vue";
import axios from "axios";

export default {
  name: "AddBookingDetail",
  components: {
    FormContainer,
    DefaultButton,
    InnerFormContainer,
    PaginationBar,
  },
  data() {
    return {
      windowWidth: self.innerWidth,
      numberPerPage: 5,
      currentPage: 1,
      customerID: "",
      typeDB: "",
      roomDB: "",
      canGet: false,
      details: {
        bookingID: "",
        guestFirstName: "",
        guestLastName: "",
        roomType: "",
        typeName: "",
        roomNumber: [],
        checkIn: "",
        checkOut: "",
      },
      inDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      outDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },

      firstNameError: true,
      lastNameError: true,
      roomTypeError: true,
      inDateError: true,
      outDateError: true,
    };
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },

  created() {
    this.details.bookingID = this.$route.params.bookingID;
    this.customerID = this.$route.params.customerID;
    this.getRoomType();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },

    onResize() {
      this.windowWidth = self.innerWidth;
    },

    getRoomType() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_addBookingDetail.php", {
          action: "getRoomType",
        })
        .then(
          function(res) {
            this.typeDB = res.data;
          }.bind(this)
        );
    },

    validate() {
      if (
        this.details.guestFirstName != "" &&
        this.details.guestLastName != "" &&
        this.details.roomType != "" &&
        this.details.checkIn != "" &&
        this.details.checkOut != ""
      ) {
        this.getRoomNumber();
      }
    },

    getRoomNumber() {
      if (this.details.checkIn > this.details.checkOut) {
        alert("Please check your date again");
      } else {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addBookingDetail.php", {
            action: "getRoomNumber",
            roomType: this.details.roomType,
            checkIn: this.details.checkIn,
            checkOut: this.details.checkOut,
          })
          .then(
            function(res) {
              this.roomDB = res.data;
            }.bind(this)
          );
      }
    },

    addBookingDetail() {
      if (this.roomNumber == "") {
        alert("Please choose room number");
      }
      this.validateCheck();
      if (this.check) {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addBookingDetail.php", {
            action: "addBookingDetail",
            bookingID: this.details.bookingID,
            guestFirstName: this.details.guestFirstName,
            guestLastName: this.details.guestLastName,
            roomNumber: this.details.roomNumber,
            checkIn: this.details.checkIn,
            checkOut: this.details.checkOut,
            roomType: this.details.roomType,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                alert("Saved Successful");
                this.$router.push({
                  name: "AddBooking",
                  params: { customerID: this.customerID },
                });
              }
            }.bind(this)
          );
      }
    },

    validateCheck() {
      this.check =
        this.details.guestFirstName != "" &&
        this.details.guestLastName != "" &&
        this.details.roomNumber != "" &&
        this.details.roomType != "" &&
        this.details.checkIn != "" &&
        this.details.checkOut != "";

      if (this.details.guestFirstName == "") {
        this.firstNameError = false;
      }
      if (this.details.guestLastName == "") {
        this.lastNameError = false;
      }
      if (this.details.roomType == "") {
        this.roomTypeError = false;
      }
      if (this.details.checkIn == "") {
        this.inDateError = false;
      }
      if (this.details.checkOut == "") {
        this.outDateError = false;
      }
      if (this.details.guestFirstName != "") {
        this.firstNameError = true;
      }
      if (this.details.guestLastName != "") {
        this.lastNameError = true;
      }
      if (this.details.roomType != "") {
        this.roomTypeError = true;
      }
      if (this.details.checkIn != "") {
        this.inDateError = true;
      }
      if (this.details.checkOut != "") {
        this.outDateError = true;
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
select {
  width: 220px;
  height: 40px;
  margin: 0 180px 30px 0;
  padding-left: 10px;
}
table {
  width: 100%;
  max-width: 350px;
  align-self: center;
  border: 1px solid black;
  border-collapse: collapse;
  margin-top: 30px;
}
th {
  height: 35px;
  text-align: center;
  background-color: #eeeeee;
  border-bottom: 1px solid black;
}
td {
  text-align: center;
  justify-content: center;
  align-items: center;
}
.row:hover {
  cursor: pointer;
  background: #f0f0f0;
}
.checkbox {
  width: 20px;
  height: 20px;
  margin: 5px auto 0 auto;
}
i {
  color: var(--primary-blue);
  margin: 5px 0 0 -35px;
  padding-right: 240px;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 45px 0;
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
</style>
