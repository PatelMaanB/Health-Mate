import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const fetchData = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      authentication: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data;
};

export default fetchData;
