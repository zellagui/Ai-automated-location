<template>
  <CContainer>
    <div class="rounded-box">
      <h2>Confirm your audience</h2>
      <CRow>
        <CCol sm="auto"><strong>Name</strong></CCol>
        <CCol sm="6">
          <CFormInput v-model="audienceObject.audienceName"></CFormInput>
        </CCol>
        <CCol sm="auto"><strong>date</strong></CCol>
        <CCol sm="auto">
          <CFormInput v-model="formatted"></CFormInput>
        </CCol>
      </CRow>
      <br />
      <Crow>
        <CCol><strong>Description</strong></CCol>
      </Crow>
      <CFormFloating>
        <CFormTextarea
          v-model="audienceObject.audienceDescriptionAI"
          style="height: 95px"
        ></CFormTextarea>
      </CFormFloating>
      <br />
      <h3>Audience Schedule:</h3>
      <TimePickerWeek></TimePickerWeek>
      <br />
      <!-- <deviceSelection></deviceSelection> -->
      <br />
      <deviceSmartTable></deviceSmartTable>
      <CButton color="primary" size="lg">Submit</CButton>
    </div>
  </CContainer>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { audienceObject } from "../stores/storesRef";
import {
  CContainer,
  CFormInput,
  CFormFloating,
  CFormTextarea,
  CCol,
  CRow,
  CButton,
} from "@coreui/vue";

import deviceSelection from "@/components/deviceSelection.vue";
import TimePickerWeek from "@/components/TimePickerWeek.vue";
import deviceSmartTable from "@/components/deviceSmartTable.vue";

import { useNow, useDateFormat } from "@vueuse/core";

const formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");

onMounted(() => {
  audienceObject.value = JSON.parse(audienceObject.value);
});
</script>

<style>
.rounded-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
</style>
