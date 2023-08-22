<template>
  <CContainer>
    <!-- Header row -->
    <CRow class="text-center">
      <CCol class="border">
        <strong>Name</strong>
      </CCol>
      <CCol class="border">
        <strong>Address</strong>
      </CCol>
      <CCol class="border">
        <strong>Score</strong>
      </CCol>
      <CCol class="border">
        <strong>City</strong>
      </CCol>
      <CCol class="border">
        <strong>Action</strong>
      </CCol>
    </CRow>

    <!-- Grouped Data rows -->
    <div
      v-for="(group, index) in groupedDevices.slice(0, displayLimit)"
      :key="index"
    >
      <CRow class="text-center">
        <CCol class="border">
          {{ group[0].name }}
          <!-- Display name of first device in the group -->
        </CCol>
        <CCol class="border">
          {{ group[0].address }}
          <!-- Display address of first device in the group -->
        </CCol>
        <CCol class="border text-center">
          <!-- Display average score of the group -->
          {{
            Math.round(
              (group.reduce(
                (acc, device) => acc + (1 - device.normalized_abs_position),
                0
              ) /
                group.length) *
                100
            )
          }}%
        </CCol>
        <CCol class="border">
          {{ group[0].city }}
          <!-- Display city of first device in the group -->
        </CCol>
        <CCol class="border text-center">
          <div>
            <!-- Display a switch for the first device in the group -->
            <CFormSwitch
              size="xl"
              :id="group[0].id"
              v-model="group[0].selected"
              @change="toggleSelection(index)"
            />
          </div>
        </CCol>
      </CRow>
    </div>

    <br />
    <!-- <CButton
          type="button"
          color="danger"
          class="btn btn-primary"
          @click="showMore"
        >
          Show More
        </CButton> -->
  </CContainer>
  <br />
</template>

<script setup lang="ts">
import {
  CContainer,
  CButton,
  CForm,
  CFormInput,
  CAccordion,
  CAccordionHeader,
  CAccordionBody,
  CAccordionItem,
  CSpinner,
  CCallout,
  CCol,
  CRow,
  CFormSwitch,
} from "@coreui/vue";

import { ref, computed } from "vue";

//import the ref object containing the device fetched from <formPage> and also the Device interface to keep the object form.
import { devices, Device } from "../stores/storesRef";

const groupedDevices = computed(() => {
  const groups: Record<string, Device[]> = {}; // Use the Device interface to type the groups object
  for (let device of devices.value) {
    if (groups[device.address]) {
      groups[device.address].push(device);
    } else {
      groups[device.address] = [device];
    }
  }
  return Object.values(groups);
});

// function to toggle selection status
function toggleSelection(index: number) {
  devices.value[index].selected = !devices.value[index].selected;
}
// Variable to keep track of the display limit
let displayLimit = ref(5);

// Function to load more devices
const showMore = () => {
  displayLimit.value += 10;
};
</script>
