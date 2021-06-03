<template>
  <TablePage>
    <h3>Timestamp</h3>
    <div class="menu-bar">
      <div class="search-container">
        <i class="fa fa-search fa-1x"></i>
        <input
          v-model="search"
          class="search-field"
          type="text"
          placeholder="search"
          :style="{ marginBottom: '0' }"
        />
      </div>
      <div class="search-buttons">
        <CustomSelect
          type="Filter"
          :options="selectOption"
          :style="{ margin: '0 20px 20px 0' }"
          @selection="selectionFilter"
        />
        <DefaultButton @click="searchData" type="small">
          Search
        </DefaultButton>
      </div>
    </div>

    <SearchError v-if="errorSearching" />
    <table v-if="stampRecord.length !== 0 && !errorSearching">
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
      </tr>
      <tr
        v-for="(record, i) in stampRecord.slice(
          currentPage * tableRow - tableRow,
          currentPage * tableRow
        )"
        :key="i"
        class="row"
      >
        <td>{{ record.time }}</td>
        <td>{{ record.id }}</td>
        <td>{{ record.name }}</td>
        <td>{{ record.type }}</td>
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

const selectOption = ["Date", "Employee ID", "Name", "Type"];
const colNames = ["Date", "Employee ID", "Name", "Type"];
const stampRecord = [
  {
    time: "2564-05-17:12:00:11",
    id: "666666",
    name: "Ploypapas Pianchoopat",
    type: "IN",
  },
  {
    time: "2564-05-17:12:00:18",
    id: "666666",
    name: "Supavadee Phusanam",
    type: "OUT",
  },
  {
    time: "2564-05-17:18:00:11",
    id: "666666",
    name: "Ploypapas Pianchoopat",
    type: "OUT",
  },
  {
    time: "2564-05-17:19:05:11",
    id: "666666",
    name: "Pungjung MeCarrot",
    type: "IN",
  },
  {
    time: "2564-05-17:19:08:11",
    id: "666666",
    name: "Beam Soccerman",
    type: "IN",
  },
  {
    time: "2564-05-18:03:00:11",
    id: "666666",
    name: "Pungjung MeCarrot",
    type: "OUT",
  },
  {
    time: "2564-05-18:05:00:11",
    id: "666666",
    name: "Beam Soccerman",
    type: "OUT",
  },
  {
    time: "2564-05-18:06:00:00",
    id: "666666",
    name: "Mew Prettyspaghetti",
    type: "IN",
  },
  {
    time: "2564-05-18:05:00:18",
    id: "666666",
    name: "Supavadee Phusanam",
    type: "IN",
  },
  {
    time: "2564-05-18:12:00:11",
    id: "666666",
    name: "Ploypapas Pianchoopat",
    type: "IN",
  },
  {
    time: "2564-05-18:15:00:00",
    id: "666666",
    name: "Mew Prettyspaghetti",
    type: "OUT",
  },
];

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
    const { height, tableRow } = useScreenHeight(420);
    return { width, height, tableRow };
  },
  data() {
    return {
      selectOption,
      colNames,
      stampRecord,
      errorSearching: false,
      activeArrow: 0,
      sortDirection: "down",
      currentPage: 0,
    };
  },
  methods: {
    setActiveArrow(clickedArrow) {
      this.activeArrow = clickedArrow;
    },
    sortReturn(direction) {
      this.sortDirection = direction;
    },
    pageReturn(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
h3 {
  font-size: 48px;
  margin: 80px 0 35px 0;
}
.search-container {
  display: flex;
  align-items: center;
}
.search-field {
  width: 225px;
  height: 30px;
  padding-left: 45px;
  font-size: 16px;
  outline: none;
  z-index: 1;
  border: none;
  border-radius: 50px;
  margin-right: 20px;
}
.fa-search {
  color: #5f5f5f;
  margin-left: 15px;
  position: absolute;
  z-index: 5;
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
table {
  width: 100%;
  max-width: 1000;
  margin-top: 30px;
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
  .search-field {
    width: 250px;
    font-size: 16px;
  }
  h3 {
    margin: 40px 0 25px 0;
  }

  p {
    font-size: 14px;
  }
  .menu-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .search-buttons {
    margin-top: 20px;
  }
  table {
    margin-top: 15px;
  }
}
</style>
