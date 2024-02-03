<template>
  
</template>
  
<script>
export default {
  name: 'LineChart',
  props: {
    cx: Number,
    cy: Number,
    r: Number,
    stroke: String,
    strokeWidth: Number,
    fill: String,
  },
  mounted() {
    console.log("Componenent Mounted")
  }
};
</script>

<style>
  .line-chart-container {
    margin: 5px;
  }

  .line-chart {
    width: 90%;
    height: 80%;
  }

</style>