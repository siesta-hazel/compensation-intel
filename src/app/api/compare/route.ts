import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { ids } = await req.json();
  if (!ids || ids.length !== 2) {
    return NextResponse.json({ error: 'Provide exactly two salary IDs' }, { status: 400 });
  }
  const salaries = await prisma.salary.findMany({
    where: { id: { in: ids } }
  });
  if (salaries.length !== 2) {
    return NextResponse.json({ error: 'One or both salaries not found' }, { status: 404 });
  }
  const [a, b] = salaries;
  return NextResponse.json({
    left: a,
    right: b,
    difference: {
      base: a.baseSalary - b.baseSalary,
      bonus: a.bonus - b.bonus,
      stock: a.stock - b.stock,
      total: a.totalCompensation - b.totalCompensation,
    }
  });
}