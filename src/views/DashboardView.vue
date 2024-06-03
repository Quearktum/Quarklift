<template>
  <div>
    <h1>Dashboard</h1>
    <CalendarComponent/>
  </div>
</template>

<script>

import CalendarComponent from "@/components/Calendar.vue";

export default {
  name: "DashboardView",
  components: {
    CalendarComponent
  }
}
</script>

<style scoped></style>

