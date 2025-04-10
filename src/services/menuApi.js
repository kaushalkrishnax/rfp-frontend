export const getCategoriesAPI = (rfpFetch) => rfpFetch("/menu/categories");

export const getItemsByCategoryAPI = (rfpFetch, categoryId) =>
  rfpFetch(`/menu/categories/${categoryId}`);

export const addCategoryAPI = (rfpFetch, name, image) =>
  rfpFetch("/menu/categories/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, image }),
  });

export const updateCategoryAPI = (rfpFetch, categoryId, name, image) =>
  rfpFetch("/menu/categories/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: categoryId, name, image }),
  });

export const removeCategoryAPI = (rfpFetch, categoryId) =>
  rfpFetch(`/menu/categories/remove/${categoryId}`, { method: "DELETE" });

export const addItemAPI = (rfpFetch, categoryId, name, variants) =>
  rfpFetch("/menu/items/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category_id: categoryId, name, variants }),
  });

export const updateItemAPI = (rfpFetch, itemId, name, variants) =>
  rfpFetch("/menu/items/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: itemId, name, variants }),
  });

export const removeItemAPI = (rfpFetch, itemId) =>
  rfpFetch(`/menu/items/remove/${itemId}`, { method: "DELETE" });
