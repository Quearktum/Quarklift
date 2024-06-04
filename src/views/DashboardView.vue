<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col text-center">
        <h1 v-if="currentUser">Welcome, {{ currentUser.username }}!</h1>
        <h1 v-else>Welcome</h1>
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-10">
        <CalendarComponent/>
      </div>
    </div>
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

<style scoped>

</style>
