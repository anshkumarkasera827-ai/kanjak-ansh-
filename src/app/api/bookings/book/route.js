// src/app/api/bookings/book/route.js
import { NextResponse } from 'next/server';
import { bookSlotAtomic } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { hostId, guardianToken, notes } = body;

    if (!hostId || !guardianToken) {
      return NextResponse.json(
        { success: false, error: "Both Host ID and Guardian Token are required to book a slot" },
        { status: 400 }
      );
    }

    // Atomic server-side booking with mutex lock
    const result = await bookSlotAtomic({ hostId, guardianToken, notes });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          conflict: result.conflict || false,
          error: result.message
        },
        { status: result.status || (result.conflict ? 409 : 400) }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings/book error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while booking" },
      { status: 500 }
    );
  }
}
