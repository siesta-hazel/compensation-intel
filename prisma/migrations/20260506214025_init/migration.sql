-- CreateTable
CREATE TABLE "Salary" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "originalCompany" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL,
    "baseSalary" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "totalCompensation" INTEGER NOT NULL,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("id")
);
