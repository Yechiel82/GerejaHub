"use client";

import { useState } from "react";
import { deletePrayerRequest, updatePrayerRequest } from "../actions";
import { formatDisplayDate } from "@/lib/data/content";

interface PrayerItemProps {
  prayer: {
    id: string;
    name: string;
    request: string;
    visibility: string;
    status: string;
    created_at: string;
  };
}

export function PrayerItem({ prayer }: PrayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState(prayer.request);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if within 15 minutes for edit
  const createdAt = new Date(prayer.created_at);
  const now = new Date();
  const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
  const canEdit = diffMinutes <= 15;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prayer request?")) {
      return;
    }
    setIsDeleting(true);
  };

  return (
    <article>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <div>
          <strong>{prayer.name}</strong>
          <span style={{ marginLeft: '12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
            {prayer.visibility === 'church' ? '🌍 Shared with church' : '🔒 Private to leaders'} · {prayer.status}
          </span>
        </div>
      </div>

      {isEditing ? (
        <form action={updatePrayerRequest}>
          <input type="hidden" name="prayer_id" value={prayer.id} />
          <textarea
            name="request"
            value={editedRequest}
            onChange={(e) => setEditedRequest(e.target.value)}
            className="note-textarea"
            style={{ minHeight: '100px', marginBottom: '8px' }}
            required
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" className="button primary" style={{ minHeight: '36px', padding: '8px 16px' }}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedRequest(prayer.request);
              }}
              className="button secondary"
              style={{ minHeight: '36px', padding: '8px 16px' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p>{prayer.request}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span className="item-meta">
              {formatDisplayDate(prayer.created_at)}
              {canEdit && <span style={{ marginLeft: '8px', color: 'var(--green)', fontSize: '0.85rem' }}>
                (Editable for {Math.ceil(15 - diffMinutes)} more min)
              </span>}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="icon-button"
                  style={{ fontSize: '0.85rem' }}
                >
                  ✏️ Edit
                </button>
              )}
              <form action={deletePrayerRequest} style={{ display: 'inline' }}>
                <input type="hidden" name="prayer_id" value={prayer.id} />
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!confirm("Are you sure you want to delete this prayer request?")) {
                      e.preventDefault();
                    }
                  }}
                  className="icon-button"
                  style={{ fontSize: '0.85rem', color: 'var(--coral)' }}
                  disabled={isDeleting}
                >
                  🗑️ Delete
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

// Made with Bob
