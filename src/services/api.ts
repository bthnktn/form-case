import axios from "axios";

export const getPicData = async () => {
  const baseURL = `https://picsum.photos/id/${Date.now() % 100}/info`;
  const returnData = await axios.get(`${baseURL}`);
  return returnData.data;
};
