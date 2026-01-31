const fs = require("fs");
const path = require("path");

// ============================================
// HumanEyez Project Seeder (Fresh Start)
// ============================================
// Creates ONLY essential files in build order
// Run: node seed-humaneyes-fresh.js
// ============================================

const PROJECT_ROOT = "D:\\Kazi Strong\\HumanEyez";

console.log("🚀 HumanEyez Fresh Start Seeder\n");
console.log(`📍 Location: ${PROJECT_ROOT}\n`);

// Lean file structure (priority-based)
const structure = {
  // ===== PRIORITY 1: Core Infrastructure =====
  public: ["index.html", "favicon.ico", "manifest.json"],

  src: [
    "index.js", // React entry point
    "App.js", // Router
    "index.css", // Global styles
    "App.css", // App-level styles
  ],

  // ===== PRIORITY 1: Database Connection =====
  "src/services": [
    "supabase.js", // Database client & functions
  ],

  // ===== PRIORITY 1: Essential Components =====
  "src/components": ["Header.jsx", "Footer.jsx", "ServiceCard.jsx"],

  // ===== PRIORITY 1: Home Page =====
  "src/pages": ["HomePage.jsx"],

  // ===== PRIORITY 2: Service Selection & Ordering =====
  "src/components/order": [
    "ServiceDetail.jsx",
    "PricingCalculator.jsx",
    "OrderForm.jsx",
    "WordCounter.jsx",
  ],

  "src/pages/order": ["OrderPage.jsx"],

  // ===== PRIORITY 3: Tracking & Admin =====
  "src/pages/tracking": ["TrackingPage.jsx"],

  "src/components/admin": [
    "Admin.jsx",
    "AdminHeader.jsx",
    "OrdersList.jsx",
    "OrderDetail.jsx",
  ],

  // ===== PRIORITY 4: CMS Features =====
  "src/components/admin/cms": [
    "PricingManager.jsx",
    "ServicesManager.jsx",
    "TestimonialsManager.jsx",
    "FAQManager.jsx",
  ],

  // ===== Additional Services (as needed) =====
  "src/services/extended": [
    "orderService.js",
    "paymentService.js",
    "notificationService.js",
  ],

  // ===== Vercel API Routes =====
  api: ["create-order.js", "track-order.js", "process-payment.js"],

  // ===== Database Migrations =====
  "supabase/migrations": [
    "001_create_services_table.sql",
    "002_create_orders_table.sql",
    "003_create_pricing_table.sql",
    "004_create_testimonials_table.sql",
    "005_create_faq_table.sql",
  ],

  // ===== Config Files =====
  "": [
    ".env.example",
    ".gitignore",
    "package.json",
    "vercel.json",
    "README.md",
  ],
};

// Essential files that MUST have content for npm to work
const fileContents = {
  "package.json": `{
  "name": "humaneyes",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@stripe/stripe-js": "^2.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}`,

  "public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#6B4A8A" />
    <title>HumanEyez</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
};

// ============================================
// SEEDING FUNCTION
// ============================================

function createStructure() {
  let filesCreated = 0;
  let dirsCreated = 0;

  // Create root directory
  if (!fs.existsSync(PROJECT_ROOT)) {
    fs.mkdirSync(PROJECT_ROOT, { recursive: true });
    console.log(`📁 Created root: ${PROJECT_ROOT}\n`);
  }

  // Create structure
  for (const [dir, files] of Object.entries(structure)) {
    const dirPath = dir ? path.join(PROJECT_ROOT, dir) : PROJECT_ROOT;

    // Create directory
    if (dir && !fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      dirsCreated++;
      console.log(`📂 ${dir}/`);
    }

    // Create files
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      if (!fs.existsSync(filePath)) {
        // Check if this file needs content
        let content = "";
        if (fileContents[file]) {
          content = fileContents[file];
        }

        fs.writeFileSync(filePath, content);
        filesCreated++;
        console.log(`   ✓ ${file}`);
      }
    });
  }

  return { filesCreated, dirsCreated };
}

// ============================================
// MAIN EXECUTION
// ============================================

try {
  console.log("⏳ Creating file structure...\n");

  const stats = createStructure();

  console.log("\n✅ Project seeded successfully!\n");
  console.log("📊 Summary:");
  console.log(`   Location: ${PROJECT_ROOT}`);
  console.log(`   Directories: ${stats.dirsCreated}`);
  console.log(`   Files: ${stats.filesCreated}`);

  console.log("\n📝 Next steps:");
  console.log(`   1. cd "${PROJECT_ROOT}"`);
  console.log("   2. npm install");
  console.log("   3. Copy .env.example to .env.local and add your keys");
  console.log("   4. npm start");
  console.log("\n🚀 Ready to build HumanEyez!\n");
} catch (error) {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
}
