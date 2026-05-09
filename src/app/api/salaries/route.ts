import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const company = searchParams.get('company');
  const role = searchParams.get('role');
  const level = searchParams.get('level');
  const location = searchParams.get('location');
  const sortBy = searchParams.get('sortBy') || 'totalCompensation';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where: any = {};
  if (company && company.trim()) {
    where.company = { contains: company.trim(), mode: 'insensitive' };
  }
  if (role && role.trim()) {
    where.role = { contains: role.trim(), mode: 'insensitive' };
  }
  if (level && level.trim()) {
    where.level = { contains: level.trim(), mode: 'insensitive' };
  }
  if (location && location.trim()) {
    where.location = { contains: location.trim(), mode: 'insensitive' };
  }

  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ]);

  return NextResponse.json({
    data: salaries,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}