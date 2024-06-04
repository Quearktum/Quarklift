<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
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
      :workoutData="selectedWorkout" 
      @close="isModalVisible = false" 
      @save-workout="saveWorkout"
      @delete-workout="deleteWorkout"
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
        eventClick: this.handleEventClick 
      },
      isModalVisible: false,
      modalTitle: 'Add Workout',
      selectedDate: null,
      selectedWorkout: null
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
    async fetchWorkouts() {
      try {
        await this.$store.dispatch('fetchWorkouts');
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    },
    handleDateClick(arg) {
      this.selectedDate = arg.dateStr;
      this.modalTitle = 'Add Workout';
      this.selectedWorkout = null;
      this.isModalVisible = true;
    },
    handleEventClick(info) {
      console.log('Clicked event ID:', info.event.id);
      console.log('Events array:', this.EVENTS);
      const workout = this.EVENTS.find(event => event.id == info.event.id);
      console.log('Workout: ', workout);
      if (workout) {
        this.selectedDate = workout.date;
        this.modalTitle = 'Update Workout';
        this.selectedWorkout = { ...workout };
        this.isModalVisible = true;
      }
    },
    async saveWorkout(workout) {
      console.log('Saving workout:', workout);
      if (this.selectedWorkout) {
        // Update existing workout
        const updatedEvent = {
          ...this.selectedWorkout,
          ...workout,
          id: this.selectedWorkout.id, 
          start: this.selectedDate,
          title: workout.exercise,
          allDay: true
        };
        console.log('Updated workout data:', updatedEvent);
        try {
          await this.$store.dispatch("updateWorkout", updatedEvent);
        } catch (error) {
          console.error('Failed to update workout:', error);
        }
      } else {
        // Add new workout
        const newEvent = {
          title: workout.exercise,
          start: this.selectedDate,
          allDay: true,
          exercise: workout.exercise,
          reps: workout.reps,
          sets: workout.sets,
          weight: workout.weight,
          date: this.selectedDate,
          likes: 0 
        };
        console.log('New workout data:', newEvent);
        try {
          await this.$store.dispatch("saveWorkout", newEvent);
        } catch (error) {
          console.error('Failed to save workout:', error);
        }
      }
    },
    async deleteWorkout(eventId) {
      console.log('Deleting workout ID:', eventId);
      try {
        await this.$store.dispatch("deleteWorkout", eventId);
        this.isModalVisible = false;
        this.selectedWorkout = null;
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    }
  },
  mounted() {
    this.fetchWorkouts(); 
  }
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
