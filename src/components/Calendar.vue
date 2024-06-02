<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-body">
            <FullCalendar :options="calendarOptions"/>
          </div>
        </div>
      </div>
    </div>
    <WorkoutModal 
      :isVisible="isModalVisible" 
      :modalTitle="modalTitle" 
      @close="isModalVisible = false" 
      @add-workout="addWorkout"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mapGetters } from "vuex";
import WorkoutModal from './WorkoutModal.vue';

export default {
  name: "CalendarComponent",
  components: { FullCalendar, WorkoutModal },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        events: this.EVENTS,
        dateClick: this.handleDateClick,
      },
      isModalVisible: false,
      modalTitle: 'Add Workout',
      selectedDate: null,
    };
  },
  computed: {
    ...mapGetters(["EVENTS"]),
  },
  watch: {
    EVENTS: {
      handler(newEvents) {
        this.calendarOptions.events = newEvents;
      },
      deep: true
    }
  },
  methods: {
    handleDateClick(arg) {
      this.selectedDate = arg.dateStr;
      this.isModalVisible = true;
    },
    addWorkout(workoutTitle) {
      this.$store.commit("ADD_EVENT", {
        title: workoutTitle,
        start: this.selectedDate,
        allDay: true,
      });
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
  position: relative;
  z-index: 0;
}
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.card-body {
  padding: 20px;
}
</style>
