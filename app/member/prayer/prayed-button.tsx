"use client";

import { togglePrayerInteraction } from "../actions";

interface PrayedButtonProps {
  prayerId: string;
  hasPrayed: boolean;
}

export function PrayedButton({ prayerId, hasPrayed }: PrayedButtonProps) {
  const handleToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("prayer_id", prayerId);
    
    await togglePrayerInteraction(formData);
  };

  return (
    <form onSubmit={handleToggle} style={{ display: 'inline' }}>
      <button
        type="submit"
        className={hasPrayed ? "button secondary" : "button primary"}
        style={{ 
          minHeight: '32px', 
          padding: '6px 16px', 
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {hasPrayed ? (
          <>
            <span>✓</span>
            <span>Prayed</span>
          </>
        ) : (
          <>
            <span>🙏</span>
            <span>I've Prayed</span>
          </>
        )}
      </button>
    </form>
  );
}

// Made with Bob
