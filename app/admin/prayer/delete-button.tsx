"use client";

import { adminDeletePrayerRequest } from "./actions";

interface DeleteButtonProps {
  prayerId: string;
  prayerName: string;
}

export function DeleteButton({ prayerId, prayerName }: DeleteButtonProps) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirm(`Delete prayer request from ${prayerName}?`)) {
      return;
    }

    const formData = new FormData();
    formData.append("prayer_id", prayerId);
    
    await adminDeletePrayerRequest(formData);
  };

  return (
    <form onSubmit={handleDelete} style={{ display: 'inline' }}>
      <button
        type="submit"
        className="button danger"
        style={{ minHeight: '32px', padding: '6px 12px', fontSize: '0.85rem' }}
      >
        🗑️ Delete
      </button>
    </form>
  );
}

// Made with Bob
