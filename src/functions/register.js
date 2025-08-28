import customAxios from "../utils/axios";
import { getTenantId, getToken } from "./authService";

export const getOrderReceipt = async (orderId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();

    return await customAxios
      .get(`/order/getReceipt/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getCategoryMenu = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/register/menu/category`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const addOrder = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/order/orderAdd`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getProducts = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/products/get`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};


export const getProductDetailsByInventoryId = async (inventoryId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/product/productDetailsByInventoryId?inventoryId=${inventoryId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};



export const getProductsPosMenu = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/product/getProductsPosMenu`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getVariationProductDetails = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/product/getVariationProductDetails`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getProductsAllVariations = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/product/productsAllVariations`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getProductExtraDetails = async (productId) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .get(`/product/products/extra?productId=${productId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getProductAvailaleStores = async (payload) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/product/getProductAvailaleStores`, payload, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const getNonSerializedItems = async (payload) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(
        `/product/getNonSerializedItems`,
        { payload },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
            tenantid: tenantId,
          },
        }
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

//products
export const addProduct = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/products`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const updateProduct = async (id, data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .put(`/products/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const deleteProduct = async (allProductId, isConfirm) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .delete(`/products?productId=${allProductId}&isConfirm=${isConfirm}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};

export const voidOrder = async (data) => {
  try {
    const tenantId = getTenantId();
    const token = getToken();
    return await customAxios
      .post(`/order/voidOrder`, data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          tenantid: tenantId,
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err.response;
      });
  } catch (err) {
    return err;
  }
};
