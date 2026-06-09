const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

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
    { fullName: "Staff POS 1",        email: "staff1@roborock.com",    roleId: roleMap.STAFF },
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
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        categoryId:     categoryMap["robot-hut-bui"],
        name:           "Roborock S8 Pro Ultra",
        slug:           "roborock-s8-pro-ultra",
        sku:            "RR-S8-PRO-001",
        description:    "Robot hút bụi lau nhà cao cấp",
        priceOnline:    20990000,
        pricePos:       20500000,
        weight:         4.5,
        warrantyMonths: 12,
        status:         "ACTIVE",
      },
      {
        categoryId:     categoryMap["robot-hut-bui"],
        name:           "Roborock Q5 Pro",
        slug:           "roborock-q5-pro",
        sku:            "RR-Q5-PRO-001",
        description:    "Robot hút bụi tầm trung",
        priceOnline:    8990000,
        pricePos:       8500000,
        weight:         3.2,
        warrantyMonths: 12,
        status:         "ACTIVE",
      },
      {
        categoryId:     categoryMap["robot-hut-bui"],
        name:           "Roborock E5 Mop",
        slug:           "roborock-e5-mop",
        sku:            "RR-E5-MOP-001",
        description:    "Robot hút bụi giá tốt",
        priceOnline:    4990000,
        pricePos:       4700000,
        weight:         2.8,
        warrantyMonths: 12,
        status:         "ACTIVE",
      },
      {
        categoryId:     categoryMap["phu-kien"],
        name:           "Túi Đựng Rác Roborock",
        slug:           "tui-dung-rac-roborock",
        sku:            "RR-ACC-BAG-001",
        description:    "Túi đựng rác chính hãng",
        priceOnline:    299000,
        pricePos:       280000,
        warrantyMonths: null,
        status:         "ACTIVE",
      },
      {
        categoryId:     categoryMap["dung-dich"],
        name:           "Dung Dịch Lau Sàn Roborock",
        slug:           "dung-dich-lau-san-roborock",
        sku:            "RR-CLN-001",
        description:    "Dung dịch vệ sinh sàn nhà",
        priceOnline:    199000,
        pricePos:       180000,
        warrantyMonths: null,
        status:         "ACTIVE",
      },
    ],
  });

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
  const importReceipt = await prisma.importReceipt.create({
    data: {
      warehouseId: warehouseMap["Kho Tổng HCM"],
      supplierId:  supplierMap["Roborock Vietnam"],
      createdBy:   userMap["warehouse@roborock.com"],
      note:        "Nhập hàng đợt 1",
      items: {
        create: [
          { productId: productMap["RR-S8-PRO-001"], quantity: 50,  importPrice: 18000000 },
          { productId: productMap["RR-Q5-PRO-001"], quantity: 100, importPrice: 7000000  },
          { productId: productMap["RR-E5-MOP-001"], quantity: 150, importPrice: 3800000  },
          { productId: productMap["RR-ACC-BAG-001"],quantity: 500, importPrice: 150000   },
          { productId: productMap["RR-CLN-001"],    quantity: 300, importPrice: 100000   },
        ],
      },
    },
  });

  // Cập nhật inventory sau nhập kho
  const importItems = [
    { productId: productMap["RR-S8-PRO-001"], quantity: 50  },
    { productId: productMap["RR-Q5-PRO-001"], quantity: 100 },
    { productId: productMap["RR-E5-MOP-001"], quantity: 150 },
    { productId: productMap["RR-ACC-BAG-001"],quantity: 500 },
    { productId: productMap["RR-CLN-001"],    quantity: 300 },
  ];

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
  const transferItems = [
    { productId: productMap["RR-S8-PRO-001"], quantity: 10 },
    { productId: productMap["RR-Q5-PRO-001"], quantity: 20 },
    { productId: productMap["RR-E5-MOP-001"], quantity: 30 },
    { productId: productMap["RR-ACC-BAG-001"],quantity: 50 },
  ];

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
        create: transferItems.map((i) => ({
          productId: i.productId,
          quantity:  i.quantity,
        })),
      },
    },
  });

  // Cập nhật inventory sau chuyển kho
  for (const item of transferItems) {
    // Trừ kho tổng
    await prisma.inventory.update({
      where: {
        uq_inventories_wh_prod: {
          warehouseId: warehouseMap["Kho Tổng HCM"],
          productId:   item.productId,
        },
      },
      data: { availableQuantity: { decrement: item.quantity } },
    });

    // Cộng kho chi nhánh Q1
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

    // Transactions
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