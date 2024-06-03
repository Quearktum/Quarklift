<template>
  <div>
    <h1 v-if="currentUser">Welcome, {{ currentUser.username }}!</h1>
    <h1 v-else>Loading...</h1>
    <CalendarComponent/>
  </div>
</template>

<script>
import CalendarComponent from "@/components/Calendar.vue";
import { mapGetters } from 'vuex';

export default {
  name: "DashboardView",
  components: {
    CalendarComponent
  },
  computed: {
    ...mapGetters(['currentUser'])
  }
}
</script>

<style scoped></style>
