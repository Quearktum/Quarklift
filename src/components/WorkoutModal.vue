<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeModal">Close</button>
        </div>
        <div class="modal-body">
          <input v-model="workoutTitle" placeholder="Enter workout title" />
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
        workoutTitle: "",
      };
    },
    methods: {
      closeModal() {
        this.$emit("close");
      },
      addWorkout() {
        this.$emit("add-workout", this.workoutTitle);
        this.closeModal();
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
    z-index: 1000; /* Ensure it's on top */
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
  </style>
  