<template>
  <q-page padding>
    <q-card v-if="tasksStore.loading" class="q-ma-md">
      <q-card-section>
        <q-spinner-dots size="40px" /> Loading tasks...
      </q-card-section>
    </q-card>
    <q-card v-if="tasksStore.error" class="q-ma-md text-red">
      <q-card-section>
        {{ tasksStore.error }}
      </q-card-section>
    </q-card>
    <q-list bordered separator>
      <q-item v-for="task in tasksStore.tasks" :key="task.id" clickable v-ripple>
        <q-item-section avatar>
          <q-checkbox v-model="task.completed" @update:model-value="tasksStore.updateTask(task)" />
        </q-item-section>
        <q-item-section :class="{ 'text-strike text-grey-6': task.completed }">
          {{ task.title }}
        </q-item-section>
        <q-item-section side>
          <div class="q-gutter-sm">
            <q-btn flat round icon="edit" color="primary" @click.stop="$router.push({ name: 'edit-task', params: { id: task.id } })" />
            <q-btn flat round icon="delete" color="negative" @click.stop="tasksStore.deleteTask(task.id)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTasksStore } from 'stores/task';

const tasksStore = useTasksStore();

onMounted(async () => {
  await tasksStore.fetchTasks();
});
</script>
