<template>
  <CContainer>
    <HomeView></HomeView>
  </CContainer>
  <CContainer>
    <introComp></introComp>
    <br />
    <div class="form">
      <br />
      <CForm>
        <h4>Describe your company.</h4>
        <CFormInput
          type="text"
          id="floatingLabel"
          v-model="companyDescription"
        />
        <br />
        <h4>Describe your ideal customer.</h4>
        <CFormInput
          type="text"
          id="floatingLabel"
          v-model="audienceDescription"
        />
        <br />
        <!-- <CLoadingButton
          color="danger"
          variant="outline"
          loading="{{isLoading}}"
          @click="submitOpenAi"
          >calculate
        </CLoadingButton> -->

        <CButton
          id="button-submit"
          type="button"
          class="btn btn-danger"
          @click="submitOpenAi"
        >
          calculate
          <CSpinner v-if="isLoading" small class="ms-1" />
        </CButton>
      </CForm>
      <br />
    </div>
    <br />

    <div v-if="buttonClicked" class="map">
      <h4>AI Audience Description:</h4>
      <div v-for="(item, index) in audienceDescriptionAI" :key="index">
        <CCallout color="danger">
          {{ item }}
        </CCallout>
      </div>

      <div class="row">
        <div class="col-lg-6">
          <div class="rounded-box">
            <h3>Audience Resume</h3>
            <p v-text="audienceResume"></p>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="rounded-box">
            <h3>Recommended Schedule</h3>
            <br />
            <div v-for="(times, day) in audienceSchedule" :key="day">
              <CRow>
                <CCol>
                  <h5>{{ day }}:</h5>
                </CCol>
                <CCol>
                  <div style="display: flex; flex-wrap: wrap">
                    <div v-for="timeRange in times" :key="timeRange.join('-')">
                      {{ timeRange[0] }}:00 - {{ timeRange[1] }}:00
                    </div>
                  </div>
                </CCol>
              </CRow>
            </div>
          </div>
        </div>
      </div>
      <!-- last iteration -->
      <div class="rounded-box">
        <CRow>
          <CCol sm="12" lg="6">
            <!-- Map Column -->
            <div style="height: 20rem">
              <l-map
                ref="map"
                v-model:zoom="zoom"
                :center="[45.56537529099, -73.65430124888]"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  layer-type="base"
                  name="OpenStreetMap"
                ></l-tile-layer>

                <l-polygon
                  v-for="(item, index) in data"
                  :key="index"
                  :lat-lngs="swapPositions(item[4])"
                  :options="{
                    color: getColor(item[11]),
                    fill: true,
                    fillOpacity: 0.5,
                    fillColor: getColor(item[11]),
                  }"
                />

                <l-marker
                  v-for="(device, index) in devices"
                  :key="index"
                  :lat-lng="[device['lat'], device['long']]"
                  :options="{ icon: index < 3 ? yellowIcon : defaultIcon }"
                >
                </l-marker>
              </l-map>
            </div>
          </CCol>
          <CCol sm="6" md="{ span: 5, offset: 2 }" lg="{ span: 6, offset: 0 }">
            <h3>3 optimized location</h3>
            <!-- Devices Column -->
            <div v-for="(device, index) in devices.slice(0, 3)" :key="index">
              <CCallout color="danger">{{ device.name }}</CCallout>
            </div>
          </CCol>
        </CRow>
      </div>
      <!-- <deviceSelection></deviceSelection> -->
      <div class="d-grid gap-2 col-3 mx-auto">
        <CButton color="danger" @click="goToPreview">Preview</CButton>
        <CButton color="danger">Affine</CButton>
      </div>
    </div>
  </CContainer>
  <br />
</template>

<script lang="ts" setup>
import {
  CContainer,
  CButton,
  CForm,
  CFormInput,
  CSpinner,
  CCallout,
  CCol,
  CRow,
} from "@coreui/vue";
import "@coreui/coreui-pro/dist/css/coreui.min.css";

import deviceSelection from "@/components/deviceSelection.vue";
import introComp from "@/components/introComp.vue";

import { ref, computed } from "vue";

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPolygon, LMarker } from "@vue-leaflet/vue-leaflet";
import { icon, Icon } from "leaflet";

import { audienceObject, devices, Device } from "../stores/storesRef";

import { useRouter } from "vue-router";

// Workaround for marker icon URLs

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const defaultIcon = icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png", // URL to a yellow icon
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [6, 41],
  shadowSize: [41, 41],
});

const yellowIcon = icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png", // URL to a yellow icon
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [6, 41],
  shadowSize: [41, 41],
});

console.log("---");
const companyDescription = ref();
const audienceDescription = ref();

const age = ref();
const income = ref();

const audienceDescriptionAI = ref();
const audienceResume = ref();
const audienceSchedule = ref();
const audienceName = ref();

const zoom = ref(11.25);

const data = ref([]);

const buttonClicked = ref(false); // New variable to track button click
const isLoading = ref(false); // New variable
console.log("🚀 ~ file: formPage.vue:171 ~ isLoading:", isLoading);

const router = useRouter();

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

function swapPositions(coords: [number, number][]): [number, number][] {
  return coords.map(([lat, lng]: [number, number]) => [lng, lat]);
}

function submit() {
  console.log("try to fetch...");
  console.log(age.value);
  console.log(income.value);

  try {
    var raw = JSON.stringify({
      age: parseInt(age.value),
      income: parseInt(income.value),
    });

    fetch("https://g2qovq6txh.execute-api.us-east-1.amazonaws.com/audience", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("API result: ", result);
        // Store the result in data
        data.value = result.data;
        devices.value = result.devices;
        buttonClicked.value = true;
        isLoading.value = false; // Stop loading
      })
      .catch((error) => console.log("error", error));
  } catch (e) {
    console.log("not working");
    console.error(e);
  }
}

function submitOpenAi() {
  console.log("try to fetch OpenAi...");
  console.log(companyDescription.value);
  console.log(audienceDescription.value);
  isLoading.value = true; // Start loading

  try {
    var raw = JSON.stringify({
      varA: companyDescription.value,
      varB: audienceDescription.value,
    });

    fetch("https://g2qovq6txh.execute-api.us-east-1.amazonaws.com/audience", {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log("AI API result: ", result);
        age.value = result.targetAge;
        income.value = result.targetIncome;
        audienceDescriptionAI.value = result.audienceDescription;
        audienceResume.value = result.audienceResume;
        audienceSchedule.value = result.schedule;
        audienceName.value = result.audienceName;

        submit();

        return result;
      })
      .catch((error) => console.log("error", error));
  } catch (e) {
    isLoading.value = false; // Stop loading even if there was an error
    console.log("not working");
    console.error(e);
  }
}

function generateAudienceDataJson() {
  // Create a new array containing only selected groups
  const selectedGroups = groupedDevices.value.map((group) => {
    return group.filter((device) => device.selected);
  });
  // Remove empty groups
  const nonEmptySelectedGroups = selectedGroups.filter(
    (group) => group.length > 0
  );
  // Generate audience data object
  const audienceData = {
    companyDescription: companyDescription.value,
    audienceDescription: audienceDescription.value,
    targetAge: age.value,
    targetIncome: income.value,
    audienceDescriptionAI: audienceDescriptionAI.value,
    audienceResume: audienceResume.value,
    audienceSchedule: audienceSchedule.value,
    groupedDevices: nonEmptySelectedGroups,
    audienceName: audienceName.value,
  };

  return JSON.stringify(audienceData);
}

function goToPreview() {
  audienceObject.value = generateAudienceDataJson();
  router.push("/preview");
}

//Get the color for the circles over the map.
function getColor(value: number) {
  const hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%, 50%)"].join("");
}
</script>

<style>
.bullet-points {
  padding: 0 0 20px 20px;
  list-style-type: disc;
}

.bullet-points li {
  padding: 5px 0;
}
.form {
  background-color: rgba(246, 246, 246, 0.656);
  border: 2px solid black;
}

#floatingLabel {
  margin: auto;
  width: 90%;
}

.map {
  margin: auto;
}

/* .leaflet-layer,
.leaflet-control-zoom-in,
.leaflet-control-zoom-out,
.leaflet-control-attribution {
  filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
} */

.result-list {
  margin-top: 20px;
}

.rounded-box {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}
@media (max-width: 576px) {
  body {
    font-size: 0.875rem;
  }
}
@media (min-width: 576px) {
  body {
    font-size: 1rem;
  }
}
@media (min-width: 768px) {
  body {
    font-size: 1.125rem;
  }
}
</style>
