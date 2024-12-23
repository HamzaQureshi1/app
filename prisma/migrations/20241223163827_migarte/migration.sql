-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_appointments" (
    "appointment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_centre_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "benefit_name" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_appointments" ("address", "appointment_id", "benefit_name", "customer_id", "date", "job_centre_id") SELECT "address", "appointment_id", "benefit_name", "customer_id", "date", "job_centre_id" FROM "appointments";
DROP TABLE "appointments";
ALTER TABLE "new_appointments" RENAME TO "appointments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
