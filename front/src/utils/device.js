import { v4 as uuid } from "uuid";

export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId) {
    deviceId = uuid();
    localStorage.setItem("deviceId", deviceId);
  }

  return deviceId;
};
