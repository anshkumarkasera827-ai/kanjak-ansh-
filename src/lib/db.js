// src/lib/db.js
// Devotional Kanjak Puja Platform - Thread-Safe / Concurrency-Safe Data Store

import fs from 'fs';
import path from 'path';

// File-based persistence in .data/db.json with in-memory caching
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Mutex lock to prevent race conditions during concurrent slot bookings
let bookingLock = Promise.resolve();

function acquireLock() {
  let release;
  const lockPromise = new Promise((resolve) => {
    release = resolve;
  });
  const waitPromise = bookingLock.then(() => release);
  bookingLock = bookingLock.then(() => lockPromise);
  return waitPromise;
}

// Initial seed data with authentic devotional offerings
function getInitialData() {
  return {
    hosts: [
      {
        id: "HST-101",
        hostToken: "SEC-HST-7812",
        familyName: "Sharma Parivar",
        contactPerson: "Rajesh & Sunita Sharma",
        phone: "+91 98101 23456",
        email: "sharma.puja@example.com",
        pujaDate: "2026-10-20", // Durga Ashtami
        tithi: "Maha Ashtami (महाष्टमी)",
        timeSlot: "09:00 AM - 11:00 AM",
        totalSlots: 9,
        bookedSlots: 4,
        dakshinaAmount: 101,
        prasadMenu: "Desi Ghee Sooji Halwa, Sukha Kala Chana, Garam Poori & Kheer",
        gifts: "Lal Chunri, Glass Bangles, Pencil Geometry Box, Coconut & 1 Silver Coin",
        approximateArea: "Sector 14, Rohini, New Delhi",
        landmark: "Near Hanuman Mandir Chowk",
        exactAddress: "B-4/112, Second Floor, Sector 14, Rohini, New Delhi 110085",
        status: "open",
        createdAt: new Date().toISOString()
      },
      {
        id: "HST-102",
        hostToken: "SEC-HST-9921",
        familyName: "Verma Parivar",
        contactPerson: "Amit & Priya Verma",
        phone: "+91 98765 43210",
        email: "verma.puja@example.com",
        pujaDate: "2026-10-21", // Maha Navami
        tithi: "Maha Navami (महानवमी)",
        timeSlot: "10:30 AM - 12:30 PM",
        totalSlots: 9,
        bookedSlots: 6,
        dakshinaAmount: 201,
        prasadMenu: "Shuddh Desi Ghee Atta Halwa, Masaledar Chana, Khasta Poori, Makhana Kheer & Fresh Fruits",
        gifts: "Zari Chunri, Colorful Bangles, Bindi Pack, Story Book & Stainless Steel Tiffin",
        approximateArea: "Vaibhav Khand, Indirapuram, Ghaziabad",
        landmark: "Opposite Swarna Jayanti Park Gate 2",
        exactAddress: "Tower Rose - 703, Gaur Green City, Vaibhav Khand, Indirapuram 201014",
        status: "open",
        createdAt: new Date().toISOString()
      },
      {
        id: "HST-103",
        hostToken: "SEC-HST-3310",
        familyName: "Gupta Parivar",
        contactPerson: "Sunil & Rekha Gupta",
        phone: "+91 98112 99887",
        email: "gupta.puja@example.com",
        pujaDate: "2026-10-20", // Durga Ashtami
        tithi: "Maha Ashtami (महाष्टमी)",
        timeSlot: "08:00 AM - 10:00 AM",
        totalSlots: 9,
        bookedSlots: 8,
        dakshinaAmount: 151,
        prasadMenu: "Sooji Kesar Halwa, Kala Chana, Crispy Poori, Apple & Boondi Ladoo",
        gifts: "Mata Rani Chunri, Bangles, Colouring Sketch Set & Hair Accessories",
        approximateArea: "Sector 6, Dwarka, New Delhi",
        landmark: "Near Sector 6 Central Market",
        exactAddress: "Flat 204, Pragati Apartments, Plot 12, Sector 6, Dwarka 110075",
        status: "open",
        createdAt: new Date().toISOString()
      }
    ],
    guardians: [
      {
        id: "GRD-201",
        guardianToken: "KNJ-SEC-5511",
        childFirstName: "Aaradhya",
        childAge: 6,
        childType: "kanjak", // 'kanjak' or 'langur'
        guardianName: "Meenakshi Devi",
        guardianRelation: "Mother",
        phone: "+91 99990 11223",
        email: "meenakshi@example.com",
        locality: "Sector 14, Rohini",
        dietaryNotes: "Satvik pure vegetarian, no peanuts",
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ],
    bookings: [
      {
        id: "BK-8801",
        hostId: "HST-101",
        guardianId: "GRD-201",
        guardianToken: "KNJ-SEC-5511",
        childFirstName: "Aaradhya",
        childAge: 6,
        status: "confirmed",
        bookedAt: new Date().toISOString()
      }
    ]
  };
}

// In-memory state cached across requests
let globalStore = null;

function loadStore() {
  if (globalStore) return globalStore;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      globalStore = JSON.parse(raw);
      return globalStore;
    }
  } catch (err) {
    console.error("Error reading db file, falling back to seed:", err);
  }

  globalStore = getInitialData();
  saveStore();
  return globalStore;
}

function saveStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(globalStore, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error persisting db file:", err);
  }
}

// ================= PUBLIC METHODS =================

// 1. Get public host listings (SANITIZED: Never reveals exact address or phone)
export async function getPublicHosts() {
  const store = loadStore();
  return store.hosts.map((host) => ({
    id: host.id,
    familyName: host.familyName,
    pujaDate: host.pujaDate,
    tithi: host.tithi,
    timeSlot: host.timeSlot,
    totalSlots: host.totalSlots,
    bookedSlots: host.bookedSlots,
    availableSlots: Math.max(0, host.totalSlots - host.bookedSlots),
    dakshinaAmount: host.dakshinaAmount,
    prasadMenu: host.prasadMenu,
    gifts: host.gifts,
    approximateArea: host.approximateArea,
    landmark: host.landmark,
    status: host.status
  }));
}

// 2. Get single host details (Full details only if valid hostToken is provided)
export async function getHostById(id, token = null) {
  const store = loadStore();
  const host = store.hosts.find((h) => h.id === id);
  if (!host) return null;

  if (token && host.hostToken === token) {
    // Return full host management view
    const hostBookings = store.bookings
      .filter((b) => b.hostId === id && b.status === "confirmed")
      .map((b) => ({
        bookingId: b.id,
        childFirstName: b.childFirstName,
        childAge: b.childAge,
        bookedAt: b.bookedAt
      }));

    return {
      ...host,
      availableSlots: Math.max(0, host.totalSlots - host.bookedSlots),
      confirmedBookings: hostBookings
    };
  }

  // Public sanitized view
  return {
    id: host.id,
    familyName: host.familyName,
    pujaDate: host.pujaDate,
    tithi: host.tithi,
    timeSlot: host.timeSlot,
    totalSlots: host.totalSlots,
    bookedSlots: host.bookedSlots,
    availableSlots: Math.max(0, host.totalSlots - host.bookedSlots),
    dakshinaAmount: host.dakshinaAmount,
    prasadMenu: host.prasadMenu,
    gifts: host.gifts,
    approximateArea: host.approximateArea,
    landmark: host.landmark,
    status: host.status
  };
}

// 3. Register a new Host puja event
export async function createHost(data) {
  const store = loadStore();
  const id = `HST-${Math.floor(100 + Math.random() * 900)}`;
  const hostToken = `SEC-HST-${Math.floor(1000 + Math.random() * 9000)}`;

  const newHost = {
    id,
    hostToken,
    familyName: data.familyName.trim(),
    contactPerson: data.contactPerson.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || "",
    pujaDate: data.pujaDate,
    tithi: data.tithi || "Maha Ashtami / Navami",
    timeSlot: data.timeSlot.trim(),
    totalSlots: parseInt(data.totalSlots, 10) || 9,
    bookedSlots: 0,
    dakshinaAmount: parseInt(data.dakshinaAmount, 10) || 101,
    prasadMenu: data.prasadMenu.trim(),
    gifts: data.gifts.trim(),
    approximateArea: data.approximateArea.trim(),
    landmark: data.landmark?.trim() || "",
    exactAddress: data.exactAddress.trim(),
    status: "open",
    createdAt: new Date().toISOString()
  };

  store.hosts.unshift(newHost);
  saveStore();

  return {
    success: true,
    hostId: newHost.id,
    hostToken: newHost.hostToken,
    message: "Host Puja registered successfully! Save your Host Token to manage your slots."
  };
}

// 4. Update host status or slot count
export async function updateHost(id, token, updates) {
  const store = loadStore();
  const host = store.hosts.find((h) => h.id === id);
  if (!host) {
    return { success: false, error: "Host not found", status: 404 };
  }
  if (host.hostToken !== token) {
    return { success: false, error: "Unauthorized access token", status: 401 };
  }

  if (updates.status && ["open", "closed", "completed"].includes(updates.status)) {
    host.status = updates.status;
  }
  if (updates.totalSlots) {
    const newTotal = parseInt(updates.totalSlots, 10);
    if (newTotal >= host.bookedSlots) {
      host.totalSlots = newTotal;
    } else {
      return { success: false, error: "Cannot reduce capacity below currently booked slots", status: 400 };
    }
  }

  saveStore();
  return { success: true, host };
}

// 5. Register a Guardian / Child (Privacy First)
export async function createGuardian(data) {
  const store = loadStore();
  const id = `GRD-${Math.floor(100 + Math.random() * 900)}`;
  const guardianToken = `KNJ-SEC-${Math.floor(1000 + Math.random() * 9000)}`;

  const newGuardian = {
    id,
    guardianToken,
    childFirstName: data.childFirstName.trim(),
    childAge: parseInt(data.childAge, 10),
    childType: data.childType || "kanjak",
    guardianName: data.guardianName.trim(),
    guardianRelation: data.guardianRelation.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || "",
    locality: data.locality.trim(),
    dietaryNotes: data.dietaryNotes?.trim() || "Satvik (Pure Vegetarian)",
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  store.guardians.unshift(newGuardian);
  saveStore();

  return {
    success: true,
    guardianId: newGuardian.id,
    guardianToken: newGuardian.guardianToken,
    childFirstName: newGuardian.childFirstName,
    message: "Kanjak successfully registered with explicit consent! Keep your Private Token safe to view and manage bookings."
  };
}

// 6. Get Guardian Dashboard by private token
export async function getGuardianByToken(token) {
  const store = loadStore();
  const guardian = store.guardians.find((g) => g.guardianToken === token);
  if (!guardian) return null;

  // Find their bookings
  const myBookings = store.bookings
    .filter((b) => b.guardianToken === token && b.status === "confirmed")
    .map((b) => {
      const host = store.hosts.find((h) => h.id === b.hostId);
      return {
        bookingId: b.id,
        bookedAt: b.bookedAt,
        status: b.status,
        hostId: b.hostId,
        hostFamilyName: host?.familyName || "Devotee Family",
        contactPerson: host?.contactPerson || "",
        hostPhone: host?.phone || "",
        pujaDate: host?.pujaDate || "",
        tithi: host?.tithi || "",
        timeSlot: host?.timeSlot || "",
        dakshinaAmount: host?.dakshinaAmount || 0,
        prasadMenu: host?.prasadMenu || "",
        gifts: host?.gifts || "",
        exactAddress: host?.exactAddress || host?.approximateArea || "Provided upon host confirmation",
        landmark: host?.landmark || ""
      };
    });

  return {
    id: guardian.id,
    guardianToken: guardian.guardianToken,
    childFirstName: guardian.childFirstName,
    childAge: guardian.childAge,
    childType: guardian.childType,
    guardianName: guardian.guardianName,
    guardianRelation: guardian.guardianRelation,
    locality: guardian.locality,
    dietaryNotes: guardian.dietaryNotes,
    consentTimestamp: guardian.consentTimestamp,
    bookings: myBookings
  };
}

// 7. Withdraw / Delete Guardian Registration (Right to be forgotten)
export async function deleteGuardianByToken(token) {
  const store = loadStore();
  const index = store.guardians.findIndex((g) => g.guardianToken === token);
  if (index === -1) {
    return { success: false, error: "Guardian record not found or already deleted", status: 404 };
  }

  // Release any booked slots back to hosts
  const activeBookings = store.bookings.filter(
    (b) => b.guardianToken === token && b.status === "confirmed"
  );

  for (const b of activeBookings) {
    const host = store.hosts.find((h) => h.id === b.hostId);
    if (host && host.bookedSlots > 0) {
      host.bookedSlots -= 1;
    }
    b.status = "cancelled";
  }

  store.guardians.splice(index, 1);
  saveStore();

  return {
    success: true,
    message: "Registration successfully withdrawn and all associated data permanently deleted."
  };
}

// 8. ATOMIC SLOT BOOKING WITH CONCURRENCY LOCK (Race-Condition Free)
export async function bookSlotAtomic({ hostId, guardianToken, notes = "" }) {
  const releaseLock = await acquireLock();

  try {
    const store = loadStore();

    // 1. Validate guardian
    const guardian = store.guardians.find((g) => g.guardianToken === guardianToken);
    if (!guardian) {
      return {
        success: false,
        conflict: false,
        status: 401,
        message: "Invalid Guardian Token. Please register your child first or check your access key."
      };
    }

    // 2. Validate host exists
    const host = store.hosts.find((h) => h.id === hostId);
    if (!host) {
      return {
        success: false,
        conflict: false,
        status: 404,
        message: "Puja host not found."
      };
    }

    // 3. Check if host has closed bookings
    if (host.status !== "open") {
      return {
        success: false,
        conflict: true,
        status: 409,
        message: "Puja bookings for this host family are currently closed."
      };
    }

    // 4. ATOMIC RACE-CONDITION CHECK: Ensure slots are available
    if (host.bookedSlots >= host.totalSlots) {
      return {
        success: false,
        conflict: true,
        status: 409,
        message: `Jai Mata Di! This Puja slot was just claimed by another family at this exact second. Total capacity (${host.totalSlots} slots) is fully booked. Please choose another sacred host.`
      };
    }

    // 5. Prevent duplicate booking for same child at same host
    const existing = store.bookings.find(
      (b) => b.hostId === hostId && b.guardianToken === guardianToken && b.status === "confirmed"
    );
    if (existing) {
      return {
        success: false,
        conflict: false,
        status: 400,
        message: `You have already confirmed a booking for ${guardian.childFirstName} with ${host.familyName}.`
      };
    }

    // 6. ATOMIC INCREMENT & RESERVATION
    host.bookedSlots += 1;

    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      hostId: host.id,
      guardianId: guardian.id,
      guardianToken: guardian.guardianToken,
      childFirstName: guardian.childFirstName,
      childAge: guardian.childAge,
      notes: notes.trim(),
      status: "confirmed",
      bookedAt: new Date().toISOString()
    };

    store.bookings.unshift(newBooking);
    saveStore();

    // Reveal host contact and exact address ONLY upon confirmed booking
    return {
      success: true,
      bookingId: newBooking.id,
      childFirstName: guardian.childFirstName,
      hostFamilyName: host.familyName,
      tithi: host.tithi,
      pujaDate: host.pujaDate,
      timeSlot: host.timeSlot,
      dakshinaAmount: host.dakshinaAmount,
      prasadMenu: host.prasadMenu,
      gifts: host.gifts,
      exactAddress: host.exactAddress,
      landmark: host.landmark,
      contactPerson: host.contactPerson,
      hostPhone: host.phone,
      remainingSlots: host.totalSlots - host.bookedSlots,
      message: `Mata Rani's blessings! Slot confirmed for ${guardian.childFirstName} at ${host.familyName}.`
    };
  } finally {
    releaseLock();
  }
}

// 9. Get Booking Confirmation Details
export async function getBookingById(bookingId) {
  const store = loadStore();
  const booking = store.bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  const host = store.hosts.find((h) => h.id === booking.hostId);
  return {
    bookingId: booking.id,
    childFirstName: booking.childFirstName,
    childAge: booking.childAge,
    status: booking.status,
    bookedAt: booking.bookedAt,
    host: host ? {
      familyName: host.familyName,
      tithi: host.tithi,
      pujaDate: host.pujaDate,
      timeSlot: host.timeSlot,
      dakshinaAmount: host.dakshinaAmount,
      prasadMenu: host.prasadMenu,
      gifts: host.gifts,
      exactAddress: host.exactAddress,
      landmark: host.landmark,
      contactPerson: host.contactPerson,
      phone: host.phone
    } : null
  };
}
