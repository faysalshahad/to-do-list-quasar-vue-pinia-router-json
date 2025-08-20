import { defineStore } from 'pinia';
import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description: string;
  fileUrl?: string; // Optional property
  completed: boolean;
  createdAt: string; // ISO 8601 string
}

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  }),
  getters: {
    // Sorts tasks to show uncompleted ones first
    sortedTasks: (state) => {
      const sorted = [...state.tasks];
      sorted.sort((a, b) => {
        if (a.completed === b.completed) {
          return 0;
        }
        return a.completed ? 1 : -1;
      });
      return sorted;
    },
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
    async addTask(task: Omit<Task, 'id' | 'completed' | 'createdAt'>) {
      try {
        const newTask = {
          ...task,
          completed: false,
          createdAt: new Date().toISOString()
        };
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

