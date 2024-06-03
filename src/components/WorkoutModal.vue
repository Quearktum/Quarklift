<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button @click="closeModal">Close</button>
      </div>
      <div class="modal-body">
        <input v-model="workout.exercise" placeholder="Enter exercise" />
        <input v-model="workout.reps" type="number" placeholder="Enter reps" />
        <input v-model="workout.sets" type="number" placeholder="Enter sets" />
        <input v-model="workout.weight" type="number" placeholder="Enter weight" />
      </div>
      <div class="modal-footer">
        <button @click="addWorkout">Add Workout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkoutModal",
  props: ["isVisible", "modalTitle"],
  data() {
    return {
      workout: {
        exercise: "",
        reps: "",
        sets: "",
        weight: ""
      },
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    addWorkout() {
      if (this.workout.exercise && this.workout.reps && this.workout.sets && this.workout.weight) {
        this.$emit("add-workout", this.workout);
        this.closeModal();
      } else {
        alert("Please fill in all fields.");
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
}

.modal-header,
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin-top: 10px;
  margin-bottom: 10px;
}

.modal-body input {
  margin-bottom: 10px;
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
