import { computed, onMounted, onUnmounted, ref } from "vue";

export const useScreenHeight = (headerHeight) => {
  let windowHeight = ref(window.innerHeight);

  const onHeightChange = () => (windowHeight.value = window.innerHeight);
  onMounted(() => window.addEventListener("resize", onHeightChange));
  onUnmounted(() => window.removeEventListener("resize", onHeightChange));

  const height = computed(() => windowHeight.value);
  const tableRow = computed(() => {
    const MaxRow = Math.floor((windowHeight.value - headerHeight) / 35);
    if (MaxRow > 0) {
      return MaxRow;
    } else {
      return 1;
    }
  });

  return { height, tableRow };
};
