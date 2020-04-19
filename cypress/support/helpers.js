export const productIdToItemId = (productId, item_number) => "item_" + productId.replace("product_", "") + `.${item_number}`
