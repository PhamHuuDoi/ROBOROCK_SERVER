const cron = require("node-cron");
const productService = require("../modules/products/service/product.service");

function startCleanupJob() {
  // Chạy lúc 2:00 AM mỗi ngày
  cron.schedule("0 2 * * *", async () => {
    console.log("[Scheduler] Running product cleanup...");
    try {
      const result = await productService.hardDeleteExpired();
      console.log(`[Scheduler] Done:`, result);
    } catch (err) {
      console.error("[Scheduler] Error:", err);
    }
  });

  console.log("[Scheduler] Product cleanup job registered (daily 2:00 AM)");
}

module.exports = { startCleanupJob };