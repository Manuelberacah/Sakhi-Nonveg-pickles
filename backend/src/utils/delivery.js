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
