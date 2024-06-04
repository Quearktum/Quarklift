<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="btn btn-secondary" @click="closeModal">Close</button>
      </div>
      <div class="modal-body">
        <div class="input-group">
          <label>Exercise</label>
          <input v-model="workout.exercise" placeholder="Enter exercise" @input="validateExercise" />
          <div v-if="errors.exercise" class="error">{{ errors.exercise }}</div>
        </div>
        
        <div class="input-group">
          <label>Reps</label>
          <input v-model.number="workout.reps" type="number" placeholder="Enter reps" @input="validateReps" />
          <div v-if="errors.reps" class="error">{{ errors.reps }}</div>
        </div>
        
        <div class="input-group">
          <label>Sets</label>
          <input v-model.number="workout.sets" type="number" placeholder="Enter sets" @input="validateSets" />
          <div v-if="errors.sets" class="error">{{ errors.sets }}</div>
        </div>
        
        <div class="input-group">
          <label>Weight</label>
          <input v-model.number="workout.weight" type="number" placeholder="Enter weight" @input="validateWeight" />
          <div v-if="errors.weight" class="error">{{ errors.weight }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="saveWorkout">{{ modalButtonText }}</button>
        <button v-if="workoutData" @click="deleteWorkout" class="btn btn-danger">Delete Workout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkoutModal",
  props: ["isVisible", "modalTitle", "workoutData"],
  data() {
    return {
      workout: {
        exercise: "",
        reps: "",
        sets: "",
        weight: ""
      },
      errors: {
        exercise: null,
        reps: null,
        sets: null,
        weight: null
      }
    };
  },
  watch: {
    workoutData: {
      handler(newWorkout) {
        if (newWorkout) {
          this.workout = { ...newWorkout };
        } else {
          this.workout = { exercise: "", reps: "", sets: "", weight: "" };
        }
      },
      immediate: true
    }
  },
  computed: {
    modalButtonText() {
      return this.workoutData ? 'Update Workout' : 'Add Workout';
    }
  },
  methods: {
    validateExercise() {
      if (!this.workout.exercise) {
        this.errors.exercise = "Exercise is required.";
      } else {
        this.errors.exercise = null;
      }
    },
    validateReps() {
      if (!Number.isInteger(this.workout.reps) || this.workout.reps <= 0) {
        this.errors.reps = "Reps must be a positive integer.";
      } else {
        this.errors.reps = null;
      }
    },
    validateSets() {
      if (!Number.isInteger(this.workout.sets) || this.workout.sets <= 0) {
        this.errors.sets = "Sets must be a positive integer.";
      } else {
        this.errors.sets = null;
      }
    },
    validateWeight() {
      if (!Number.isInteger(this.workout.weight) || this.workout.weight <= 0) {
        this.errors.weight = "Weight must be a positive integer.";
      } else {
        this.errors.weight = null;
      }
    },
    closeModal() {
      this.$emit("close");
    },
    saveWorkout() {
      this.validateExercise();
      this.validateReps();
      this.validateSets();
      this.validateWeight();

      if (!this.errors.exercise && !this.errors.reps && !this.errors.sets && !this.errors.weight) {
        this.$emit("save-workout", this.workout);
        this.closeModal();
      }
    },
    deleteWorkout() {
      this.$emit("delete-workout", this.workout.id);
      this.closeModal();
    }
  }
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

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.error {
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
}
</style>
