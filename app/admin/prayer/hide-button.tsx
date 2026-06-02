"use client";

import { adminToggleHidePrayer } from "./actions";

interface HideButtonProps {
  prayerId: string;
  isHidden: boolean;
}

export function HideButton({ prayerId, isHidden }: HideButtonProps) {
  const handleToggle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("prayer_id", prayerId);
    formData.append("is_hidden", String(isHidden));
    
    await adminToggleHidePrayer(formData);
  };

  return (
    <form onSubmit={handleToggle} style={{ display: 'inline' }}>
      <button
        type="submit"
        className={isHidden ? "button primary" : "button secondary"}
        style={{ 
          minHeight: '32px', 
          padding: '6px 12px', 
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {isHidden ? (
          <>
            <span>👁️</span>
            <span>Unhide</span>
          </>
        ) : (
          <>
            <span>🙈</span>
            <span>Hide</span>
          </>
        )}
      </button>
    </form>
  );
}

// Made with Bob
