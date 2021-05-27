<template>
  <TablePage>
    <h3>Booking</h3>
    <div class="menu-bar">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input class="search-field" type="text" placeholder="search" />
      </div>
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C', 'Sleep tight']"
        :style="{ marginRight: '20px' }"
      />
      <DefaultButton type="small">Search</DefaultButton>

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToAddBooking()"
      />
    </div>

    <table v-if="sampleBooking.length !== 0" style="margin-top: 50px;">
      <tr>
        <th v-for="(colName, i) in colNames" :key="i">
          <div class="tb-head">
            {{ colName }}
            <SortingArrow
              :active="activeArrow == i ? true : false"
              @click="setActiveArrow(i)"
              @sortReturn="sortReturn"
            />
          </div>
        </th>
        <th>Manage</th>
      </tr>

      <tr
        v-for="(sampleBooking, i) in sampleBooking.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ sampleBooking.id }}</td>
        <td>{{ sampleBooking.name }} {{ sampleBooking.lastname }}</td>
        <td>{{ sampleBooking.phone }}</td>

        <td>{{ sampleBooking.email }}</td>
        <td>
          <div class="manage">
            <button
              class="manage-button"
              @click="
                getRecord(
                  sampleBooking.id,
                  sampleBooking.phone,
                  sampleBooking.name,
                  sampleBooking.lastname
                )
              "
            >
              <i class="fa fa-search fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>

    <PaginationBar
      :pageCount="Math.ceil(sampleBooking.length / tableRow)"
      :paginationVisible="sampleBooking.length > tableRow"
      @pageReturn="pageReturn"
      :style="
        width <= 1000
          ? {
              position: 'fixed',
              bottom: '50px',
              margin: '0 auto',
              right: '0',
              left: '60px',
            }
          : {
              position: 'fixed',
              bottom: '50px',
              margin: '0 auto',
              right: '0',
              left: '200px',
            }
      "
    />

    <Popup v-bind:visible="visible" @popReturn="popReturn">
      <div class="popup-head1">
        Booking ID: {{ bookingID }}
      </div>
      <div class="popup-head">
        <div>Name: {{ name }} {{lastname}}</div>
        <div>Phone: {{ phone }}</div>
      </div>
      <table v-if="sampleBookingDetail.length !== 0" style="magin-top: 10px;">
        <tr>
          <th>Booking Detail ID</th>
          <th>Room Number</th>
          <th>Status</th>
          <th>Manage</th>
        </tr>

        <tr
          v-for="(sampleBookingDetail, i) in sampleBookingDetail.slice(
            currentPage * tableRow - tableRow,
            currentPage * tableRow
          )"
          :key="i"
          class="row"
        >
          <td>{{ sampleBookingDetail.id }}</td>
          <td>{{ sampleBookingDetail.room }}</td>
          <td>{{ sampleBookingDetail.status }}</td>
          <td>
            <div class="manage">
              <button class="manage-button" @click="getRecord2Pop(sampleBookingDetail.status)">
                <i class="fa fa-pencil fa-2x"></i>
              </button>
              <div class="vl"></div>
              <button
                class="manage-button"
                @click="deleteData(sampleBookingDetail)"
              >
                <i class="fa fa-trash fa-2x"></i>
              </button>
            </div>
          </td>
        </tr>
      </table>
    </Popup>

    <Popup v-bind:visible="switchPop" :buttons="true" :pop2="true" @pop2Return="pop2Return" @submit="submit">
      <div class="group-row">
        <div class="group-item">
        <p>Guest Name</p>
          <input
            type="text"
            v-model="name"
            :placeholder="name"
          />
        </div>

        <div class="group-item">
        <p>Last Name</p>
          <input
            type="text"
            v-model="lastname"
            :placeholder="lastname"
          />
      </div>
      </div>

      <div class="group-row">
        <div class="group-item">
          <p>Check IN</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="checkInDate"
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
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
        <div class="group-item">
          <p>Check OUT</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="checkOutDate"
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
                  />
                  <i class="fa fa-calendar fa-2x"></i>
                </div>
              </template>
            </v-date-picker>
          </div>
        </div>
      </div>
      <div>
        <p>Status</p>
        <div class="choices">
            <label class="container1">
              Reserve
              <input type="radio"  value="Reserve" v-model="status"/>
              <span class="checkmark"></span>
            </label>
            <label class="container2"
              >Check IN
              <input type="radio"  value="Check IN" v-model="status"/>
              <span class="checkmark"></span>
            </label>
            <label class="container3"
              >Cancel
              <input type="radio"  value="Cancel" v-model="status"/>
              <span class="checkmark"></span>
            </label>
          </div>
      </div>
    </Popup>
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import AddButton from "../components/AddButton.vue";
import Popup from "../components/Popup.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SortingArrow from "../components/SortingArrow";

const sampleBooking = [
  {
    id: 1002500120,
    name: "Ying",
    lastname: "Supa",
    phone: "0958765485",
    email: "sadasd@gmail.com",
  },
  {
    id: 1002500121,
    name: "Ying1",
    lastname: "Supa1",
    phone: "0958765485",
    email: "sadasd@gmail.com",
  },
  {
    id: 1002500122,
    name: "Ying2",
    lastname: "Supa2",
    phone: "0958765485",
    email: "sadasd@gmail.com",
  },
  {
    id: 1002500123,
    name: "Ying3",
    lastname: "Supa3",
    phone: "0958765485",
    email: "sadasd@gmail.com",
  },
  {
    id: 1002500124,
    name: "Ying4",
    lastname: "Supa4",
    phone: "0958765485",
    email: "sadasd@gmail.com",
  },
];

const sampleBookingDetail = [
  { id: 1023654800, room: 1502, status: "Reserve" },
  { id: 1023654800, room: 1503, status: "Cancel" },
  { id: 1023654801, room: 1504, status: "Reserve" },
  { id: 1023654802, room: 1505, status: "Check IN" },
];

const colNames = ["BookingID", "Customer Name", "Phone", "Phone"];

export default {
  name: "Booking",
  components: {
    DefaultButton,
    TablePage,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      sampleBookingDetail,
      sampleBooking,
      colNames,
      currentPage: 1,
      visible: false,
      switchPop: false,
      bookingID: "",
      name: "",
      lastname: "",
      phone: "",
      checkInDate: "",
      checkOutDate: "",
      status: "",
      activeArrow: 0,
      sortDirection: "down",
    };
  },

  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.visible = value;
    },
    pop2Return(value) {
      this.switchPop = value;
      this.visible = !value;
    },
    submit(value) {
      this.switchPop = value;
      this.visible = !value;
    },
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    getRecord(id, phone, name, lastname) {
      this.visible = !this.visible;
      this.bookingID = id;
      this.name = name;
      this.lastname = lastname;
      this.phone = phone;
    },
    getRecord2Pop(status) {
      this.visible = !this.visible;
      this.switchPop = !this.switchPop;
      this.status = status;
    },
    deleteData() {},
    goToAddBooking() {
      this.$router.push("/AddBooking");
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.icon-wrap {
  position: absolute;
  z-index: 0;
  padding: 5px 20px;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 45px;
  font-size: 18px;
  outline: none;
  z-index: 1;
  border: none;
  border-radius: 50px;
  margin-right: 20px;
}
i {
  color: #5f5f5f;
}

.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
}
table {
  width: 100%;
  max-width: 1000;
  /* margin-top: 50px; */
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
}
.manage {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.fa-pencil:hover,
.fa-trash:hover {
  color: var(--primary-blue);
}
.fa-calendar {
  color: var(--primary-blue);
  margin: 5px 0 0 -35px;
  padding-right: 100px;
}
.manage-button {
  border: none;
  background: none;
  cursor: pointer;
}
.vl {
  border-left: 3px solid #eeeeee;
  height: 25px;
  margin: 0 5px;
}
.popup-head1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 0px;
  font-weight: bold;
  font-size: 30px;
}
.popup-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 3px solid var(--grey-highlight);
  padding-bottom: 20px;
  margin-bottom: 25px;
  font-weight: bold;
}
.choices {
  display: flex;
  justify-content: flex-start;
  width: 550px;
}
.container1, .container2, .container3 {
  display: block;
  position: relative;
  padding: 0 0 0 35px;
  margin: 0 0 15px 0;
  cursor: pointer;

  user-select: none;
  background: none;
  width: 150px;
}
.container1 input, .container2 input, .container3 input{
  position: fixed;
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
.container1:hover input ~ .checkmark, .container2:hover input ~ .checkmark, .container3:hover input ~ .checkmark {
  background-color: #ccc;
}
.container1 input:checked ~ .checkmark {
  background-color: #FFC42E;
}
.container2 input:checked ~ .checkmark {
  background-color: #24BA45;
}
.container3 input:checked ~ .checkmark {
  background-color: #E11818;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container1 input:checked ~ .checkmark:after, .container2 input:checked ~ .checkmark:after, .container3 input:checked ~ .checkmark:after   {
  display: block;
}
.container1 .checkmark:after, .container2 .checkmark:after, .container3 .checkmark:after {
  top: 6px;
  left: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
}
input {
  width: 200px;
  height: 35px;
  padding-left: 10px;
  color: var(--header-color);
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
.group-row {
  display: flex;
}
.group-item {
  display: flex;
  flex-direction: column;
  width: 50%;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
*:focus {
  outline: 0;
}
@media (max-width: 1000px) {
  .search-field {
    width: 180px;
  }
  .vl {
    margin: 0 5px;
  }
}
@media (max-width: 700px) {
  .search-field {
    width: 150px;
    font-size: 16px;
  }
}
</style>
