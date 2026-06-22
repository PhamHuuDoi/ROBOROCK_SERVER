module.exports = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successfully",
    REFRESH_SUCCESS: "Token refreshed successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    LOGOUT_ALL_SUCCESS: "All sessions logged out successfully",
  },

  USER: {
    GET_SUCCESS: "User retrieved successfully",
    GET_ALL_SUCCESS: "Users retrieved successfully",
    CREATE_SUCCESS: "User created successfully",
    UPDATE_SUCCESS: "User updated successfully",
    DELETE_SUCCESS: "User deleted successfully",
    RESET_PASSWORD_SUCCESS: "Password reset successfully",
    CHANGE_STATUS_SUCCESS: "User status updated successfully",
  },

  PRODUCT: {
    GET_SUCCESS: "Product retrieved successfully",
    GET_ALL_SUCCESS: "Products retrieved successfully",
    CREATE_SUCCESS: "Product created successfully",
    UPDATE_SUCCESS: "Product updated successfully",
    DELETE_SUCCESS: "Product deleted successfully",
    DELETE_IMAGE_SUCCESS: "Product image deleted successfully",
  },

  CATEGORY: {
    GET_SUCCESS: "Category retrieved successfully",
    GET_ALL_SUCCESS: "Categories retrieved successfully",
    CREATE_SUCCESS: "Category created successfully",
    UPDATE_SUCCESS: "Category updated successfully",
    DELETE_SUCCESS: "Category deleted successfully",
  },

  BRANCH: {
    GET_SUCCESS: "Branch retrieved successfully",
    GET_ALL_SUCCESS: "Branches retrieved successfully",
    CREATE_SUCCESS: "Branch created successfully",
    UPDATE_SUCCESS: "Branch updated successfully",
    DELETE_SUCCESS: "Branch deleted successfully",
    ADD_STAFF_SUCCESS: "Staff added to branch successfully",
    REMOVE_STAFF_SUCCESS: "Staff removed from branch successfully",
  },

  WAREHOUSE: {
    GET_SUCCESS: "Warehouse retrieved successfully",
    GET_ALL_SUCCESS: "Warehouses retrieved successfully",
    CREATE_SUCCESS: "Warehouse created successfully",
    UPDATE_SUCCESS: "Warehouse updated successfully",
    DELETE_SUCCESS: "Warehouse deleted successfully",
  },

  INVENTORY: {
    GET_SUCCESS: "Inventory retrieved successfully",
    GET_ALL_SUCCESS: "Inventory retrieved successfully",
    GET_BY_BRANCH_SUCCESS: "Branch inventory retrieved successfully",
    GET_BY_PRODUCT_SUCCESS: "Product inventory retrieved successfully",
    GET_BY_WAREHOUSE_SUCCESS: "Warehouse inventory retrieved successfully",
  },

  IMPORT: {
    GET_SUCCESS: "Import receipt retrieved successfully",
    GET_ALL_SUCCESS: "Import receipts retrieved successfully",
    CREATE_SUCCESS: "Import receipt created successfully",
  },

  TRANSFER: {
    GET_SUCCESS: "Transfer request retrieved successfully",
    GET_ALL_SUCCESS: "Transfer requests retrieved successfully",
    CREATE_SUCCESS: "Transfer request created successfully",
    APPROVE_SUCCESS: "Transfer request approved successfully",
    REJECT_SUCCESS: "Transfer request rejected successfully",
    COMPLETE_SUCCESS: "Transfer request completed successfully",
    CANCEL_SUCCESS: "Transfer request canceled successfully",
  },

  CART: {
    GET_SUCCESS: "Cart retrieved successfully",
    ADD_ITEM_SUCCESS: "Item added to cart successfully",
    UPDATE_ITEM_SUCCESS: "Cart item updated successfully",
    REMOVE_ITEM_SUCCESS: "Cart item removed successfully",
    CLEAR_SUCCESS: "Cart cleared successfully",
  },

  ORDER: {
    GET_SUCCESS: "Order retrieved successfully",
    GET_ALL_SUCCESS: "Orders retrieved successfully",
    CREATE_SUCCESS: "Order created successfully",
    SUGGEST_BRANCHES_SUCCESS: "Suggested branches retrieved successfully",
    CONFIRM_SUCCESS: "Order confirmed successfully",
    UPDATE_STATUS_SUCCESS: "Order status updated successfully",
    CANCEL_SUCCESS: "Order canceled successfully",
  },

  PAYMENT: {
    GET_SUCCESS: "Payment retrieved successfully",
    CONFIRM_COD_SUCCESS: "COD payment confirmed successfully",
  },

  PROFILE: {
    GET_SUCCESS: "Profile retrieved successfully",
    GET_ALL_SUCCESS: "Profiles retrieved successfully",
    CREATE_SUCCESS: "Profile created successfully",
    UPDATE_SUCCESS: "Profile updated successfully",
    DELETE_SUCCESS: "Profile deleted successfully",
    SET_DEFAULT_SUCCESS: "Default profile updated successfully",
  },
};
