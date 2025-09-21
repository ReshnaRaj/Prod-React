import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  // Products
  getProducts: async () => {
    const response = await axios.get(`${BASE_URL}/Products`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axios.post(`${BASE_URL}/Products`, productData);
    return response.data;
  },
  getUnits: async () => {
    const response = await axios.get(`${BASE_URL}/Units`);
    return response.data;
  },
  createUnit: async (unitData) => {
    try {
      const response = await axios.post(`${BASE_URL}/Units`, unitData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error(`Unit with name '${unitData.unitName}' already exists`);
      }
      throw error;
    }
  },

  // Sales
 createSale: async (saleData) => {
  try {
    
    const response = await axios.post(`${BASE_URL}/Sales`, saleData, {
      headers: { "Content-Type": "application/json" },
    });
    
    return response.data;
  } catch (error) {
    
    throw error;
  }
},


  getSales: async () => {
    const response = await axios.get(`${BASE_URL}/Sales`);
  
    return response.data;
  },
};
