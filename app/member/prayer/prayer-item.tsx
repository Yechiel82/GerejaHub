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
    is_anonymous?: boolean;
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
    <article className="prayer-card" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px' }}>
      <div className="prayer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <strong style={{ fontSize: '1.1rem' }}>
              {prayer.is_anonymous ? (
                <>
                  Anonymous
                  <span style={{ marginLeft: '8px', padding: '3px 10px', background: '#9e9e9e', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    YOUR PRAYER
                  </span>
                </>
              ) : (
                prayer.name
              )}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className={`status-badge status-${prayer.status}`} style={{ fontSize: '0.85rem' }}>
              {prayer.status}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              {prayer.visibility === 'church' ? '🌍 Shared with church' : '🔒 Private to leaders'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!isEditing && canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="button secondary"
              style={{ minHeight: '36px', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              ✏️ Edit
            </button>
          )}
          {!isEditing && (
            <form action={deletePrayerRequest} style={{ display: 'inline' }}>
              <input type="hidden" name="prayer_id" value={prayer.id} />
              <button
                type="submit"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to delete this prayer request?")) {
                    e.preventDefault();
                  }
                }}
                className="button secondary"
                style={{ minHeight: '36px', padding: '8px 16px', fontSize: '0.9rem', color: 'var(--coral)', borderColor: 'var(--coral)' }}
                disabled={isDeleting}
              >
                🗑️ Delete
              </button>
            </form>
          )}
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
            style={{ minHeight: '120px', marginBottom: '12px', width: '100%' }}
            required
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditedRequest(prayer.request);
              }}
              className="button secondary"
              style={{ minHeight: '38px', padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button type="submit" className="button primary" style={{ minHeight: '38px', padding: '10px 20px' }}>
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <p style={{ marginBottom: '12px', lineHeight: '1.6', color: 'var(--ink)' }}>{prayer.request}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              {formatDisplayDate(prayer.created_at)}
              {canEdit && <span style={{ marginLeft: '8px', color: 'var(--green)', fontWeight: '600' }}>
                • Editable for {Math.ceil(15 - diffMinutes)} more min
              </span>}
            </span>
          </div>
        </>
      )}
    </article>
  );
}

// Made with Bob
