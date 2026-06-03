"use client";

import { useState } from "react";

export function PwaInstall() {
  const [activePlatform, setActivePlatform] = useState<"android" | "ios">("android");

  return (
    <section className="section pwa-section">
      <div className="content-wrapper">
        <div className="pwa-content">
          <div className="pwa-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12" y2="18"/>
            </svg>
          </div>
          <h2>Install Aplikasi Kami</h2>
          <p className="pwa-description">
            Akses buku, renungan, dan berita dengan cepat langsung dari layar utama HP Anda — tanpa perlu ke app store!
          </p>

          <div className="pwa-tabs">
            <button 
              className={`pwa-tab ${activePlatform === "android" ? "active" : ""}`}
              onClick={() => setActivePlatform("android")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.5 11.5 0 0 0-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 11.16 3.5 13.84 3.5 16.5h17c0-2.66-1.3-5.34-2.9-7.02zM7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
              </svg>
              Android
            </button>
            <button 
              className={`pwa-tab ${activePlatform === "ios" ? "active" : ""}`}
              onClick={() => setActivePlatform("ios")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              iPhone / iPad
            </button>
          </div>

          {activePlatform === "android" && (
            <div className="pwa-instructions">
              <div className="pwa-step">
                <div className="pwa-step-number">1</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <div>
                    <h4>Buka di Chrome</h4>
                    <p>Pastikan Anda menggunakan Google Chrome di perangkat Android.</p>
                  </div>
                </div>
              </div>

              <div className="pwa-step">
                <div className="pwa-step-number">2</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                  </svg>
                  <div>
                    <h4>Ketuk menu tiga titik (⋮)</h4>
                    <p>Ketuk ikon tiga titik vertikal di pojok kanan atas Chrome.</p>
                  </div>
                </div>
              </div>

              <div className="pwa-step">
                <div className="pwa-step-number">3</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  <div>
                    <h4>Ketuk "Install App"</h4>
                    <p>Pilih "Add to Home screen" atau "Install App", lalu ketuk "Install".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePlatform === "ios" && (
            <div className="pwa-instructions">
              <div className="pwa-step">
                <div className="pwa-step-number">1</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <div>
                    <h4>Buka di Safari</h4>
                    <p>Pastikan Anda menggunakan Safari browser di iPhone atau iPad.</p>
                  </div>
                </div>
              </div>

              <div className="pwa-step">
                <div className="pwa-step-number">2</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <div>
                    <h4>Ketuk tombol Share</h4>
                    <p>Ketuk ikon share (kotak dengan panah ke atas) di bagian bawah browser.</p>
                  </div>
                </div>
              </div>

              <div className="pwa-step">
                <div className="pwa-step-number">3</div>
                <div className="pwa-step-content">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  <div>
                    <h4>Pilih "Add to Home Screen"</h4>
                    <p>Scroll ke bawah dan pilih "Add to Home Screen", lalu ketuk "Add".</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <a href="#" className="pwa-link">Lihat panduan lengkap →</a>
        </div>
      </div>
    </section>
  );
}

// Made with Bob
