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
    async addWorkout(workout) {
      const newEvent = {
        title: workout.exercise,
        start: this.selectedDate,
        allDay: true,
        exercise: workout.exercise,
        reps: workout.reps,
        sets: workout.sets,
        weight: workout.weight,
        date: this.selectedDate,
        likes: 0 // Assuming likes start at 0
      };
      console.log('New Event:', newEvent); // Add console log for debugging
      try {
        await this.$store.dispatch("saveWorkout", newEvent);
      } catch (error) {
        console.error('Failed to save workout:', error);
      }
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
