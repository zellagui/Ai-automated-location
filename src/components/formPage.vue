<template>
  <CContainer>
    <h1>AI Automated Audience</h1>
    <br />

    <CContainer>
      <h3>Audience Discovery</h3>
      <p>
        Welcome to a new era of target audience identification. With our unique
        combination of advanced AI technology and comprehensive statistical
        data, we deliver precise, location-specific audience insights for your
        advertising needs. Just provide a brief description of your company and
        ideal customers, and our platform will do the rest. Experience
        unprecedented speed, accuracy, and efficiency in finding your optimal
        audience. Start making smarter advertising decisions today.
      </p>
    </CContainer>
    <CContainer>
      <img
        src="https://quest.mit.edu/sites/default/files/styles/event_image/public/2023-02/logo-80ed4b1996b528146ccfca998cf37b71.png?h=bfced127&itok=H0N74aRz"
        alt="AI Image"
        class="img-fluid"
        style="max-width: 30%"
      />
    </CContainer>
    <br />
    <CAccordion>
      <CAccordionItem :item-key="1">
        <CAccordionHeader> Describe Your Company </CAccordionHeader>
        <CAccordionBody>
          Please provide a brief summary of your company's main offerings,
          target market, and unique selling points. For instance, you might
          mention your flagship products or services, the geographic area you
          serve, and the unique qualities that set you apart from your
          competitors.
        </CAccordionBody>
      </CAccordionItem>
      <CAccordionItem :item-key="2">
        <CAccordionHeader> Identify Your Ideal Customers </CAccordionHeader>
        <CAccordionBody>
          Describe your perfect customer profile. This could include demographic
          information (such as age, gender, income level, or education),
          behaviors (such as shopping habits or lifestyle choices), and
          motivations (such as specific problems they need to solve or goals
          they're trying to achieve). The more detail you provide, the better
          our AI can tailor its results to your needs.
        </CAccordionBody>
      </CAccordionItem>
      <CAccordionItem :item-key="3">
        <CAccordionHeader> Disclaimer </CAccordionHeader>
        <CAccordionBody>
          Please note that the success of our AI analysis is based on the
          accuracy and detail of your inputs. The more specific you are, the
          better our AI can work for you. Keep in mind that while we strive for
          high accuracy, our tool should be used as a guide and complement to,
          not a replacement for, your own judgement and expertise. Our tool does
          not guarantee results, but provides potential insights to inform your
          decision-making process.
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>

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
        <CButton
          id="button-submit"
          type="button"
          class="btn btn-danger"
          @click="submitOpenAi"
        >
          calculate
          <CSpinner v-if="isLoading" small class="ms-2" />
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
            <ul>
              <li v-for="(time, index) in audienceSchedule" :key="index">
                <h5>{{ time }}</h5>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- last iteration -->
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
          :options="{ icon: defaultIcon }"
        >
        </l-marker>
      </l-map>
      <br />

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
      <div class="d-grid gap-2 col-3 mx-auto">
        <CButton color="primary">Preview</CButton>
        <CButton color="primary">Affine</CButton>
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

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPolygon, LMarker } from "@vue-leaflet/vue-leaflet";
import { icon, Icon } from "leaflet";

// Workaround for marker icon URLs

Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const defaultIcon = icon({
  iconUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41], // Changes the size of the icon
  iconAnchor: [6, 41], // Changes where the icon "points" to
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

const zoom = ref(11.25);

const data = ref([]);

const buttonClicked = ref(false); // New variable to track button click
const isLoading = ref(false); // New variable

interface Device {
  address: string;
  id: string;
  lat: number;
  long: number;
  matchID: number;
  normalized_abs_position: number;
  selected: boolean;
  name: string;
  score: number;
  city: string;
}

const devices = ref<Device[]>([]); // Use the Device interface to type the devices array

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

function swapPositions(coords: [number, number][]) {
  return coords.map(([lat, lng]: [number, number]) => [lng, lat]);
}

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
        for (let i = 0; i < 3 && i < devices.value.length; i++) {
          devices.value[i].selected = true;
        }
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
  };

  // Convert to JSON
  const audienceDataJson = JSON.stringify(audienceData);

  return audienceDataJson;
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
