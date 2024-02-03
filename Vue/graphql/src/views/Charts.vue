<template>
    <NavBar />
    <Charts>
        <!-- Add dashboard-specific content here -->
    </Charts>
</template>
  
<script>
import NavBar from '@/components/NavBar.vue';
// import Charts from '@/components/BaseCharts.vue';
import '../assets/index.css'
import { mapState } from 'vuex';

export default {
    name: 'DashboardPage',
    components: {
        NavBar,
    },
    computed: {
        // Map the persisted state to a local computed property
        ...mapState({
            persistedState: state => state.persistedState
        }),
        pageClass() {
            const routeName = this.$route.name;
    
            import(`@/assets/index.css`);
        }
    },
    created() {
        // Access the persisted state in the created hook
        console.log(this.persistedState);
    }
};
</script>