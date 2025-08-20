<template>
  <q-card style="min-width: 400px">
    <q-card-section>
      <div class="text-h6">{{ initialTask ? 'Edit Task' : 'Add New Task' }}</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        v-model="form.title"
        label="Task Title"
        dense
        outlined
        class="q-mb-md"
      />
      <q-input
        v-model="form.description"
        label="Description"
        type="textarea"
        dense
        outlined
        class="q-mb-md"
      />
      <q-input
        v-model="form.fileUrl"
        label="Attached File URL (Optional)"
        dense
        outlined
        class="q-mb-md"
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="negative" @click="$emit('close')" />
      <q-btn unelevated :label="initialTask ? 'Save' : 'Add Task'" color="primary" @click="handleSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
// ADD THIS LINE
import type { Task } from '../stores/tasks';
// ----------------

import { ref, watch, defineEmits, defineProps } from 'vue';
import { useTasksStore } from 'stores/tasks';

const props = defineProps<{
  initialTask?: Task | null;
}>();

const emit = defineEmits(['close']);
const tasksStore = useTasksStore();

const form = ref({
  title: '',
  description: '',
  fileUrl: '',
});

watch(() => props.initialTask, (newVal) => {
  if (newVal) {
    form.value.title = newVal.title;
    form.value.description = newVal.description;
    form.value.fileUrl = newVal.fileUrl || '';
  } else {
    // Reset form for "Add"
    form.value.title = '';
    form.value.description = '';
    form.value.fileUrl = '';
  }
}, { immediate: true });

async function handleSubmit() {
  if (props.initialTask) {
    // Edit existing task
    const updatedTask = {
      ...props.initialTask,
      title: form.value.title,
      description: form.value.description,
      fileUrl: form.value.fileUrl,
    };
    await tasksStore.updateTask(updatedTask);
  } else {
    // Add new task
    await tasksStore.addTask(form.value);
  }
  emit('close');
}
</script>
