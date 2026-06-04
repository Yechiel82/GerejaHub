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
          minHeight: '36px',
          padding: '8px 18px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '700',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
      >
        {hasPrayed ? (
          <>
            <span style={{ fontSize: '1rem' }}>✓</span>
            <span>Prayed</span>
          </>
        ) : (
          <>
            <span style={{ fontSize: '1rem' }}>🙏</span>
            <span>I'll Pray</span>
          </>
        )}
      </button>
    </form>
  );
}

// Made with Bob
