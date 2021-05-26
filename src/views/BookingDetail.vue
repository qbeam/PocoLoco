<template>
  <TablePage>
    <h3>Booking Detail</h3>
    <div class="menu-bar">
      <div>
        <span class="icon-wrap">
          <i class="fa fa-search fa-1x"></i>
        </span>

        <input class="search-field" type="text" placeholder="search" />
      </div>
      <CustomSelect
        type="Sort by"
        :options="['A', 'B', 'C', 'Good Night']"
        :style="{ marginRight: '20px' }"
      />
      <CustomSelect
        type="Filter"
        :options="['A', 'B', 'C', 'Sleep tight']"
        :style="{ marginRight: '20px' }"
      />
      <DefaultButton type="small">Search</DefaultButton>
    </div>
    <table v-if="sampleBookingDetail.length !== 0">
      <tr>
        <th>Booking Detail ID</th>
        <th>Guest Name</th>
        <th>Check IN</th>
        <th>Check OUT</th>
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
        <td>
          {{ sampleBookingDetail.guestFname }}
          {{ sampleBookingDetail.guestLname }}
        </td>
        <td>{{ sampleBookingDetail.checkIn }}</td>
        <td>{{ sampleBookingDetail.checkOut }}</td>
        <td>{{ sampleBookingDetail.status }}</td>
        <td>
          <div class="manage">
            <button
              class="manage-button"
              @click="
                getRecord(
                  sampleBookingDetail.guestFname,
                  sampleBookingDetail.guestLname,
                  sampleBookingDetail.checkIn,
                  sampleBookingDetail.checkOut,
                  sampleBookingDetail.status
                )
              "
            >
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

    <PaginationBar
      :pageCount="Math.ceil(sampleBookingDetail.length / tableRow)"
      :paginationVisible="sampleBookingDetail.length > tableRow"
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

    <Popup :visible="visible" :buttons="true" @popReturn="popReturn" @submit="submit">
      <div class="group-row">
        <div class="group-item">
          <p>Guest Name</p>
          <input type="text" v-model="firstname" :placeholder="firstname" />
        </div>

        <div class="group-item">
          <p>Last Name</p>
          <input type="text" v-model="lastname" :placeholder="lastname" />
        </div>
      </div>

      <div class="group-row">
        <div class="group-item">
          <p>Check IN</p>
          <div class="flex x-full">
            <v-date-picker
              v-model="checkInDate"
              :masks="{ input: ['DD/MM/YYYY'] }"
              :model-config="checkInDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input :value="inputValue" v-on="inputEvents" />
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
              :model-config="checkOutDateConfig"
              mode="single"
              class="flex-grow"
            >
              <template v-slot="{ inputValue, inputEvents }">
                <div :style="{ display: 'flex', flexDirection: 'row' }">
                  <input :value="inputValue" v-on="inputEvents" />
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
            <input type="radio" value="Reserve" v-model="status" />
            <span class="checkmark"></span>
          </label>
          <label class="container2"
            >Check IN
            <input type="radio" value="Check IN" v-model="status" />
            <span class="checkmark"></span>
          </label>
          <label class="container3"
            >Cancel
            <input type="radio" value="Cancel" v-model="status" />
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

const sampleBookingDetail = [
  {
    id: 1023654800,
    guestFname: "Ying",
    guestLname: "Supa",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Reserve",
  },
  {
    id: 1023654800,
    guestFname: "Beam",
    guestLname: "Nat",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Cancel",
  },
  {
    id: 1023654800,
    guestFname: "Pung",
    guestLname: "Jung",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Reserve",
  },
  {
    id: 1023654800,
    guestFname: "Pan",
    guestLname: "Pan",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Check IN",
  },
  {
    id: 1023654800,
    guestFname: "Mly",
    guestLname: "Mly",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Check IN",
  },
  {
    id: 1023654800,
    guestFname: "Pra",
    guestLname: "Yut",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Check IN",
  },
  {
    id: 1023654800,
    guestFname: "Na",
    guestLname: "Sus",
    checkIn: "01/01/2021",
    checkOut: "05/01/2021",
    status: "Cancel",
  },
];

export default {
  name: "BooikingDatail",
  components: {
    DefaultButton,
    TablePage,
    PaginationBar,
    AddButton,
    Popup,
    CustomSelect,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      sampleBookingDetail,
      currentPage: 1,
      visible: false,
      firstname: "",
      lastname: "",
      checkInDate: "",
      checkInDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      checkOutDate: "",
      checkOutDateConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      status: "",
    };
  },
  methods: {
    pageReturn(page) {
      this.currentPage = page;
    },
    popReturn(value) {
      this.visible = value;
    },
    submit(value) {
      this.visible = value;
    },
    getRecord(fname, lname, checkIn, checkOut, status) {
      this.visible = !this.visible;
      this.firstname = fname;
      this.lastname = lname;
      this.checkInDate = checkIn;
      this.checkOutDate = checkOut;
      this.status = status;
    },
    deleteData() {},
    goToAddBookingDetail() {
      this.$router.push("/AddBookingDetail");
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
  margin-top: 50px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
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
  margin: 0 10px;
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
.status {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: yellow;
  border-radius: 50%;
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