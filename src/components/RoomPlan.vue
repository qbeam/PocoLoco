<template>
  <div class="map">
    <div class="long-row">
      <div class="big" :style="{ background: '#FFC42E' }">{{ floor }}03</div>
      <div class="small" :style="{ background: '#FFC42E' }">{{ floor }}02</div>
      <div class="small" :style="{ background: '#FFC42E' }">{{ floor }}01</div>
      <div class="elevator">E</div>
      <div class="elevator">E</div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}20</div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}19</div>
      <div class="big" :style="{ background: '#79D7FF' }">{{ floor }}18</div>
    </div>
    <div class="opposite">
      <div class="small" :style="{ background: '#FFC42E' }">{{ floor }}04</div>
      <div class="walkway"></div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}17</div>
    </div>
    <div class="center">
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}05</div>
      <div class="path"></div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}23</div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}22</div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}21</div>
      <div class="path"></div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}16</div>
    </div>
    <div class="center">
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}06</div>
      <div class="path"></div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}24</div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}25</div>
      <div class="small" :style="{ background: '#9C9C9C' }"></div>
      <div class="path"></div>
      <div class="small" :style="{ background: '#79D7FF' }">{{ floor }}15</div>
    </div>
    <div class="opposite">
      <div class="small" :style="{ background: '#FFABAB' }">{{ floor }}07</div>
      <div class="walkway"></div>
      <div class="small" :style="{ background: '#95E4A7' }">{{ floor }}04</div>
    </div>
    <div class="long-row">
      <div class="big" :style="{ background: '#FFABAB' }">{{ floor }}03</div>
      <div class="small" :style="{ background: '#FFABAB' }">{{ floor }}02</div>
      <div class="small" :style="{ background: '#FFABAB' }">{{ floor }}01</div>
      <div class="elevator">E</div>
      <div class="elevator">E</div>
      <div class="small" :style="{ background: '#95E4A7' }">{{ floor }}20</div>
      <div class="small" :style="{ background: '#95E4A7' }">{{ floor }}19</div>
      <div class="big" :style="{ background: '#95E4A7' }">{{ floor }}18</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RoomPlan",
    props: ["floor"],
  };
</script>

<style scoped>
  .map {
    display: flex;
    background: var(--light-grey);
    flex-direction: column;
    width: 100%;
    max-width: 1000px;
    align-self: center;
  }
  .long-row {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .big {
    display: flex;
    width: 23%;
    height: 50px;
    background: red;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
  }
  .small {
    display: flex;
    width: 12%;
    height: 50px;
    background: blue;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
  }
  .elevator {
    display: flex;
    width: 5%;
    background: #d8d4d4;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
  }
  .opposite {
    display: flex;
    justify-content: center;
  }
  .walkway {
    display: flex;
    width: 80%;
  }
  .center {
    display: flex;
  }
  .path {
    display: flex;
    width: 21.5%;
  }
</style>
