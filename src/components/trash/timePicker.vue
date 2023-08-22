<template>
  <CContainer class="TimeComp">
    <CRow>
      <CCol sm="auto">
        <h4>time:</h4>
      </CCol>
      <CCol sm="10">
        <CFormInput
          type="text"
          class="inputTime"
          size="md"
          @click="modal = true"
          :value="placeholderValue()"
          aria-label="lg input example"
        />
      </CCol>
    </CRow>
    <div v-if="modal" v-on-click-outside="closeModal" class="timeSelection">
      <div class="time-table">
        <table class="hoursTable" ref="hoursTableRef">
          <tr v-for="i in 4" :key="i">
            <td
              v-for="j in 24"
              :key="j"
              :class="{
                range: isBetweenRange((i - 1) * 24 + j - 1),
              }"
              @mouseover="() => (selectedValue = (i - 1) * 24 + j - 1)"
              @mouseout="() => (selectedValue = undefined)"
              @click="() => handleClick((i - 1) * 24 + j - 1)"
            >
              {{ i * 24 + j }}
            </td>
          </tr>
        </table>
        <table class="front-hoursTable">
          <tr v-for="i in 4" :key="i">
            <td v-for="j in 6" :key="j">{{ (i - 1) * 6 + j - 1 }}</td>
          </tr>
        </table>
      </div>
      <div class="selection">
        <h4 class="rangeText">
          [
          {{ selectedValue ? rangeToString(selectedRange) : undefined }}
          ]
        </h4>
        <p class="rangeText">{{ rangeSetString }}</p>
        <CButton @click="clear" class="m-2" color="warning">clear </CButton>
        <CButton @click="closeModal" class="m-2" color="warning"
          >submit</CButton
        >
      </div>
    </div>
  </CContainer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { CButton, CContainer, CCol, CRow, CFormInput } from "@coreui/vue";

import { vOnClickOutside } from "@vueuse/components";

import { useNow, useDateFormat } from "@vueuse/core";

// import { fridayRange } from "@/storeRange";

//range value
const rangeStart = ref<number>();
const rangeEnd = ref<number>();

//reference point of the cell value
const selectedValue = ref<number>();

const selectedRange = computed<[number, number]>(() => {
  const selected = selectedValue.value;
  const start = rangeStart.value;
  const end = rangeEnd.value;

  const a =
    start === undefined ? (selected === undefined ? 9999 : selected) : start;
  const b =
    end === undefined ? (selected === undefined ? 9999 : selected) : end;
  return a <= b ? [a, b] : [b, a];
});

//list of ranges selected
const rangeSet = ref<[number, number][]>([]);
const rangeSetString = ref<string[]>([]);

//place holder value
function placeholderValue() {
  if (rangeSetString.value.length === 0) {
    return "click to set range ";
  } else {
    return rangeSetString.value;
  }
}

//time selector appear
const modal = ref(false);
function closeModal() {
  modal.value = false;
}

//Handle click to set range
function handleClick(cell: number) {
  console.log(cell);
  if (rangeStart.value === undefined) {
    rangeStart.value = cell;
  } else if (rangeEnd.value === undefined) {
    rangeEnd.value = cell;
    addRange();
  } else {
    rangeStart.value = cell;
    rangeEnd.value = undefined;
  }
}

function clear() {
  rangeStart.value = undefined;
  rangeEnd.value = undefined;
  rangeSet.value = [];
  rangeSetString.value = [];
}

//add set of range
function addRange() {
  const a = rangeStart.value;
  const b = rangeEnd.value;
  if (a === undefined || b === undefined) {
    return;
  }
  rangeSetString.value.push(rangeToString([a, b]));
  rangeSet.value.push([a, b]);
  rangeStart.value = undefined;
  rangeEnd.value = undefined;
}

const isBetweenRange = (cell: number) => {
  const selected = selectedValue.value;

  if (selected === cell) return true;

  for (const range of rangeSet.value) {
    if (cellInRange(cell, range)) {
      return true;
    }
  }

  return cellInRange(cell, selectedRange.value);
};

function cellInRange(cell: number, [a, b]: [a: number, b: number]) {
  return cell >= a && cell <= b;
}

function rangeToString([a, b]: [a: number, b: number]): string {
  return `${slotToString(a)}-${slotToString(b + 1)}`;
}

function slotToString(slot: number) {
  if (isNaN(slot) || slot > 96) {
    return "";
  }
  const hours = Math.floor(slot / 4);
  const minutes = (slot % 4) * 15;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
</script>

<style>
.timeSelection {
  border: 1px solid black;
  max-width: 100%;
  height: 50%;
  margin-bottom: 5rem;
}
.time-table {
  position: relative;
  margin-bottom: 5%;
}

.hoursTable {
  table-layout: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
}

table.hoursTable td {
  color: rgba(255, 255, 255, 0);
  opacity: 0.3;
  border-bottom: solid black;
  cursor: hand;
  cursor: pointer;
}

.front-hoursTable {
  top: 0; /* align the top of the div with the top of the timeSelector div */
  left: 0; /* align the left of the div with the left of the timeSelector div */
  width: 100%; /* set the width to be the same as the timeSelector div */
  height: 100%; /* set the height to be the same as the timeSelector div */
  z-index: -1; /* make sure the front-hours-div is on top of the timeSelector div */
  position: absolute;
}
.front-hoursTable td {
  border: 1px solid black;
}

.hoursTable td:hover {
  background-color: rgba(115, 255, 0, 0.398);
}
.range {
  background-color: rgba(115, 255, 0, 0.54);
}

.inputTime {
  margin: auto;
}
</style>
