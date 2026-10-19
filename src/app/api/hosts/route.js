// src/app/api/hosts/route.js
import { NextResponse } from 'next/server';
import { getPublicHosts, createHost } from '@/lib/db';

export async function GET() {
  try {
    const hosts = await getPublicHosts();
    return NextResponse.json({ success: true, hosts });
  } catch (err) {
    console.error("GET /api/hosts error:", err);
    return NextResponse.json({ success: false, error: "Failed to load Puja offerings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validation
    const required = [
      'familyName',
      'contactPerson',
      'phone',
      'pujaDate',
      'timeSlot',
      'approximateArea',
      'exactAddress',
      'prasadMenu',
      'gifts'
    ];

    for (const field of required) {
      if (!body[field] || typeof body[field] !== 'string' || !body[field].trim()) {
        return NextResponse.json(
          { success: false, error: `Missing or invalid field: ${field}` },
          { status: 400 }
        );
      }
    }

    const totalSlots = parseInt(body.totalSlots, 10);
    if (isNaN(totalSlots) || totalSlots < 1 || totalSlots > 50) {
      return NextResponse.json(
        { success: false, error: "Total slots must be between 1 and 50" },
        { status: 400 }
      );
    }

    const dakshinaAmount = parseInt(body.dakshinaAmount, 10);
    if (isNaN(dakshinaAmount) || dakshinaAmount < 0) {
      return NextResponse.json(
        { success: false, error: "Dakshina amount must be a valid number" },
        { status: 400 }
      );
    }

    const result = await createHost(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/hosts error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
