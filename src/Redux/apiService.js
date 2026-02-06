import axios from "axios";
import { Alert } from "react-native";
import { getAccessToken, getUserData } from "./Storage";
import { API_BASE_URL } from '../config';

/* ================= AXIOS INSTANCE ================= */
export const BASE_URL = API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

console.log('🚀 API Client Base URL:', apiClient.defaults.baseURL);

/* ================= REQUEST INTERCEPTOR ================= */
apiClient.interceptors.request.use(
  async (config) => {
    console.log('📤 REQUEST:', config.method?.toUpperCase(), config.baseURL + config.url);
    
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - let axios handle it
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error.message);
    return Promise.reject(error);
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

/* ================= HELPERS ================= */
const getUserId = async () => {
  const user = await getUserData();
  return user?.id;
};

/* ================= API SERVICES ================= */
const apiService = {
 
  getProfileDetails: async () => {
    try {
      console.log("fsdbafbdsab")

      const token = await getAccessToken();
      console.log('🔍 Token exists:', !!token);
      console.log('🔍 Token preview:', token ? token.substring(0, 20) + '...' : 'none');
      console.log('🔍 Getting profile from:', apiClient.defaults.baseURL + '/api/user/getUserDetails');
      
      const response = await apiClient.get("/api/user/getUserDetails");
      console.log('✅ Profile response status:', response.status);
      console.log('✅ Profile response data:', JSON.stringify(response.data, null, 2));
      console.log('✅ Returning:', response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      console.error("❌ Get profile error:", error.message);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      
      // Network-specific error messages
      if (error.message === 'Network Error') {
        console.error("\n⚠️  NETWORK ERROR TROUBLESHOOTING:");
        console.error("1. Check if backend server is running on", apiClient.defaults.baseURL);
        console.error("2. For Android Emulator, use: http://10.0.2.2:9000");
        console.error("3. For Physical Device, ensure same WiFi network");
        console.error("4. Check Windows Firewall allows port 9000");
        console.error("5. Verify backend is listening on 0.0.0.0:9000 (not localhost)");
      }
      
      throw error;
    }
  },

  
  UpdateProfileData: async (data) => {
    try {
      console.log('🔄 Updating profile at:', apiClient.defaults.baseURL + '/api/user/update-profile');
      console.log('📝 Data type:', data instanceof FormData ? 'FormData' : 'JSON');
      
      const config = {
        timeout: 300000, // 5 minutes for uploads
      };
      
      if (!(data instanceof FormData)) {
        config.headers = {
          'Content-Type': 'application/json',
        };
      }
      
      const response = await apiClient.put("/api/user/update-profile", data, config);
      console.log('✅ Profile update response:', response.status);
      return response.data;
    } catch (error) {
      console.error('❌ Profile update error:', error.message);
      console.error('Update URL:', apiClient.defaults.baseURL + '/api/user/update-profile');
      throw error;
    }
  },

  uploadDocuments: async (formData) => {
    try {
      console.log('📄 Uploading documents...');
      const response = await apiClient.put("/api/user/update-profile", formData, {
        timeout: 300000,
      });
      console.log('✅ Documents uploaded successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Document upload error:', error.message);
      throw error;
    }
  },



  /* ---------- CROP LISTING ---------- */
  addCropListing: async (formData) => {
    try {
      const userId = await getUserId();
      if (!userId) throw new Error("Login required");
      formData.append("userId", userId);
      const response = await apiClient.post("/api/crop-listing/add", formData, {
        timeout: 300000, // 5 minutes for image uploads
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCropListings: async () => {
    const res = await apiClient.get("/api/crop-listing/getListings");
    return res.data;
  },

  getUserCropListings: async () => {
    const res = await apiClient.get("/api/crop-listing/getListingsByUser");
    return res.data;
  },

  updateCropListing: async (id, data) => {
    const userId = await getUserId();
    const res = await apiClient.put(`/api/crop-listing/update/${id}`, {
      ...data,
      userId,
    });
    return res.data;
  },

  deleteCropListing: async (id) => {
    const userId = await getUserId();
    const res = await apiClient.delete(`/api/crop-listing/delete/${id}`, {
      data: { userId },
    });
    return res.data;
  },

  /* ---------- REGISTRATION ---------- */
  FarmerRegister: async (payload) => {
    try {
      const response = await apiClient.post("/api/user/register", payload);
      return response.data;
    } catch (error) {
      Alert.alert("Error", "Farmer registration failed");
      throw error;
    }
  },

  StafRegister: async (payload) => {
    const response = await apiClient.post("/api/user/register", payload);
    return response.data;
  },

  FPORegister: async (payload) => {
    const response = await apiClient.post("/api/user/register", payload);
    return response.data;
  },

  /* ---------- PRODUCTS ---------- */
  FPOproduct: async (payload) => {
    const res = await apiClient.post("/api/product/addProduct", payload);
    return res.data;
  },

 updateProduct: async (id, payload) => {
  
    const res = await apiClient.put(`/api/product/updateProduct/${id}`, payload);
    return res.data;
  
},

  deleteProduct: async (id) => {
    try {
      const res = await apiClient.delete(`/api/product/deleteProduct/${id}`);
      return res.data;
    } catch (error) {
      console.error('❌ deleteProduct error:', error.message);
      throw error;
    }
  },

  toggleProductStatus: async (id) => {
    try {
      const res = await apiClient.put(`/api/product/toggleProductStatus/${id}`);
      return res.data;
    } catch (error) {
      console.error('❌ toggleProductStatus error:', error.message);
      throw error;
    }
  },

  GetFPOProduct: async () => {
    const res = await apiClient.get("/api/product/getProducts");
    return res?.data?.data;
  },

  /* ---------- STAFF ---------- */
  Stafproduct: async (payload) => {
    const res = await apiClient.post("/api/purchase/addPurchase", payload);
    return res.data;
  },

  GetStaffPurches: async () => {
    const res = await apiClient.get("/api/purchase/getPurchases");
    return res?.data?.data;
  },

  getAllFarmers: async () => {
    const res = await apiClient.get("/api/user/getAllFarmers");
    return res?.data?.data;
  },

  //farmer
  GetMarketplaceItems: async () => {
    const res = await apiClient.get("/api/marketplace/items");
    return res.data;
  },

  /* ---------- CART ---------- */
  addToCart: async (payload) => {
    const res = await apiClient.post("/api/cart/add", payload);
    return res.data;
  },

  getCart: async () => {
    const res = await apiClient.get("/api/cart/get-cart");
    console.log("📦 CART - Items count:", res.data?.data?.items?.length || 0);
    return res.data;
  },

  updateCart: async (payload) => {
    console.log("🔄 UPDATE - Payload:", payload);
    const res = await apiClient.put("/api/cart/update", payload);
    console.log("✅ UPDATE - Response:", JSON.stringify(res.data, null, 2));
    return res.data;
  },

  deleteCartItem: async (itemId) => {
    console.log("🗑️ DELETE - Item ID:", itemId);
    const res = await apiClient.delete(`/api/cart/remove/${itemId}`);
    console.log("✅ DELETE - Response:", JSON.stringify(res.data, null, 2));
    return res.data;
  },

  clearCart: async () => {
    const res = await apiClient.delete("/api/cart/remove-all");
    return res.data;
  },

  placeOrder: async () => {
    const res = await apiClient.post("/api/order/place", {});
    return res.data;
  },

  getAllOrders: async () => {
    const res = await apiClient.get("/api/order/allOrders");
    return res.data;
  },

  /* ---------- FARM ---------- */
  addFarm: async (payload) => {
    console.log('🌾 Adding farm with payload:', JSON.stringify(payload, null, 2));
    const res = await apiClient.post("/api/farm/addFarm", payload);
    return res.data;
  },

  updateFarmById: async (id, payload) => {
    const res = await apiClient.put(`/api/farm/updateFarmById/${id}`, payload);
    return res.data;
  },

  deleteFarmById: async (id) => {
    const res = await apiClient.delete(`/api/farm/deleteFarmById/${id}`);
    return res.data;
  },

  getFarmByFarmId: async (id) => {
    const res = await apiClient.get(`/api/farm/getFarmByFarmId/${id}`);
    return res.data;
  },

  getFarmsByUserId: async (id) => {
    const res = await apiClient.get(`/api/farm/getFarmsByUserId/${id}`);
    return res.data;
  },

  /* ---------- CROP ---------- */
  addCrop: async (payload) => {
    const res = await apiClient.post("/api/crop/addCrop", payload);
    return res.data;
  },

  updateCropById: async (id, payload) => {
    const res = await apiClient.put(`/api/crop/updateCrop/${id}`, payload);
    return res.data;
  },

  deleteCropById: async (id) => {
    const res = await apiClient.delete(`/api/crop/deleteCrop/${id}`);
    return res.data;
  },

  getUserCropsByUserId: async () => {
    const res = await apiClient.get("/api/crop/getCropsByUser");
    return res.data;
  },

  getAllCrops: async () => {
    const res = await apiClient.get("/api/crop/getAllCrops");
    return res.data;
  },
};

export default apiService;
