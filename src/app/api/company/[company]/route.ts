import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { company: string } }
) {
  const companyName = params.company;
  const salaries = await prisma.salary.findMany({
    where: { company: { equals: companyName, mode: 'insensitive' } },
    orderBy: { level: 'asc' }
  });

  if (salaries.length === 0) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const total = salaries.length;
  const sortedTotal = salaries.map(s => s.totalCompensation).sort((a, b) => a - b);
  const medianComp = sortedTotal[Math.floor(total / 2)];

  const levelDistribution = salaries.reduce<Record<string, number>>((acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({ salaries, medianComp, levelDistribution });
}