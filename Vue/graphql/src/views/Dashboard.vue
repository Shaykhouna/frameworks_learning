<template>
  <NavBar />
  <Dashboard>
      <!-- <div :class="pageClass"> -->
      <div v-if="success">
        <h1>Welcome, {{ data.data.user[0].login }}</h1>
        <div class="container">
          <div class="graph">
            <h2>Graph 1</h2>
            <!-- Add graph content here -->
          </div>
          <div class="graph">
            <h2>Graph 2</h2>
            <!-- Add graph content here -->
          </div>
        </div>

        <div class="container">
          <div class="graph">
            <h2>Graph 3</h2>
            <!-- Add graph content here -->
          </div>
          <div class="graph">
            <h2>Graph 4</h2>
            <!-- Add graph content here -->
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
import '../assets/index.css'
import { mapState } from 'vuex';

export default {
  name: 'DashboardPage',
  data() {
    return {
      data: {},
      success: false
    }
  },
  components: {
    Dashboard,
    NavBar,
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
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // const isAuthenticated = store.getters['auth/isAuthenticated'];
      // if (isAuthenticated) {
      const graphqlQuery = `query { user { id login lastName firstName profile campus attrs } 
        skill_list: transaction (distinct_on: [type], where: {type: { _like: "%skill%"}}) {
          amount
          type
        }
      audits_done: transaction_aggregate (where: { type: { _eq:"up" }}) {    aggregate {      sum { amount }    }  }
      audits_received: transaction_aggregate (where: { type: { _eq:"down" }}) {    aggregate {      sum { amount }    }  }
      total_xp: transaction_aggregate (where: { eventId: { _eq: 56}, type: { _eq:"xp" }}) {    aggregate {      sum { amount }    }  }}`;
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
        console.log(jsonData.data.user[0].login)
        this.success = true
        this.data = jsonData; // Update the data array with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // }
    }
  }
};
</script>

<style>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 400px;
}

main div h1 {
  text-align: right;
  position: relative;
  padding: 0 50px 0 0;
}

.graph {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f5f5f5;
  height: 100%;
}

.graph h2 {
  margin-top: 0;
}
</style>