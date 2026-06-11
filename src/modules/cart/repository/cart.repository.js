const prisma = require("../../../config/prisma");

// Lấy giỏ hàng của customer, tạo mới nếu chưa có
async function findOrCreateCart(customerId) {
  let cart = await prisma.cart.findFirst({
    where: { customerId: Number(customerId) },
    include: {
      items: {
        include: {
          product: {
            select: {
              id:          true,
              name:        true,
              sku:         true,
              thumbnail:   true,
              priceOnline: true,
              status:      true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { customerId: Number(customerId) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id:          true,
                name:        true,
                sku:         true,
                thumbnail:   true,
                priceOnline: true,
                status:      true,
              },
            },
          },
        },
      },
    });
  }

  return cart;
}

// Tìm 1 item trong giỏ hàng theo cartId và productId
async function findCartItem(cartId, productId) {
  return prisma.cartItem.findUnique({
    where: {
      uq_cart_product: {
        cartId:    Number(cartId),
        productId: Number(productId),
      },
    },
  });
}

// Thêm sản phẩm vào giỏ hàng
async function addItem(cartId, productId, quantity) {
  return prisma.cartItem.create({
    data: {
      cartId:    Number(cartId),
      productId: Number(productId),
      quantity:  Number(quantity),
    },
  });
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
async function updateItemQuantity(cartId, productId, quantity) {
  return prisma.cartItem.update({
    where: {
      uq_cart_product: {
        cartId:    Number(cartId),
        productId: Number(productId),
      },
    },
    data: { quantity: Number(quantity) },
  });
}

// Xóa 1 sản phẩm khỏi giỏ hàng
async function removeItem(cartId, productId) {
  return prisma.cartItem.delete({
    where: {
      uq_cart_product: {
        cartId:    Number(cartId),
        productId: Number(productId),
      },
    },
  });
}

// Xóa toàn bộ sản phẩm trong giỏ hàng
async function clearCart(cartId) {
  return prisma.cartItem.deleteMany({
    where: { cartId: Number(cartId) },
  });
}

// Lấy thông tin sản phẩm theo id
async function findProductById(productId) {
  return prisma.product.findUnique({
    where: { id: Number(productId) },
    select: {
      id:          true,
      name:        true,
      priceOnline: true,
      status:      true,
      deletedAt:   true,
    },
  });
}

module.exports = {
  findOrCreateCart,
  findCartItem,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  findProductById,
};