import { defineStore } from 'pinia';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    completedTasks: (state) => state.tasks.filter(task => task.completed),
    pendingTasks: (state) => state.tasks.filter(task => !task.completed),
  },
  actions: {
    async fetchTasks() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/tasks');
        this.tasks = response.data;
      } catch (err) {
        this.error = 'Failed to fetch tasks.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async addTask(taskTitle: string) {
      try {
        const newTask = { title: taskTitle, completed: false };
        const response = await axios.post('http://localhost:3000/tasks', newTask);
        this.tasks.push(response.data);
      } catch (err) {
        this.error = 'Failed to add task.';
        console.error(err);
      }
    },
    async updateTask(updatedTask: Task) {
      try {
        await axios.put(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask);
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      } catch (err) {
        this.error = 'Failed to update task.';
        console.error(err);
      }
    },
    async deleteTask(id: number) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${id}`);
        this.tasks = this.tasks.filter(t => t.id !== id);
      } catch (err) {
        this.error = 'Failed to delete task.';
        console.error(err);
      }
    },
  },
});
