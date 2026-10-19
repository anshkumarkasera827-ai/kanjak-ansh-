// src/app/api/guardians/[token]/route.js
import { NextResponse } from 'next/server';
import { getGuardianByToken, deleteGuardianByToken } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ success: false, error: "Access token required" }, { status: 400 });
    }

    const data = await getGuardianByToken(token);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "No registration found for this token. It may have been withdrawn or expired." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, guardian: data });
  } catch (err) {
    console.error("GET /api/guardians/[token] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ success: false, error: "Access token required" }, { status: 400 });
    }

    const result = await deleteGuardianByToken(token);
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE /api/guardians/[token] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
