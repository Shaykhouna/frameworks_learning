<template>
  <NavBar />
  <Dashboard>
    <!-- <div :class="pageClass"> -->
    <div v-if="success">
      <h1>Welcome, {{ data.userInfos[0].login }}</h1>
      <div class="container_board">
        <div id="graph-one" ref="graphOne" class="graph">
          <h2>Graph 1</h2>
          <!-- Add graph content here -->
        </div>
        <div id="graph-two" ref="graphTwo" class="graph">
          <h2>Graph 2</h2>
          <!-- Add graph content here -->
          <div id="svgRadarContainer">
          </div>
        </div>
      </div>

      <div class="container_board">
        <div id="graph-three" ref="graphThree" class="graph">
          <h2>Graph 3</h2>
          <div id="svgContainer">
          </div>
        </div>
      </div>
    </div>
    <div v-if="!success">
      <p>Loading... Or no data available</p>
    </div>
    <!-- </div> -->
  </Dashboard>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Dashboard from '@/components/BaseDashboard.vue';
import store from '@/store';
import '../assets/index.css';
import { mapState } from 'vuex';
import * as d3 from 'd3';
import LineChart from '@/components/charts/LineChart.vue'
import Profile from '@/views/Profile.vue';

export default {
  name: 'DashboardPage',
  components: {
    Dashboard,
    NavBar,
  },
  data() {
    return {
      data: {},
      success: false,
    }
  },
  created() {
    this.fetchData().then(res => {
      // this.drawGraph().then((res) => {
      const data = this.sortData(res)
      this.drawLineGraph(data.graphThreeData)
      this.drawRadarGraph(data.graphTwoData)
      // this.drawChart();

    });
  },
  computed: {
    // Map the persisted state to a local computed property
    ...mapState({
      persistedState: state => store.state.persistedState
    }),
    // pageClass() {
    //   const routeName = this.$route.name;

    //   import(`@/assets/index.css`);
    // }
  },
  methods: {
    async fetchData() {
      // const isAuthenticated = store.getters['auth/isAuthenticated'];
      // if (isAuthenticated) {
      const graphqlQuery = `query 
      { user { id login lastName firstName profile campus attrs } 
        skill_list: transaction (distinct_on: [type], where: {type: { _like: "%skill%"}}) {
          amount
          type
        }
        xp_view: transaction (where: { eventId: { _eq: 56}, type: { _eq:"xp" }}) {    
          amount
          createdAt
        }
      }`;
      try {
        const response = await fetch('https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtoken')}`
          },
          body: JSON.stringify({ query: graphqlQuery })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        this.data = {}
        // this.data = jsonData.data; // Update the data array with fetched data

        jsonData.data.xp_view.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        let amount = 0
        // Sum the amounts for dates that are the same
        const summedData = jsonData.data.xp_view.reduce((acc, curr) => {
          const date = curr.createdAt.split('T')[0]; // Extract the date portion
          if (!acc[date]) {
            acc[date] = [0, amount]; // Initialize the sum for the date
          }
          amount += curr.amount
          acc[date][0] += curr.amount
          acc[date][1] = amount
          // Add the amount to the sum for the date
          return acc;

        }, {});

        this.data["userInfos"] = jsonData.data.user
        this.data["xpDataset"] = summedData
        this.data["skills"] = jsonData.data.skill_list
        this.success = true
        return this.data

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // }
    },
    formatDate(inputDate) {
      // Parse the input date string into a Date object
      const date = new Date(inputDate);

      // Extract day and month components
      const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day with leading zero
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month with leading zero

      // Format day and month into "day-month" format
      const formattedDate = `${day}/${month}`;

      return formattedDate;
    },
    sortData(data) {
      let labels = []
      let pointData = []
      let dataset = []

      Object.keys(data.xpDataset).forEach(key => {
        labels.push(key)
        pointData.push(data.xpDataset[key][0])
        dataset.push(data.xpDataset[key][1])
      })
      let graphThreeData = { timeline: labels, dataSet: { point: pointData, sum: dataset } }

      return { graphThreeData: graphThreeData, graphTwoData: data.skills }
    },
    drawLineGraph(graphThreeData) {
      // DRAWING LINE GRAPH
      // Create SVG element
      const svgContainer = document.getElementById('svgContainer');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svgContainer.appendChild(svg);

      // Get SVG width and height
      const svgWidth = svg.clientWidth;
      const svgHeight = svg.clientHeight;

      // Create X-axis
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxis.setAttribute('x1', '0');
      xAxis.setAttribute('y1', svgHeight.toString());
      xAxis.setAttribute('x2', svgWidth.toString());
      xAxis.setAttribute('y2', svgHeight.toString());
      xAxis.setAttribute('stroke', 'black');
      svg.appendChild(xAxis);

      // Create Y-axis
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxis.setAttribute('x1', '0');
      yAxis.setAttribute('y1', '0');
      yAxis.setAttribute('x2', '0');
      yAxis.setAttribute('y2', svgHeight.toString());
      yAxis.setAttribute('stroke', 'black');
      svg.appendChild(yAxis);

      // Draw data points and lines
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      let points = '';
      for (let i = 0; i < graphThreeData.dataSet.sum.length; i++) {
        const x = (i / (graphThreeData.dataSet.sum.length - 1)) * svgWidth;
        const y = (1 - graphThreeData.dataSet.sum[i] / graphThreeData.dataSet.sum[graphThreeData.dataSet.sum.length - 1]) * svgHeight; // Assuming the maximum value in data is 250
        if (i != graphThreeData.dataSet.sum.length - 1) {
          points += `${x},${y} `;
        } else {
          points += `${x},${y}`
        }
      }
      polyline.setAttribute('points', points);
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', 'blue');
      polyline.setAttribute('stroke-width', '2');
      svg.appendChild(polyline);

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const firstPoint = points.trim().split(' ')[0];
      const lastPoint = points.trim().split(' ')[points.trim().split(' ').length - 1];
      const fillPoints = `${points} ${lastPoint.split(',')[0]},${svgHeight} ${firstPoint.split(',')[0]},${svgHeight}`;
      polygon.setAttribute('points', fillPoints);
      polygon.setAttribute('fill', 'lightblue'); // Set the fill color for the area below the line
      svg.appendChild(polygon);

      // Add X-axis labels
      let timing = []
      for (let i = 0; i < graphThreeData.timeline.length; i++) {
        const year = graphThreeData.timeline[i].split('-')[0]
        if (timing.includes(year)) {
        } else {
          timing.push(year)
        }
      }
      for (let i = 0; i < timing.length; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (i / (timing.length)) * svgWidth);
        text.setAttribute('y', svgHeight);
        text.setAttribute('fill', 'black'); // Set text color
        text.setAttribute('font-family', 'Arial'); // Set font family
        text.setAttribute('text-anchor', 'start');
        text.textContent = timing[i];
        text.style.zIndex = 999;
        svg.appendChild(text);
      }

      // Add Y-axis labels
      let Yvalue = 0
      for (let i = 0; i <= 5; i++) {
        const value = graphThreeData.dataSet.sum[graphThreeData.dataSet.sum.length - 1]
        Yvalue += (value * 1) / 5
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', svgWidth);
        text.setAttribute('y', (1 - i / 5) * svgHeight);
        text.setAttribute('text-anchor', 'end');
        text.textContent = `${Profile.methods.formatXP(Yvalue)}`
        svg.appendChild(text);
      }

      // Add X-axis title
      const xAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xAxisTitle.setAttribute('x', svgWidth / 2);
      xAxisTitle.setAttribute('y', svgHeight - 20);
      xAxisTitle.setAttribute('text-anchor', 'middle');
      xAxisTitle.textContent = 'Years';
      svg.appendChild(xAxisTitle);

      // Add Y-axis title
      const yAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      yAxisTitle.setAttribute('x', -svgHeight / 2);
      yAxisTitle.setAttribute('y', 20);
      yAxisTitle.setAttribute('text-anchor', 'middle');
      yAxisTitle.setAttribute('transform', 'rotate(-90)');
      yAxisTitle.textContent = 'Total Points';
      svg.appendChild(yAxisTitle);
      // DRAWING LINE GRAPH
    },
    drawRadarGraph(data) {
      const svgContainer = document.getElementById('svgRadarContainer');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '90%');
      svg.setAttribute('height', '90%');
      svg.style.zIndex = 99
      svgContainer.appendChild(svg);

      const svgWidth = svg.clientWidth;
      const svgHeight = svg.clientHeight;

      const numAxes = data.length; // Number of axes based on the data
      const radius = svgWidth/2; // Radius of the radar graph
      const center = { x: svgHeight/2, y: svgWidth/2 }; // Center of the SVG canvas

      for (let i = 0; i < numAxes; i++) {
        const angle = (Math.PI * 2 * i) / numAxes; // Calculate angle for each axis
        const x = center.x + radius * Math.cos(angle); // Calculate x-coordinate
        const y = center.y + radius * Math.sin(angle); // Calculate y-coordinate

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.textContent = data[i].type.split('_')[1]; // Use type from the data as label
        svg.appendChild(text);
      }
    }
  },
  nounted() {
    const graphOneHeight = this.$refs.graphOne.clientHeight;
    const graphOneWidth = this.$refs.graphOne.clientWidth;

    const graphTwoHeight = this.$refs.graphTwo.clientHeight;
    const graphTwoWidth = this.$refs.graphTwo.clientWidth;

    const graphThreeHeight = this.$refs.graphThree.clientHeight;
    const graphThreeWidth = this.$refs.graphThree.clientWidth;
  }
};
</script>

<style>
/* .container {
  display: block;
  justify-content: space-between;
  align-items: center;
  height: 400px;
  width: 40%;
} */

.container_board {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  height: 50vh;
  padding: 20px;
  box-sizing: border-box;
}


main div h1 {
  text-align: right;
  position: relative;
  padding: 0 50px 0 0;
}

.graph {
  flex: 1;
  margin: 15px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  background-color: #394264;
  height: 100%;
}

.graph h2 {
  margin-top: 0;
}

#graph-three {
  align-items: center;
}

/* svg {
  color: black;
  position: relative;
  z-index: 999;
} */

#svgContainer {
  /* border: 1px solid #000; */
  width: 100%;
  height: 80%;
}

#svgRadarContainer {
  width: 100%;
  height: 100%;
}
</style> 