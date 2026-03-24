const deliveryCharges = {
  "andhra-pradesh": 80,
  "south-india": 120,
  "rest-of-india": 180
};

export const getDeliveryCharge = (region) => deliveryCharges[region] ?? 180;

export const regionLabel = (region) => {
  if (region === "andhra-pradesh") return "Andhra Pradesh";
  if (region === "south-india") return "South India";
  return "Rest of India";
};

export const isValidPincode = (pincode) => {
  const pin = String(pincode || "").trim();
  return /^\d{6}$/.test(pin);
};

export const getRegionFromPincode = (pincode) => {
  const pin = String(pincode || "").trim();
  if (!/^\d{6}$/.test(pin)) return null;

  const prefix2 = Number(pin.slice(0, 2));
  if (prefix2 >= 51 && prefix2 <= 53) {
    return "andhra-pradesh";
  }

  const first = pin[0];
  if (first === "5" || first === "6") {
    return "south-india";
  }

  return "rest-of-india";
};

const southStates = new Set([
  "andhra pradesh",
  "telangana",
  "karnataka",
  "kerala",
  "tamil nadu",
  "puducherry",
  "lakshadweep"
]);

export const getRegionFromState = (stateName = "") => {
  const normalized = stateName.trim().toLowerCase();
  if (!normalized) return "rest-of-india";
  if (normalized === "andhra pradesh") return "andhra-pradesh";
  if (southStates.has(normalized)) return "south-india";
  return "rest-of-india";
};
