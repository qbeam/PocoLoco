<template>
  <div class="pagination-container" v-if="paginationVisible">
    <div class="pagination-row">
      <button
        class="pagination-button"
        @click="prevGroup"
        v-if="doubleArrowVisible"
      >
        <i class="fa fa-angle-double-left"></i>
      </button>

      <button class="pagination-button" @click="prev">
        <i class="fa fa-chevron-left fa-1x"></i>
      </button>

      <span
        v-for="(page, i) in pageNumber.slice(
          10 * pageGroup,
          10 * pageGroup + 10
        )"
        :key="i"
      >
        <button
          @click="setCurrentPage(page)"
          class="pagination-button"
          v-bind:style="
            currentPage === page
              ? { background: 'var(--primary-blue)', color: 'white' }
              : {}
          "
        >
          {{ page }}
        </button>
      </span>
      <button class="pagination-button" @click="next">
        <i class="fa fa-chevron-right fa-1x"></i>
      </button>
      <button
        class="pagination-button"
        @click="nextGroup"
        v-if="doubleArrowVisible"
      >
        <i class="fa fa-angle-double-right"></i>
      </button>
      <!-- <p>{{ pageCount }}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "PaginationBar",
  props: ["pageCount", "paginationVisible"],
  data() {
    return {
      currentPage: 1,
      pageNumber: null,
      pageGroup: 0,
      doubleArrowVisible: false,
    };
  },

  created() {
    this.setPageNumber();
  },

  watch: {
    pageCount: function() {
      this.setPageNumber();
    },
  },

  methods: {
    setPageNumber() {
      this.pageNumber = Array.from(new Array(this.pageCount), (x, i) => i + 1);
      if (this.pageCount / 10 > 1) {
        this.doubleArrowVisible = true;
      }
    },
    setPageGroup(current) {
      var i = 0;
      while (i < 20) {
        if (current > i * 10 && current <= i * 10 + 10) {
          return i;
        }
        i = i + 1;
      }
    },
    prev() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1;
        this.pageGroup = this.setPageGroup(this.currentPage);
        this.$emit("pageReturn", this.currentPage);
      }
    },
    next() {
      if (this.currentPage != this.pageCount) {
        this.currentPage = this.currentPage + 1;
        this.pageGroup = this.setPageGroup(this.currentPage);
        this.$emit("pageReturn", this.currentPage);
      }
    },
    prevGroup() {
      if (this.pageGroup > 0) {
        this.pageGroup -= 1;
        this.currentPage = this.pageGroup * 10 + 1;
      }
    },
    nextGroup() {
      if (this.pageGroup < Math.ceil(this.pageCount / 10) - 1) {
        this.pageGroup += 1;
        this.currentPage = this.pageGroup * 10 + 1;
      }
    },
    setCurrentPage(page) {
      this.currentPage = page;
      this.$emit("pageReturn", this.currentPage);
    },
  },
};
</script>

<style scoped>
.pagination-row {
  display: flex;
  justify-content: center;
}
.pagination-button {
  width: 25px;
  height: 25px;
  background: none;
  border: none;
  outline: none;
  border-radius: 50px;
  align-items: center;
  font-size: 12px;
  font-weight: 700;
  margin: 15px 3px;
  cursor: pointer;
  color: #989898;
}
.pagination-button:hover {
  background: #e2f2ff;
}
i {
  color: var(--primary-blue);
}
.fa-angle-double-left,
.fa-angle-double-right {
  font-size: 18px;
  font-weight: bold;
}
*:focus {
  outline: 0;
}
@media (max-width: 550px) {
  .pagination-button {
    margin: 15px 1px;
  }
}
</style>
