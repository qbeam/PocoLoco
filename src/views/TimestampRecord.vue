<template>
  <TablePage>
    <h3>Timestamp</h3>
    <div class="menu-bar">
      <div class="search-container">
        <i
          class="fa fa-search"
          :style="{
            position: 'absolute',
            zIndex: 5,
            marginLeft: '15px',
          }"
        />
        <input
          v-model="keyword"
          class="search-field"
          type="text"
          placeholder="search"
        />
      </div>
      <div class="search-buttons">
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ marginRight: '20px' }"
          @selection="setSearchFilter"
        />
        <CustomSelect
          type="Year"
          :options="past5Years"
          :style="{ marginRight: '20px' }"
          @selection="setSelectedYear"
        />
        <DefaultButton @click="searchData" type="small">
          Search
        </DefaultButton>
      </div>
    </div>

    <SearchError v-if="errorSearching" />

    <table v-if="stampRecord.length > 0 && !errorSearching">
      <tr>
        <th v-for="(colName, i) in colNames" :key="i">
          <div
            class="tb-head"
            :style="colName == 'Type' ? { justifyContent: 'flex-start' } : {}"
          >
            {{ colName }}
            <SortingArrow
              :active="activeArrow == i ? true : false"
              @click="setSortFilter(i)"
              @sortReturn="sortReturn"
            />
          </div>
        </th>
      </tr>
      <tr
        v-for="(record, i) in stampRecord.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td :style="{ width: '25%' }">{{ record.stampDateTime }}</td>
        <td :style="{ width: '15%' }">{{ record.employeeID }}</td>
        <td :style="{ width: '35%' }">
          {{ record.em_firstname }} {{ record.em_lastname }}
        </td>
        <td
          :style="
            width > 750
              ? { width: '10%', textAlign: 'start' }
              : { width: '10%' }
          "
        >
          <i
            class="fa fa-circle"
            :style="{ color: getTagColor(record.type) }"
          />
          {{ record.type }}
        </td>
        <td :style="{ width: '15%', color: '#FF0000', fontWeight: 'bold' }">
          {{ record.late }}
        </td>
      </tr>
    </table>

    <PaginationBar
      v-if="!errorSearching"
      :pageCount="Math.ceil(stampRecord.length / tableRow)"
      :paginationVisible="stampRecord.length > tableRow"
      @pageReturn="pageReturn"
      :style="
        width <= 1000
          ? {
              position: 'fixed',
              bottom: '30px',
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
  </TablePage>
</template>

<script>
import TablePage from "../components/TablePage.vue";
import DefaultButton from "../components/DefaultButton.vue";
import PaginationBar from "../components/PaginationBar.vue";
import { useScreenWidth } from "../composables/useScreenWidth";
import { useScreenHeight } from "../composables/useScreenHeight";
import CustomSelect from "../components/CustomSelect.vue";
import SearchError from "../components/SearchError";
import SortingArrow from "../components/SortingArrow";
import axios from "axios";
import Mixins from "../Mixins";

export default {
  name: "TimestampRecord",
  components: {
    TablePage,
    DefaultButton,
    PaginationBar,
    CustomSelect,
    SearchError,
    SortingArrow,
  },
  setup() {
    const { width } = useScreenWidth();
    const { height, tableRow } = useScreenHeight(430);
    return { width, height, tableRow };
  },
  created() {
    if (
      localStorage.getItem("userRole") !== "Owner" &&
      localStorage.getItem("userRole") !== "Admin"
    ) {
      this.$router.push("/Home");
      alert("You don't have permission to access this page");
    } else {
      this.getTodayTimeStamp();
    }
    this.past5Years = Mixins.methods.getPastYears(5);
    this.selectedYear = this.past5Years[0];
  },
  data() {
    return {
      past5Years: "",
      selectedYear: "",
      todayDate: "",
      stampRecord: "",

      keyword: "",
      selectOption: ["Date", "Employee ID", "Name", "Type", "Punctuality"],
      searchFilter: "stampDateTime",
      colNames: ["Date", "Employee ID", "Name", "Type", "Punctuality"],
      errorSearching: false,
      activeArrow: 0,
      sortFilter: "stampDateTime",
      sortDirection: "down",
      currentPage: 1,
      year: "",
    };
  },
  methods: {
    getTodayTimeStamp() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_timeStamp.php", {
          action: "getTodayTimeStamp",
          today: Mixins.methods.getTodayDate(),
          year: 2021,
        })
        .then(
          function(res) {
            this.stampRecord = res.data;
          }.bind(this)
        );
    },
    setSearchFilter(value) {
      if (value === this.selectOption[0]) {
        this.searchFilter = "stampDateTime";
      } else if (value === this.selectOption[1]) {
        this.searchFilter = "employeeID";
      } else if (value === this.selectOption[2]) {
        this.searchFilter = "name";
      } else if (value === this.selectOption[3]) {
        this.searchFilter = "type";
      } else if (value === this.selectOption[4]) {
        this.searchFilter = "late";
      }
    },
    setSortFilter(clickedArrow) {
      this.activeArrow = clickedArrow;
      if (clickedArrow === 0) {
        this.sortFilter = "stampDateTime";
      } else if (clickedArrow === 1) {
        this.sortFilter = "employeeID";
      } else if (clickedArrow === 2) {
        this.sortFilter = "name";
      } else if (clickedArrow === 3) {
        this.sortFilter = "type";
      } else if (clickedArrow === 4) {
        this.sortFilter = "late";
      }
    },
    setSelectedYear(year) {
      this.selectedYear = year;
    },
    sortReturn(direction) {
      this.sortDirection = direction;
      this.searchData();
    },
    pageReturn(page) {
      this.currentPage = page;
    },
    getTagColor(type) {
      if (type == "Out") {
        return "#FF0000";
      } else {
        return "#24BA45";
      }
    },

    searchData() {
      axios
        .post("http://localhost:8080/PocoLoco_db/api_timeStamp.php", {
          action: "searchData",
          keyword: this.keyword,
          searchFilter: this.searchFilter,
          sortFilter: this.sortFilter,
          direction: this.sortDirection,
          year: 2021,
        })
        .then(
          function(res) {
            this.stampRecord = res.data;

            if (this.stampRecord == "") {
              this.errorSearching = true;
            } else {
              this.errorSearching = false;
            }
          }.bind(this)
        );
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.menu-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search-buttons {
  display: flex;
  align-items: center;
}
.search-container {
  display: flex;
  align-items: center;
  position: relative;
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

table {
  width: 100%;
  margin-top: 50px;
  border: 1px solid black;
  border-collapse: collapse;
  align-self: flex-start;
  z-index: 0;
}
th {
  height: 35px;
  text-align: center;
  background-color: #eeeeee;
  border-bottom: 1px solid black;
}
.tb-head {
  display: flex;
  justify-content: center;
  align-items: center;
}
td {
  width: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  height: 35px;
}
.row:hover {
  cursor: pointer;
  background: var(--grey-highlight);
}
.fa-circle {
  font-size: 12px;
}
*:focus {
  outline: 0;
}
@media (max-width: 1000px) {
  .search-field {
    width: 180px;
  }
}
@media (max-width: 700px) {
  th {
    font-size: 14px;
  }
  td {
    font-size: 14px;
  }

  h3 {
    font-size: 44px;
    margin: 20px 0;
    padding: 0;
  }

  p {
    font-size: 14px;
  }
  .menu-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-buttons {
    margin-top: 30px;
  }
  .search-field {
    width: 280px;
    font-size: 16px;
  }
  .table-container {
    height: 450px;
  }
}
@media (max-width: 550px) {
  table {
    margin-top: 15px;
  }
}
</style>
