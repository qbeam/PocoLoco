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

      <AddButton
        :style="
          width < 800
            ? { position: 'fixed', right: '5%', top: '80px' }
            : { position: 'fixed', right: '5%', top: '170px' }
        "
        @click="goToCustomerReg()"
      />
    </div>

    <table v-if="sampleBooking.length !== 0">
      <tr>
        <th>BookingID</th>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Email</th>
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
        <td>{{ sampleBooking.phone }}</td>
        <td>{{ sampleBooking.name }}</td>

        <td>{{ sampleBooking.email }}</td>
        <td>
          <div class="manage">
            <button
              class="manage-button"
              @click="getRecord(sampleBooking.id, sampleBooking.phone, sampleBooking.name)"
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

    <Popup v-bind:visible="visible" :buttons="true" @popReturn="popReturn">
      <div class="popup-head">
        <div>Booking ID: {{ bookingID }}</div>
        <div>Name: {{ name }}</div>
        <div>Phone: {{ phone }}</div>
      </div>
      <table v-if="sampleBookingDetail.length !== 0">
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
            <button
              class="manage-button"
              @click="getRecord(sampleBookingDetail.id, sampleBookingDetail.room, sampleBookingDetail.status)"
            >
              <i class="fa fa-pencil fa-2x"></i>
            </button>
            <div class="vl"></div>
            <button class="manage-button">
              <i class="fa fa-trash fa-2x"></i>
            </button>
          </div>
        </td>
      </tr>
    </table>
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

  const sampleBooking = [
    { id: 1002500120, name: "Ying", phone: "0958765485", email: "sadasd@gmail.com" },
    { id: 1002500121, name: "Ying1", phone: "0958765485", email: "sadasd@gmail.com" },
    { id: 1002500122, name: "Ying2", phone: "0958765485", email: "sadasd@gmail.com" },
    { id: 1002500123, name: "Ying3", phone: "0958765485", email: "sadasd@gmail.com" },
    { id: 1002500124, name: "Ying4", phone: "0958765485", email: "sadasd@gmail.com" },
  ];

  const sampleBookingDetail = [
    { id: 1023654800, room: 1502, status:"Researve" },
    { id: 1023654800, room: 1503, status:"Cancel" },
    { id: 1023654801, room: 1504, status:"Researve" },
    { id: 1023654802, room: 1505, status:"Checkin" },
  ]

  export default {
    name: "Booking",
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
        sampleBooking,
        currentPage: 1,
        visible: false,
        switchPop: false,
        bookingID: "",
        name:"",
        phone:"",
      };
    },

    methods: {
      pageReturn(page) {
        this.currentPage = page;
      },
      popReturn(value) {
        this.visible = value;
      },
      getRecord(id, phone, name) {
        this.visible = !this.visible;
        this.bookingID = id;
        this.name = name;
        this.phone = phone;
      },
      goToAddRole() {
        this.$router.push("/AddRole");
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
  .manage-button {
    border: none;
    background: none;
    cursor: pointer;
  }
  .vl {
    border-left: 3px solid #eeeeee;
    height: 25px;
    margin: 0 15px;
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
  input {
    width: 250px;
    height: 35px;
    align-self: center;
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
