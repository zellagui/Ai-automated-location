<template>
  <h2>Location</h2>
  <CSmartTable
    :items="tableItems"
    :columns="columns"
    columnSorter
    pagination
    selectable
    :tableProps="{ striped: true, hover: true, bordered: true }"
    @selected-items-change="handleSelection"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { CSmartTable } from "@coreui/vue-pro";
import { devices, Device } from "../stores/storesRef";

// Call initializeSelection when the component is mounted
onMounted(initializeSelection);

// Function to initialize the selection
function initializeSelection() {
  for (let i = 0; i < 5 && i < devices.value.length; i++) {
    devices.value[i]._selected = true; // Use "_selected" instead of "selected"
  }
}

// Group devices by address
const groupedDevices = computed(() => {
  const groups: Record<string, Device[]> = {};
  for (let device of devices.value) {
    if (groups[device.address]) {
      groups[device.address].push(device);
    } else {
      groups[device.address] = [device];
    }
  }
  return Object.values(groups);
});

// Define columns
const columns = [
  { key: "name", label: "Name", _style: { width: "30%" } },
  { key: "address", label: "Address", _style: { width: "40%" } },
  { key: "score", label: "Score", _style: { width: "10%" } },
  { key: "city", label: "City", _style: { width: "20%" } },
];

// Prepare table items
const tableItems = computed(() => {
  return groupedDevices.value.map((group) => ({
    name: group[0].name,
    address: group[0].address,
    score:
      Math.round(
        (group.reduce(
          (acc, device) => acc + (1 - device.normalized_abs_position),
          0
        ) /
          group.length) *
          100
      ) + "%",
    city: group[0].city,
    _selected: group[0]._selected, // Include the "_selected" property
  }));
});

// Function to handle the selection change
function handleSelection(selectedItems: unknown) {
  if (Array.isArray(selectedItems)) {
    // Use the selectedItems array to update the selected property of the devices
    devices.value.forEach((device, index) => {
      device._selected = selectedItems.includes(index);
    });
  } else {
    console.warn("Unexpected structure for selected items:", selectedItems);
  }
}
</script>
