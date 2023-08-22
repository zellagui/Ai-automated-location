import { ref } from "vue";

// eslint-disable-next-line prefer-const
let audienceObject = ref();

interface Device {
  address: string;
  id: string;
  lat: number;
  long: number;
  matchID: number;
  normalized_abs_position: number;
  selected?: boolean;
  name: string;
  score: number;
  city: string;
}
const devices = ref<Device[]>([]); // Use the Device interface to type the devices array

export { audienceObject, devices, Device };
