import axios from 'axios';

export const getAffiliateLink = async (username: string) => {
  const response = await axios.get(
    `${process.env.BASE_URL}/user-service/v1/public/mco/affiliate/${username}`
  );
  return response.data;
};
