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
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { mapGetters } from "vuex";

export default {
  name: "CalendarComponent",
  components: { FullCalendar },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        events: this.EVENTS,
        dateClick: this.handleDateClick,
      },
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
      console.log(arg);
      this.$store.commit("ADD_EVENT", {
        title: "okeoke",
        start: arg.dateStr,
        allDay: arg.allDay,
      });
      // let title = prompt("Enter workout title:");
      // if (title) {
      //   this.$store.commit("ADD_EVENT", {
      //     title: title,
      //     start: arg.dateStr,
      //     allDay: true
      //   });
      // }
    },
  },
};
</script>

<style scoped>
.container {
  margin: auto;
}
.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.card-body {
  padding: 20px;
}
</style>
