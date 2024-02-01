
<template>
  <NavBar />
  <Profile>
    <!-- <ul>
      <li v-for="item in data" :key="item.id">{{ item.data }}</li>
    -->
    <div v-if="success">
      <h1>Welcome, {{ data.data.user[0].login }}</h1>
      <div class="container">
        <!-- User Badge -->
        <div class="gamified-info">

          <div class="info-section">
            <h2>XP Information</h2>
            <span class="main-info"> {{ formatXP(data.data.total_xp.aggregate.sum.amount) }}</span>
          </div>

          <div class="info-section">
            <h2>Level Information</h2>
            <span class="main-info">{{ data.levelgrade }}</span>
          </div>

          <div class="info-section">
            <h2>Audits Information</h2>
            <span class="main-info">{{ data.auditratio }}</span>
            <p class="secondary">
              <span><span style="font-size: 1em;">&#x2934;</span> Done {{ data.auditdone }} </span>
              <span> Received {{ data.auditreceived }} <span style="font-size: 1em;">&#x2935;</span></span>
            </p>
          </div>

          <!-- <div class="info-section">
            <h2>Skills Information</h2>
            <span class="main-info">{ To Load }</span>
          </div> -->
        </div>
        <div class="user-badge">
          <div class="badge">
            <div class="info">
              <div class="label">Last Name:</div>
              <div class="value">{{ data.data.user[0].lastName }}</div>
            </div>
            <div class="info">
              <div class="label">First Name:</div>
              <div class="value">{{ data.data.user[0].firstName }}</div>
            </div>
            <div class="info">
              <div class="label">Login:</div>
              <div class="value">{{ data.data.user[0].login }}</div>
            </div>
            <div class="info">
              <div class="label">Email:</div>
              <div class="value">{{ data.data.user[0].attrs.email }}</div>
            </div>
            <div class="info">
              <div class="label">Live at:</div>
              <div class="value">{{ data.data.user[0].campus }}</div>
            </div>
            <div class="info">
              <div class="label">Phone Number:</div>
              <div class="value">{{ data.data.user[0].attrs.phone }}</div>
            </div>
            <div class="info">
              <div class="label">Sexe:</div>
              <div class="value">{{ data.data.user[0].attrs.gender }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!success">
        <p>Loading... Or no data available</p>
      </div>
    </div>

    <div v-if="success">
      <div class="container">
        <div class="main-content">
          <!-- Content will be dynamically loaded here based on menu selection -->
        </div>
        <div class="sidebar">
          <div class="user-identification">
            <div class="badge">

            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Render a placeholder or loading message -->
      <p>Loading... Or no data available</p>
    </div>
  </Profile>
</template>

<script>
import Profile from '@/components/BaseProfile.vue';
import NavBar from '@/components/NavBar.vue'
import '../assets/index.css'

export default {
  name: 'ProfilePage',
  data() {
    return {
      data: {},
      success: false
    }
  },
  components: {
    Profile,
    NavBar
  },
  computed: {
    pageClass() {
      const routeName = this.$route.name;

      import('@/assets/index.css');
    }
  },
  // Access the persisted state in the created hook
  created() {
    this.fetchData();
  },
  methods: {
    formatAudit(datum) {
      if ((datum / 1000000) >= 1) {
        return `${(datum / 1000000).toFixed(2)} MB`
      } else if ((datum / 1000) >= 0) {
        return `${(datum / 1000).toFixed(2)} kB`
      } else {
        return `${datum} B`
      }
    },
    formatXP(datum) {
      if ((datum / 1000000) >= 1) {
        return `${(Math.ceil(datum / 1000000))} MB`
      } else if ((datum / 1000) >= 1) {
        return `${Math.ceil(datum / 1000)} kB`
      } else {
        return `${datum} B`
      }
    },
    async fetchData() {
      // const isAuthenticated = store.getters['auth/isAuthenticated'];
      // if (isAuthenticated) {
      const graphqlQuery = `
      query { 
        user { 
          id 
          login 
          lastName 
          firstName 
          profile 
          campus 
          attrs 
        }
        audits_done: transaction_aggregate (where: { type: { _eq:"up" }}) {    
          aggregate {      
            sum { 
              amount 
            } 
          }  
        }
        audits_received: transaction_aggregate (where: { type: { _eq:"down" }}) {
          aggregate {      
            sum { 
              amount }}}
        total_xp: transaction_aggregate (where: { eventId: { _eq: 56}, type: { _eq:"xp" }}) {
          aggregate {
            sum { 
              amount }}}
        transaction (where: {type: { _eq: "level"}, eventId: { _eq: 56}}, order_by: {amount: desc}) {
           amount 
          }
        }
      `;
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
        this.success = true
        this.data = jsonData; // Update the data array with fetched data
        this.data["auditratio"] = (jsonData.data.audits_done.aggregate.sum.amount / jsonData.data.audits_received.aggregate.sum.amount).toFixed(1)
        this.data["auditreceived"] = this.formatAudit(jsonData.data.audits_received.aggregate.sum.amount)
        this.data["auditdone"] = this.formatAudit(jsonData.data.audits_done.aggregate.sum.amount)
        this.data["levelgrade"] = jsonData.data.transaction[0].amount
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      // }
    }
  }
};
</script>

<style>
/* Container */
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

main div h1 {
  text-align: right;
  position: relative;
  padding: 0 50px 0 0;
  z-index: 1;
}
/* Gamified Info Section */
.gamified-info {
  display: flex;
  flex-wrap: wrap;
}

/* Individual Info Section */
.info-section {
  margin: 10px;
  flex-basis: calc(50% - 20px);
  /* Adjust width as needed */
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  flex-direction: column;
  justify-items: space-around;
}

/* Heading for Info Section */
.info-section h2 {
  margin: 0;
  position: relative;
  text-align: left;
  top: 0px;
  left: 0px;
}

.info-section .main-info {
  margin: 5px;
  text-align: right;
  position: relative;
  font-size: 8vw;
}

.info-section p {
  align-content: end;
}

.info-section .secondary {
  margin: 5px;
  display: flex;
  justify-content: space-between;
}

/* User Badge */
.user-badge {
  flex: 1;
  padding: 20px;
  /* border: 1px solid #ccc; */
  margin-right: 10px;
  background-color: #394264;
  border-radius: 10px;
}

/* Gamified Information */
.gamified-info {
  flex: 1;
  padding: 20px;
  /* border: 1px solid #ccc; */
  background-color: #394264;
  border-radius: 10px;
  justify-content: space-around;
}

/* User Identification Details */
.user-badge .badge {
  font-family: 'Roboto', sans-serif;
  color: #fff;
}

.user-badge .badge .info {
  margin-bottom: 15px;
}

.user-badge .badge .info .label {
  font-weight: bold;
  color: #141e30;
}

.user-badge .badge .info .value {
  color: #fff;
}

.user-badge {
  flex: 1;
}

.gamified-info {
  flex: 3;
  margin-right: 10px
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .user-badge,
  .gamified-info {
    margin-right: 0;
    margin-bottom: 20px;
  }
}
</style>