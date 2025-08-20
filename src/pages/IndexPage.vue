<template>
  <q-page padding>
    <q-card v-if="tasksStore.loading" class="q-ma-md">
      <q-card-section class="text-center">
        <q-spinner-dots size="40px" />
        <div class="q-mt-sm">Loading tasks...</div>
      </q-card-section>
    </q-card>
    <q-card v-if="tasksStore.error" class="q-ma-md text-red">
      <q-card-section>
        {{ tasksStore.error }}
      </q-card-section>
    </q-card>
    <div class="q-mb-md text-right">
      <q-btn label="Add New Task" color="primary" icon="add" @click="showAddDialog = true" />
    </div>
    <q-list bordered separator>
      <q-item
        v-for="task in tasksStore.sortedTasks"
        :key="task.id"
        class="task-item"
        :class="{ 'task-completed': task.completed }"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="task.completed" @update:model-value="tasksStore.updateTask(task)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
          <q-item-label caption>{{ task.description }}</q-item-label>
          <q-item-label caption class="text-grey-6">
            Created: {{ new Date(task.createdAt).toLocaleDateString() }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="q-gutter-sm">
            <q-btn
              v-if="task.fileUrl"
              flat
              round
              icon="attachment"
              color="grey"
              @click.stop="openAttachment(task.fileUrl)"
            />
            <q-btn flat round icon="edit" color="primary" @click.stop="openEditDialog(task)" />
            <q-btn flat round icon="delete" color="negative" @click.stop="tasksStore.deleteTask(task.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="showAddDialog">
      <task-form @close="showAddDialog = false" />
    </q-dialog>

    <q-dialog v-model="showEditDialog">
      <task-form :initial-task="selectedTask" @close="showEditDialog = false" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTasksStore } from 'src/stores/tasks';
import TaskForm from 'pages/TaskForm.vue';
import type { Task } from '../stores/tasks';

const tasksStore = useTasksStore();
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const selectedTask = ref<Task | null>(null);

function openEditDialog(task: Task) {
  selectedTask.value = task;
  showEditDialog.value = true;
}

function openAttachment(url: string) {
  window.open(url, '_blank');
}

onMounted( async () => {
  await tasksStore.fetchTasks();
});
</script>

<style>
.task-completed {
  background-color: #f0f0f0;
  color: #9e9e9e;
}
</style>

