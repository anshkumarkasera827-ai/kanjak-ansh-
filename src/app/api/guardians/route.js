// src/app/api/guardians/route.js
import { NextResponse } from 'next/server';
import { createGuardian } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();

    // Data minimization and validation
    if (!body.childFirstName || typeof body.childFirstName !== 'string' || !body.childFirstName.trim()) {
      return NextResponse.json({ success: false, error: "Child's first name / alias is required" }, { status: 400 });
    }

    const age = parseInt(body.childAge, 10);
    if (isNaN(age) || age < 1 || age > 14) {
      return NextResponse.json({ success: false, error: "Child's age must be between 1 and 14 years" }, { status: 400 });
    }

    if (!body.guardianName || !body.phone || !body.guardianRelation) {
      return NextResponse.json({ success: false, error: "Guardian name, relation, and phone number are required" }, { status: 400 });
    }

    if (!body.locality || !body.locality.trim()) {
      return NextResponse.json({ success: false, error: "General neighborhood or locality is required" }, { status: 400 });
    }

    // Explicit guardian consent check
    if (!body.consentGiven) {
      return NextResponse.json(
        {
          success: false,
          error: "Explicit guardian consent is legally required to participate in Kanjak Puja bookings"
        },
        { status: 400 }
      );
    }

    const result = await createGuardian(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/guardians error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
