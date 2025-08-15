<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'Edit Task' : 'Add New Task' }}</div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="taskTitle"
          label="Task Title"
          dense
          outlined
          @keyup.enter="handleSubmit"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" @click="$router.back()" />
        <q-btn unelevated :label="isEdit ? 'Save' : 'Add Task'" color="primary" @click="handleSubmit" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from 'stores/task';

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const taskTitle = ref('');
const taskId = ref<number | null>(null);

const isEdit = computed(() => !!route.params.id);

onMounted(() => {
  if (isEdit.value) {
    taskId.value = Number(route.params.id);
    const taskToEdit = tasksStore.tasks.find(t => t.id === taskId.value);
    if (taskToEdit) {
      taskTitle.value = taskToEdit.title;
    }
  }
});

async function handleSubmit() {
  try {
    if (isEdit.value && taskId.value !== null) {
      await tasksStore.updateTask({
        id: taskId.value,
        title: taskTitle.value,
        completed: tasksStore.tasks.find(t => t.id === taskId.value)?.completed || false,
      });
    } else {
      await tasksStore.addTask(taskTitle.value);
    }
    // Only navigate after the async operation succeeds
    await router.push({ name: 'task-list' });
  } catch (error) {
    // Handle the error here, e.g., show a toast notification
    console.error('Failed to submit form:', error);
  }
}
</script>
