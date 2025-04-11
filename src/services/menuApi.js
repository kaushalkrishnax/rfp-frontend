
export const getCategoriesAPI = (rfpFetch) =>
  rfpFetch("/menu/categories");

export const getItemsByCategoryAPI = (rfpFetch, categoryId) =>
  rfpFetch(`/menu/categories/${categoryId}`);

export const addCategoryAPI = (rfpFetch, name, image) =>
  rfpFetch("/menu/categories/add", {
    method: "POST",
    body: JSON.stringify({ name, image }),
  });

export const updateCategoryAPI = (rfpFetch, categoryId, name, image) =>
  rfpFetch("/menu/categories/update", {
    method: "PUT",
    body: JSON.stringify({ id: categoryId, name, image }),
  });

export const removeCategoryAPI = (rfpFetch, categoryId) =>
  rfpFetch(`/menu/categories/remove/${categoryId}`, {
    method: "DELETE",
  });

export const addItemAPI = (rfpFetch, categoryId, name, variants) =>
  rfpFetch("/menu/items/add", {
    method: "POST",
    body: JSON.stringify({ category_id: categoryId, name, variants }),
  });

export const updateItemAPI = (rfpFetch, itemId, name, variants) =>
  rfpFetch("/menu/items/update", {
    method: "PUT",
    body: JSON.stringify({ id: itemId, name, variants }),
  });

export const removeItemAPI = (rfpFetch, itemId) =>
  rfpFetch(`/menu/items/remove/${itemId}`, {
    method: "DELETE",
  });

export const createRazorpayOrderAPI = (rfpFetch, amount) =>
  rfpFetch("/orders/create/razorpay", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

export const verifyRazorpayOrderAPI = (
  rfpFetch,
  user_id,
  items,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  amount
) =>
  rfpFetch("/orders/verify/razorpay", {
    method: "POST",
    body: JSON.stringify({
      user_id,
      items,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    }),
  });

export const createCodOrderAPI = (rfpFetch, user_id, items, amount) =>
  rfpFetch("/orders/create/cod", {
    method: "POST",
    body: JSON.stringify({ user_id, items, amount }),
  });
