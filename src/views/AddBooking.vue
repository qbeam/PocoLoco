<template>
  <FormContainer>
    <div class="form-header">
      <h2>Add Booking</h2>
    </div>

    <InnerFormContainer :style="{ height: '560px', position: 'relative' }">
      <h3>Booking ID: {{ bookingID }}</h3>
      <div class="input-group">
        <div v-if="error">
          <h4 style="color:red">Customer ID</h4>
        </div>
        <div v-else>
          <h4>Customer ID</h4>
        </div>

        <input
          v-model="customerID"
          type="number"
          onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.keyCode !== 109 && event.keyCode !== 107"
        />
        <h4 style="color: red">{{ message }}</h4>
        <!-- Add Booking Detail -->
        <AddButton
          @click="
            $router.push({
              name: 'AddBookingDetail',
              params: { bookingID, customerID },
            })
          "
        ></AddButton>
        <!-- <AddButton @click="goToAddBookingDetail()"></AddButton> -->
      </div>

      <!-- Table -->
      <table
        v-bind:style="bookingDetail_db.length !== 0 ? {} : { display: 'none' }"
      >
        <tr>
          <th>Booking Detail ID</th>
          <th>Room Number</th>
          <th>Type</th>
          <th>Manage</th>
        </tr>

        <tr
          v-for="(detail, index) in bookingDetail_db.slice(
            currentPage * numberPerPage - numberPerPage,
            currentPage * numberPerPage
          )"
          v-bind:key="index"
          :value="detail"
          class="row"
        >
          <!-- BookingDetail ID -->
          <td>{{ detail.bookingDetailID }}</td>

          <!-- Room Number -->
          <td>{{ detail.roomID }}</td>

          <!-- Room Type -->
          <td>{{ detail.roomType }}</td>

          <!-- Select Button -->
          <td>
            <div class="manage">
              <button
                class="manage-button"
                @click="deleteDetail(detail.bookingDetailID)"
              >
                <i class="fa fa-trash fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>

      <PaginationBar
        :pageCount="Math.ceil(bookingDetail_db.length / numberPerPage)"
        :paginationVisible="bookingDetail_db.length > numberPerPage"
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
        @click="backToBooking"
        :style="{
          background: 'none',
          marginRight: '110px',
          border: '3px solid white',
        }"
        >CANCEL</DefaultButton
      >
      <DefaultButton @click="addBooking">ADD</DefaultButton>
    </div>
  </FormContainer>
</template>

<script>
import FormContainer from "../components/FormContainer.vue";
import DefaultButton from "../components/DefaultButton.vue";
import InnerFormContainer from "../components/InnerFormContainer.vue";
import AddButton from "../components/AddButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import axios from "axios";

export default {
  name: "AddBooking",
  components: {
    FormContainer,
    DefaultButton,
    InnerFormContainer,
    AddButton,
    PaginationBar,
  },
  data() {
    return {
      numberPerPage: 5,
      currentPage: 1,
      bookingID: "",
      customerID: "",
      bookingDetail_db: "",
      message: "",
      error: false,
      prevRoute: null,
    };
  },

  created() {
    if (this.$route.params.customerID != undefined) {
      this.customerID = this.$route.params.customerID;
    } else {
      this.customerID = "";
    }
    this.getBookingID();
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    goToAddBookingDetail() {
      this.$store.state.customerID = this.customerID;
      this.$router.push("/AddBookingDetail");
    },
    backToBooking() {
      this.$router.push("/Booking");
    },
    getBookingID() {
      axios
        .post("http://localhost:8080/PocoLoco_db//api_addBooking.php", {
          action: "getBookingID",
        })
        .then(
          function(res) {
            this.bookingID = res.data;
            this.getBookingDetail();
          }.bind(this)
        );
    },

    getBookingDetail() {
      axios
        .post("http://localhost:8080/PocoLoco_db//api_addBooking.php", {
          action: "getBookingDetail",
          bookingID: this.bookingID,
        })
        .then(
          function(res) {
            this.bookingDetail_db = res.data;
          }.bind(this)
        );
    },

    deleteDetail(id) {
      if (confirm("Do you want to delete ID " + id + "?")) {
        axios
          .post("http://localhost:8080/PocoLoco_db//api_addBooking.php", {
            action: "deleteBookingdetail",
            bookingDetail: id,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                this.getBookingDetail();
              }
            }.bind(this)
          );
      }
    },

    addBooking() {
      if (this.customerID == "") {
        alert("Plese fill Customer ID");
      } else {
        axios
          .post("http://localhost:8080/PocoLoco_db/api_addBooking.php", {
            action: "addBooking",
            bookingID: this.bookingID,
            customerID: this.customerID,
          })
          .then(
            function(res) {
              if (res.data.success == true) {
                this.getBookingID();
                alert("Booking Saved Successful");
                this.error = false;
              } else {
                this.message = res.data.message;
              }
              this.resetData();
              this.backToBooking();
            }.bind(this)
          );
      }
    },

    resetData() {
      this.customerID = "";
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
.input-group {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
input {
  width: 250px;
  height: 35px;
  margin: 0 60px 0 10px;
  align-self: center;
  padding-left: 10px;
}
table {
  width: 100%;
  max-width: 500px;
  align-self: center;
  border: 1px solid black;
  border-collapse: collapse;
  margin-top: 25px;
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
  background: var(--grey-highlight);
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 45px 0;
}
i {
  color: #5f5f5f;
  padding: 0 20px;
}
i:hover {
  color: var(--primary-blue);
}
.vl {
  border-left: 3px solid #eeeeee;
  height: 25px;
  margin: 0 15px;
}
*:focus {
  outline: 0;
}
@media (max-width: 1000px) {
  .form-header {
    padding: 20px 0 10px 10%;
  }
  input {
    width: 180px;
  }
}
@media (max-width: 700px) {
  th {
    height: 35px;
    text-align: center;
    background-color: #eeeeee;
    border-bottom: 1px solid black;
    font-size: 14px;
  }
  td {
    text-align: center;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
  input {
    width: 150px;
    height: 30px;
    margin: 0 10px 0 5px;
    align-self: center;
    padding-left: 10px;
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
