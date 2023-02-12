import axios from "axios";

const getAllCard = async () => {
  const response = await axios.get("/api/dashboard-cards");
  return response.data;
};

const getPdpTraffic = async () => {
  const response = await axios.get("/api/pdp-traffic");
  return response.data;
};

const getProductTraffic = async () => {
  const response = await axios.get("/api/product-traffic");
  return response.data;
};


// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPdpTraffic,
  getAllCard,
  getProductTraffic
  
};
