-- CreateTable
CREATE TABLE "appointments" (
    "appointment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "job_centre_id" INTEGER NOT NULL,
    "time" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "benefit_name" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
