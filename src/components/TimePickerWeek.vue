<template>
  <CContainer class="TimeComp">
    <div class="time-table">
      <div class="timeSelection">
        <!-- <div class="time-selector"> -->
        <CTable small stripedColumns class="time-selector">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell></CTableHeaderCell>
              <CTableHeaderCell v-for="day in weekdays" :key="day">{{
                day
              }}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="hour in Array(24).keys()" :key="hour">
              <CTableHeaderCell
                >{{ hour.toString().padStart(2, "0") }}:00</CTableHeaderCell
              >
              <CTableDataCell
                class="table-cell"
                v-for="(day, index) in Array(7).keys()"
                :key="index"
                @click="handleClick(hour, index)"
                @mouseover="handleMouseOver(hour)"
                :class="{ range: isInRange(hour, index) }"
              ></CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </div>
    </div>

    <!-- </div> -->
  </CContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  CButton,
  CContainer,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableHead,
  CTableDataCell,
  CTableBody,
} from "@coreui/vue";

import { audienceObject } from "../stores/storesRef";

type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let selectedDay = ref<Weekday | null>(null);
let rangeStart = ref<number | null>(null);
let rangeEnd = ref<number | null>(null);

const hoverStart = ref<number | null>(null);
const hoverEnd = ref<number | null>(null);
const hoverDay = ref<Weekday | null>(null);

//reference point of the cell value
const selectedValue = ref<number>();

// Define the type for audienceObject
type AudienceObject = {
  companyDescription: string;
  audienceDescription: string[];
  targetAge: number;
  targetIncome: number;
  audienceDescriptionAI: string;
  audienceResume: string;
  audienceSchedule: Record<Weekday, number[][]>;
  groupedDevices: any[]; // Define the correct type for groupedDevices if needed
};

// Inside onMounted hook we extract the audience data
onMounted(() => {
  const audienceData = JSON.parse(audienceObject.value) as AudienceObject;
  const schedule = audienceData.audienceSchedule;

  // Loop through the schedule and update the week ref
  for (const [day, scheduleForDay] of Object.entries(schedule)) {
    week.value[day as Weekday] = scheduleForDay;
  }
});

const week = ref<Record<Weekday, number[][]>>({
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
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

function clear() {
  selectedDay.value = null;
  rangeStart.value = null;
  rangeEnd.value = null;
  hoverStart.value = null;
  hoverEnd.value = null;
  hoverDay.value = null;
  week.value = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  };
  rangeSet.value = []; // This clears the rangeSet
  rangeSetString.value = [];
}

function handleMouseOver(hour: number) {
  if (
    selectedDay.value !== null &&
    rangeStart.value !== null &&
    rangeEnd.value === null
  ) {
    hoverDay.value = selectedDay.value;
    hoverStart.value = rangeStart.value;
    hoverEnd.value = hour;
  }
}

function handleClick(hour: number, dayIndex: number) {
  const dayOfWeek = weekdays[dayIndex] as Weekday;

  // Check if the clicked hour is within an existing range
  const existingRangeIndex = week.value[dayOfWeek].findIndex(
    ([start, end]) => hour >= start && hour <= end
  );

  // If the clicked hour is within an existing range, clear the range for that day
  if (existingRangeIndex !== -1) {
    week.value[dayOfWeek].splice(existingRangeIndex, 1);
  }

  if (selectedDay.value !== dayOfWeek) {
    selectedDay.value = dayOfWeek;
    rangeStart.value = hour;
    rangeEnd.value = null;
  } else if (rangeStart.value !== null && rangeEnd.value === null) {
    rangeEnd.value = hour;
    week.value[dayOfWeek].push([rangeStart.value, rangeEnd.value]);
    rangeStart.value = null;
    rangeEnd.value = null;
  } else {
    rangeStart.value = hour;
    rangeEnd.value = null;
    hoverStart.value = null;
    hoverEnd.value = null;
    hoverDay.value = null;
  }

  // You can log the updated week object here
  console.log("Week object:", JSON.stringify(week.value));
}

const isInRange = (hour: number, dayIndex: number) => {
  const dayOfWeek = weekdays[dayIndex] as Weekday;
  if (
    hoverDay.value === dayOfWeek &&
    hoverStart.value !== null &&
    hoverEnd.value !== null &&
    hour >= hoverStart.value &&
    hour <= hoverEnd.value
  ) {
    return true;
  }
  return isBetweenRange(hour, dayIndex);
};
const isBetweenRange = (hour: number, dayIndex: number) => {
  const dayOfWeek = weekdays[dayIndex] as Weekday;
  const ranges = week.value[dayOfWeek];
  return ranges.some(([start, end]) => hour >= start && hour <= end);
};
</script>
<style>
.timeSelection {
  border: 1px solid rgb(219, 219, 219);
}

.time-selector td,
.time-selector th {
  font-size: 15px; /* Adjust the font size */
  padding: 2px 2px; /* Adjust the padding */
  text-align: center;
}

.table-cell:hover {
  background-color: rgba(103, 255, 103, 0.86);
}
.table-cell.range {
  background-color: rgba(26, 206, 26, 0.86);
}
.inputTime {
  margin: auto;
}
</style>
