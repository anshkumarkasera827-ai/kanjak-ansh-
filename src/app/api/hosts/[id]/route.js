// src/app/api/hosts/[id]/route.js
import { NextResponse } from 'next/server';
import { getHostById, updateHost } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    const host = await getHostById(id, token);
    if (!host) {
      return NextResponse.json({ success: false, error: "Host not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, host });
  } catch (err) {
    console.error("GET /api/hosts/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return NextResponse.json({ success: false, error: "Missing host authentication token" }, { status: 401 });
    }

    const result = await updateHost(id, token, body);
    if (!result.success) {
      return NextResponse.json(result, { status: result.status || 400 });
    }

    return NextResponse.json({ success: true, host: result.host });
  } catch (err) {
    console.error("PATCH /api/hosts/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
