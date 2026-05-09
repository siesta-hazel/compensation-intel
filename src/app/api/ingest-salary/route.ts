import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeCompany, normalizeLevel } from '@/lib/normalizers';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      company,
      role,
      level_standardized,
      base_salary,
      bonus = 0,
      stock = 0,
      location,
      experience_years,
      confidence
    } = body;

    if (!company || !role || !level_standardized || !base_salary || !location || experience_years === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (typeof base_salary !== 'number' || base_salary <= 0) {
      return NextResponse.json({ error: 'base_salary must be positive number' }, { status: 400 });
    }

    const normalizedCompany = normalizeCompany(company);
    const normalizedLevel = normalizeLevel(level_standardized);
    const total = base_salary + (bonus || 0) + (stock || 0);

    const salary = await prisma.salary.create({
      data: {
        company: normalizedCompany,
        originalCompany: company,
        role,
        level: normalizedLevel,
        location,
        experienceYears: experience_years,
        baseSalary: base_salary,
        bonus: bonus || 0,
        stock: stock || 0,
        totalCompensation: total,
        confidenceScore: confidence || null,
      }
    });
    return NextResponse.json(salary, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}