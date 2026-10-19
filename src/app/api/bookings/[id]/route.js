// src/app/api/bookings/[id]/route.js
import { NextResponse } from 'next/server';
import { getBookingById } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const booking = await getBookingById(id);

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking reference not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("GET /api/bookings/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
