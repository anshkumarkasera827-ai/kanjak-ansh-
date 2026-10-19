// src/app/api/concurrency-test/route.js
import { NextResponse } from 'next/server';
import { createHost, createGuardian, bookSlotAtomic } from '@/lib/db';

export async function POST() {
  try {
    // 1. Create a temporary test host with exactly 1 available slot
    const hostResult = await createHost({
      familyName: "Concurrent Test Puja",
      contactPerson: "Test Priest",
      phone: "+91 99999 00000",
      pujaDate: "2026-10-20",
      tithi: "Maha Ashtami",
      timeSlot: "11:00 AM - 12:00 PM",
      totalSlots: 1, // EXACTLY 1 SLOT
      dakshinaAmount: 101,
      prasadMenu: "Special Test Prasad",
      gifts: "Test Gifts",
      approximateArea: "Test Enclave, Delhi",
      exactAddress: "Flat 1, Test Enclave, Delhi 110001"
    });

    // 2. Create two distinct guardians
    const g1 = await createGuardian({
      childFirstName: "Concurrent Child A",
      childAge: 5,
      guardianName: "Guardian A",
      guardianRelation: "Parent",
      phone: "+91 91111 11111",
      locality: "Area A",
      consentGiven: true
    });

    const g2 = await createGuardian({
      childFirstName: "Concurrent Child B",
      childAge: 6,
      guardianName: "Guardian B",
      guardianRelation: "Parent",
      phone: "+91 92222 22222",
      locality: "Area B",
      consentGiven: true
    });

    // 3. Fire BOTH booking requests simultaneously via Promise.all
    const [res1, res2] = await Promise.all([
      bookSlotAtomic({ hostId: hostResult.hostId, guardianToken: g1.guardianToken }),
      bookSlotAtomic({ hostId: hostResult.hostId, guardianToken: g2.guardianToken })
    ]);

    // Check results
    const oneSucceeded = (res1.success && !res2.success) || (!res1.success && res2.success);
    const oneConflict = (res1.conflict && !res2.conflict) || (!res1.conflict && res2.conflict);

    return NextResponse.json({
      success: true,
      concurrencyProtected: oneSucceeded && oneConflict,
      summary: "Simulated simultaneous requests hitting the server at the exact same millisecond.",
      request1: {
        guardian: "Child A",
        success: res1.success,
        conflict: res1.conflict || false,
        message: res1.message || "Booked"
      },
      request2: {
        guardian: "Child B",
        success: res2.success,
        conflict: res2.conflict || false,
        message: res2.message || "Booked"
      },
      verdict: oneSucceeded && oneConflict
        ? "PASSED: The backend atomic lock successfully allowed 1 booking and rejected the simultaneous booking with HTTP 409 Conflict."
        : "UNEXPECTED: Both or neither succeeded."
    });
  } catch (err) {
    console.error("Concurrency test error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
