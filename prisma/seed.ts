import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.salary.createMany({
    data: [
      { company: 'google', originalCompany: 'Google', role: 'Software Engineer', level: 'L4', location: 'Bangalore', experienceYears: 4, baseSalary: 3500000, bonus: 500000, stock: 800000, totalCompensation: 4800000 },
      { company: 'google', originalCompany: 'Google', role: 'Senior Software Engineer', level: 'L5', location: 'Bangalore', experienceYears: 7, baseSalary: 5000000, bonus: 700000, stock: 1200000, totalCompensation: 6900000 },
      { company: 'microsoft', originalCompany: 'Microsoft', role: 'SDE 2', level: 'L61', location: 'Hyderabad', experienceYears: 3, baseSalary: 2800000, bonus: 300000, stock: 400000, totalCompensation: 3500000 },
      { company: 'amazon', originalCompany: 'Amazon', role: 'SDE I', level: 'L4', location: 'Chennai', experienceYears: 2, baseSalary: 2200000, bonus: 200000, stock: 300000, totalCompensation: 2700000 },
    ]
  });
  console.log('Seeded initial salaries');
}
main().catch(console.error);