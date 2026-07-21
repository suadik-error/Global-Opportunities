"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, XCircle } from "lucide-react";
import { eventRecords, type EventRecord } from "@/lib/mock-events";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const original = eventRecords.find((e) => e.id === params.id);
  const [event, setEvent] = useState<EventRecord | undefined>(original);
  const [capacityInput, setCapacityInput] = useState(String(original?.capacity ?? ""));

  if (!event) {
    return (
      <div>
        <p className="text-sm text-kb-text-muted">Event not found.</p>
        <Link href="/events" className="text-sm text-kb-primary font-semibold mt-2 inline-block">
          Back to Events
        </Link>
      </div>
    );
  }

  const saveCapacity = () => {
    const value = parseInt(capacityInput, 10);
    if (Number.isNaN(value) || value < event.attendeesCount) return;
    setEvent((prev) => (prev ? { ...prev, capacity: value } : prev));
  };

  const cancelEvent = () => {
    setEvent((prev) => (prev ? { ...prev, status: "cancelled" } : prev));
  };

  const pct = Math.round((event.attendeesCount / event.capacity) * 100);

  return (
    <div>
      <button
        onClick={() => router.push("/events")}
        className="flex items-center gap-1.5 text-sm text-kb-text-muted hover:text-kb-text-body mb-6"
      >
        <ChevronLeft size={16} />
        Back to Events
      </button>

      <h1 className="text-xl font-bold text-kb-text-body">{event.title}</h1>
      <p className="text-sm text-kb-text-muted mt-1 mb-6">
        {event.hirer} · {event.location} · {event.dateTime}
      </p>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">
          Attendance
        </p>
        <div className="h-3 rounded-full bg-kb-bg-alt overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-kb-primary transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-sm text-kb-text-muted">
          {event.attendeesCount} of {event.capacity} spots filled ({pct}%)
        </p>
      </div>

      <div className="bg-kb-bg-card border border-kb-border rounded-2xl p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-kb-text-placeholder mb-3">
          Adjust Capacity
        </p>
        <div className="flex items-center gap-2 max-w-xs">
          <input
            type="number"
            value={capacityInput}
            onChange={(e) => setCapacityInput(e.target.value)}
            min={event.attendeesCount}
            className="flex-1 h-10 rounded-lg border border-kb-border-input px-3 text-sm text-kb-text-body outline-none focus:border-kb-primary"
          />
          <button
            onClick={saveCapacity}
            className="h-10 px-4 rounded-lg bg-kb-primary text-white text-sm font-semibold"
          >
            Save
          </button>
        </div>
        <p className="text-xs text-kb-text-placeholder mt-2">
          Cannot be set below current attendee count ({event.attendeesCount}).
        </p>
      </div>

      {event.status !== "cancelled" && (
        <button
          onClick={cancelEvent}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-sm font-semibold text-red-600 transition-colors"
        >
          <XCircle size={16} strokeWidth={2.5} />
          Cancel event
        </button>
      )}
    </div>
  );
}
