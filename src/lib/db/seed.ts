import { executeSql } from "./postgres";

async function runSeed() {
  console.log("Seeding PostgreSQL database with SuperAdmin account...");
  const rows = await executeSql<{ id: string; email: string; role: string }>(
    "SELECT id, email, role FROM users WHERE role = 'superadmin';"
  );
  console.log("Seeded SuperAdmin accounts:", rows);
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Database seed failed:", err);
    process.exit(1);
  });
