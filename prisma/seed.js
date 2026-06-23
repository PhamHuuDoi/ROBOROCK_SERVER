const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const PRODUCTS_JSON = require("./products.json");

const prisma = new PrismaClient();

const skuBaseCounters = {};

function getCategorySlug(tags = []) {
  const categoryMapping = {
    "robot hút bụi": "robot-hut-bui",
    "q series": "robot-hut-bui",
    "qrevo series": "robot-hut-bui",
    "qrevo curv series": "robot-hut-bui",
    "saros series": "robot-hut-bui",
    "máy hút bụi": "may-hut-bui",
    "f25 series": "may-hut-bui",
    "h series": "may-hut-bui",
    "phụ kiện": "phu-kien",
    "dung dịch": "dung-dich",
  };

  const normalizedTags = (tags || []).map((tag) => String(tag || "").trim().toLowerCase());
  for (const tag of normalizedTags) {
    if (categoryMapping[tag]) {
      return categoryMapping[tag];
    }
  }

  return "robot-hut-bui";
}

function slugToSku(product) {
  if (product.shopify_id) {
    return `RR-${product.shopify_id}`;
  }

  return (
    "RR-" +
    String(product.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  ).toUpperCase();
}

function generateUniqueSku(product) {
  const baseSku = slugToSku(product);
  const count = skuBaseCounters[baseSku] || 0;
  const sku = count === 0 ? baseSku : `${baseSku}-${count + 1}`.slice(0, 50).replace(/-+$/g, "");
  skuBaseCounters[baseSku] = count + 1;
  return sku;
}

async function main() {
  console.log("🌱 Seeding...");

  // ── Roles ──────────────────────────────────────────────
  await prisma.role.createMany({
    skipDuplicates: true,
    data: [
      { name: "SYSTEM_ADMIN" },
      { name: "WAREHOUSE_MANAGER" },
      { name: "STORE_MANAGER" },
      { name: "STAFF" },
      { name: "CUSTOMER" },
    ],
  });

  const roles = await prisma.role.findMany();
  const roleMap = {};
  roles.forEach((r) => (roleMap[r.name] = r.id));

  // ── Users ──────────────────────────────────────────────
  const password = await bcrypt.hash("123456", 10);

  const usersData = [
    { fullName: "System Admin",       email: "admin@roborock.com",     roleId: roleMap.SYSTEM_ADMIN },
    { fullName: "Warehouse Manager",  email: "warehouse@roborock.com", roleId: roleMap.WAREHOUSE_MANAGER },
    { fullName: "Store Manager Q1",   email: "store.q1@roborock.com",  roleId: roleMap.STORE_MANAGER },
    { fullName: "Store Manager Q7",   email: "store.q7@roborock.com",  roleId: roleMap.STORE_MANAGER },
    { fullName: "Quan 7",             email: "Q7@roborock.com",        roleId: roleMap.STAFF },
    { fullName: "Quan 1",             email: "Q1@roborock.com",        roleId: roleMap.STAFF },
    { fullName: "Staff POS 2",        email: "staff2@roborock.com",    roleId: roleMap.STAFF },
    { fullName: "Nguyen Van A",       email: "customer1@gmail.com",    roleId: roleMap.CUSTOMER },
    { fullName: "Tran Thi B",         email: "customer2@gmail.com",    roleId: roleMap.CUSTOMER },
  ];

  for (const u of usersData) {
    const existed = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existed) {
      await prisma.user.create({ data: { ...u, password } });
    }
  }

  const userMap = {};
  const allUsers = await prisma.user.findMany({ include: { role: true } });
  allUsers.forEach((u) => (userMap[u.email] = u.id));

  // ── Branches ───────────────────────────────────────────
  await prisma.branch.createMany({
    skipDuplicates: true,
    data: [
      {
        name:      "Chi Nhánh Quận 1",
        address:   "123 Nguyễn Huệ, Q1, HCM",
        phone:     "0901234567",
        email:     "q1@roborock.com",
        managerId: userMap["store.q1@roborock.com"],
        status:    "ACTIVE",
      },
      {
        name:      "Chi Nhánh Quận 7",
        address:   "456 Nguyễn Thị Thập, Q7, HCM",
        phone:     "0907654321",
        email:     "q7@roborock.com",
        managerId: userMap["store.q7@roborock.com"],
        status:    "ACTIVE",
      },
    ],
  });

  const branches = await prisma.branch.findMany();
  const branchMap = {};
  branches.forEach((b) => (branchMap[b.name] = b.id));

  // ── BranchStaffs ───────────────────────────────────────
  await prisma.branchStaff.createMany({
    skipDuplicates: true,
    data: [
      { branchId: branchMap["Chi Nhánh Quận 1"], staffId: userMap["staff1@roborock.com"] },
      { branchId: branchMap["Chi Nhánh Quận 7"], staffId: userMap["staff2@roborock.com"] },
    ],
  });

  // ── Warehouses ─────────────────────────────────────────
  await prisma.warehouse.createMany({
    skipDuplicates: true,
    data: [
      { name: "Kho Tổng HCM",          type: "MAIN",   branchId: null },
      { name: "Kho Chi Nhánh Quận 1",  type: "BRANCH", branchId: branchMap["Chi Nhánh Quận 1"] },
      { name: "Kho Chi Nhánh Quận 7",  type: "BRANCH", branchId: branchMap["Chi Nhánh Quận 7"] },
    ],
  });

  const warehouses = await prisma.warehouse.findMany();
  const warehouseMap = {};
  warehouses.forEach((w) => (warehouseMap[w.name] = w.id));

  // ── Categories ─────────────────────────────────────────
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { name: "Robot Hút Bụi",  slug: "robot-hut-bui" },
      { name: "Phụ Kiện",       slug: "phu-kien" },
      { name: "Dung Dịch",      slug: "dung-dich" },
    ],
  });

  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach((c) => (categoryMap[c.slug] = c.id));

  // ── Products ───────────────────────────────────────────
  const slugSkuMap = {};
  for (const product of PRODUCTS_JSON) {
    if (!product.slug) {
      continue;
    }

    if (!slugSkuMap[product.slug]) {
      slugSkuMap[product.slug] = generateUniqueSku(product);
    }
  }

  for (const product of PRODUCTS_JSON) {
    if (!product.slug) {
      continue;
    }

    const existingProduct = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existingProduct) {
      continue;
    }

    const categorySlug = getCategorySlug(product.tags);
    const categoryId = categoryMap[categorySlug] || categoryMap["robot-hut-bui"];
    const sku = slugSkuMap[product.slug];

    const images = Array.isArray(product.images)
      ? product.images.map((imageUrl, index) => ({ imageUrl, sortOrder: index }))
      : [];

    await prisma.product.create({
      data: {
        categoryId,
        name:           product.title || "Untitled Product",
        slug:           product.slug,
        sku,
        description:    product.description || null,
        thumbnail:      product.thumbnail || null,
        priceOnline:    product.price ?? 0,
        pricePos:       product.price ?? 0,
        weight:         null,
        warrantyMonths: null,
        status:         product.available === false ? "INACTIVE" : "ACTIVE",
        images: {
          create: images,
        },
      },
    });
  }

  const products = await prisma.product.findMany();
  const productMap = {};
  products.forEach((p) => (productMap[p.sku] = p.id));

  // ── Suppliers ──────────────────────────────────────────
  await prisma.supplier.createMany({
    skipDuplicates: true,
    data: [
      {
        name:        "Roborock Vietnam",
        contactName: "Nguyen Van Supplier",
        phone:       "0281234567",
        email:       "supplier@roborock.vn",
        address:     "789 Lê Văn Việt, Q9, HCM",
        status:      "ACTIVE",
      },
      {
        name:        "Tech Distribution Co.",
        contactName: "Tran Thi Dist",
        phone:       "0289876543",
        email:       "dist@techdist.vn",
        address:     "321 Điện Biên Phủ, Q3, HCM",
        status:      "ACTIVE",
      },
    ],
  });

  const suppliers = await prisma.supplier.findMany();
  const supplierMap = {};
  suppliers.forEach((s) => (supplierMap[s.name] = s.id));

  // ── Import Receipts (nhập kho tổng) ────────────────────
  const importItems = PRODUCTS_JSON.map((product) => {
    const sku = slugSkuMap[product.slug];
    const productId = productMap[sku];
    if (!productId) {
      return null;
    }

    const price = Number(product.price || 0);
    return {
      productId,
      quantity: price >= 10000000 ? 30 : 100,
      importPrice: Number((price * 0.75).toFixed(2)),
    };
  }).filter(Boolean);

  const importReceipt = await prisma.importReceipt.create({
    data: {
      warehouseId: warehouseMap["Kho Tổng HCM"],
      supplierId:  supplierMap["Roborock Vietnam"],
      createdBy:   userMap["warehouse@roborock.com"],
      note:        "Nhập hàng đợt 1",
      items: {
        create: importItems.map((item) => ({
          productId:   item.productId,
          quantity:    item.quantity,
          importPrice: item.importPrice,
        })),
      },
    },
  });

  for (const item of importItems) {
    await prisma.inventory.upsert({
      where: {
        uq_inventories_wh_prod: {
          warehouseId: warehouseMap["Kho Tổng HCM"],
          productId:   item.productId,
        },
      },
      update: { availableQuantity: { increment: item.quantity } },
      create: {
        warehouseId:       warehouseMap["Kho Tổng HCM"],
        productId:         item.productId,
        availableQuantity: item.quantity,
      },
    });

    await prisma.inventoryTransaction.create({
      data: {
        warehouseId:      warehouseMap["Kho Tổng HCM"],
        productId:        item.productId,
        type:             "IMPORT",
        quantity:         item.quantity,
        importReceiptId:  importReceipt.id,
        createdBy:        userMap["warehouse@roborock.com"],
      },
    });
  }

  // ── Transfer (chuyển kho tổng → chi nhánh Q1) ─────────
  const transferItems = importItems.slice(0, 20);

  const transfer = await prisma.transferRequest.create({
    data: {
      fromWarehouseId: warehouseMap["Kho Tổng HCM"],
      toWarehouseId:   warehouseMap["Kho Chi Nhánh Quận 1"],
      requestedBy:     userMap["warehouse@roborock.com"],
      approvedBy:      userMap["admin@roborock.com"],
      receivedBy:      userMap["store.q1@roborock.com"],
      status:          "COMPLETED",
      completedAt:     new Date(),
      note:            "Chuyển hàng cho chi nhánh Q1",
      items: {
        create: transferItems.map((item) => ({
          productId: item.productId,
          quantity:  item.quantity,
        })),
      },
    },
  });

  for (const item of transferItems) {
    await prisma.inventory.update({
      where: {
        uq_inventories_wh_prod: {
          warehouseId: warehouseMap["Kho Tổng HCM"],
          productId:   item.productId,
        },
      },
      data: { availableQuantity: { decrement: item.quantity } },
    });

    await prisma.inventory.upsert({
      where: {
        uq_inventories_wh_prod: {
          warehouseId: warehouseMap["Kho Chi Nhánh Quận 1"],
          productId:   item.productId,
        },
      },
      update: { availableQuantity: { increment: item.quantity } },
      create: {
        warehouseId:       warehouseMap["Kho Chi Nhánh Quận 1"],
        productId:         item.productId,
        availableQuantity: item.quantity,
      },
    });

    await prisma.inventoryTransaction.createMany({
      data: [
        {
          warehouseId:       warehouseMap["Kho Tổng HCM"],
          productId:         item.productId,
          type:              "TRANSFER_OUT",
          quantity:          item.quantity,
          transferRequestId: transfer.id,
          createdBy:         userMap["warehouse@roborock.com"],
        },
        {
          warehouseId:       warehouseMap["Kho Chi Nhánh Quận 1"],
          productId:         item.productId,
          type:              "TRANSFER_IN",
          quantity:          item.quantity,
          transferRequestId: transfer.id,
          createdBy:         userMap["warehouse@roborock.com"],
        },
      ],
    });
  }

  console.log("✅ Seed completed!");
  console.log("📋 Test accounts (password: 123456):");
  console.log("   admin@roborock.com      → SYSTEM_ADMIN");
  console.log("   warehouse@roborock.com  → WAREHOUSE_MANAGER");
  console.log("   store.q1@roborock.com   → STORE_MANAGER");
  console.log("   staff1@roborock.com     → STAFF");
  console.log("   customer1@gmail.com     → CUSTOMER");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());