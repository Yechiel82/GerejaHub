import type { ChurchEvent, ChurchSettings, Ministry, Sermon } from "@/lib/supabase/types";

export const fallbackSettings: ChurchSettings = {
  id: "site",
  hero_eyebrow: "GerejaHub",
  hero_title: "Ladang Sudah Menguning",
  hero_description:
    "Mari menuai bersama dalam kasih, pelayanan, dan pertumbuhan iman. Temukan jadwal ibadah, renungan, komunitas, dan pelayanan gereja dalam satu tempat.",
  service_time: "Sunday, 9:00 AM",
  address: "123 Faith Avenue, Jakarta",
  email: "contact@example.com",
  phone: "+62 123 4567 890",
  giving_note:
    "Add a secure giving provider when the church is ready. Phase 1 includes the public placement, so the payment integration can be connected later without redesigning the site.",
  created_at: "",
  updated_at: ""
};

export const fallbackSermons: Sermon[] = [
  {
    id: "fallback-sermon-1",
    title: "Grace for the Road Ahead",
    speaker: "Ps. Daniel Wijaya",
    sermon_date: "2026-05-24",
    summary: null,
    media_url: null,
    published: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: "fallback-sermon-2",
    title: "A House of Prayer",
    speaker: "Ps. Maria Santoso",
    sermon_date: "2026-05-17",
    summary: null,
    media_url: null,
    published: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: "fallback-sermon-3",
    title: "Faith That Serves",
    speaker: "Ps. Daniel Wijaya",
    sermon_date: "2026-05-10",
    summary: null,
    media_url: null,
    published: true,
    created_at: "",
    updated_at: ""
  }
];

export const fallbackEvents: ChurchEvent[] = [
  {
    id: "fallback-event-1",
    title: "Sunday Worship",
    event_date: null,
    time_label: "Every Sunday, 9:00 AM",
    location: "Main Sanctuary",
    description: null,
    published: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: "fallback-event-2",
    title: "Youth Night",
    event_date: null,
    time_label: "Friday, 7:00 PM",
    location: "Community Hall",
    description: null,
    published: true,
    created_at: "",
    updated_at: ""
  },
  {
    id: "fallback-event-3",
    title: "Prayer Gathering",
    event_date: null,
    time_label: "Wednesday, 6:30 PM",
    location: "Chapel Room",
    description: null,
    published: true,
    created_at: "",
    updated_at: ""
  }
];

export const fallbackMinistries: Ministry[] = [
  "Kids",
  "Youth",
  "Worship",
  "Small Groups",
  "Outreach",
  "Prayer"
].map((name, index) => ({
  id: `fallback-ministry-${index + 1}`,
  name,
  description: null,
  sort_order: index + 1,
  published: true,
  created_at: "",
  updated_at: ""
}));
