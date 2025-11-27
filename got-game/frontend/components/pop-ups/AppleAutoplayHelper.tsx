"use client";

import { useEffect, useState } from "react";

type DeviceType = "iphone" | "ipad" | "mac" | null;

export default function AppleAutoplayHelper() {
  const [showPopup, setShowPopup] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>(null);
  const [userConfirmed, setUserConfirmed] = useState(false);

  // Load persisted confirmation
  useEffect(() => {
    const stored = localStorage.getItem("autoplay_user_confirmed");
    if (stored === "true") setUserConfirmed(true);
  }, []);

  // Detect Apple device
  useEffect(() => {
    detectAppleDevice();
  }, []);

  // Check autoplay after device detection
  useEffect(() => {
    if (deviceType && !userConfirmed) {
      checkAutoplay();
    }
  }, [deviceType, userConfirmed]);

  // --- Helpers ---
  const detectAppleDevice = () => {
    const ua = navigator.userAgent.toLowerCase();

    const isIOS = /iphone|ipod/.test(ua);
    const isIPad =
      /ipad/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isMac = !isIOS && !isIPad && /macintosh|mac os x/.test(ua);

    if (isIOS) setDeviceType("iphone");
    else if (isIPad) setDeviceType("ipad");
    else if (isMac) setDeviceType("mac");
  };

  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("crios") && !ua.includes("android");
  };

  // --- Autoplay check ---
  const checkAutoplay = async () => {
    if (!deviceType || userConfirmed) return;

    // Safari: autoplay is blocked by default
    if (isSafari()) {
      setShowPopup(true);
      return;
    }

    // Other browsers: test autoplay using a small muted video
    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.style.position = "fixed";
    vid.style.width = "1px";
    vid.style.height = "1px";
    vid.style.top = "-9999px";
    vid.style.left = "-9999px";
    vid.src =
      "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAu1tZGF0AAACrQ=="; // tiny silent video

    document.body.appendChild(vid);

    try {
      await vid.play();
    } catch {
      setShowPopup(true);
    } finally {
      vid.pause();
      vid.remove();
    }
  };

  // Close popup and persist user confirmation
  const closePopup = () => {
    setUserConfirmed(true);
    localStorage.setItem("autoplay_user_confirmed", "true");
    setShowPopup(false);
  };

  const getInstructions = () => {
    switch (deviceType) {
      case "iphone":
      case "ipad":
        return (
          <>
            <p className="text-white/90 mb-3">
              To enable autoplay on your {deviceType === "iphone" ? "iPhone" : "iPad"}:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-white/80 text-sm">
              <li>Open the <strong>Settings</strong> app</li>
              <li>Scroll down and tap <strong>Safari</strong></li>
              <li>Under "Settings for Websites", tap <strong>Auto-Play</strong></li>
              <li>Select <strong>Allow All Auto-Play</strong></li>
            </ol>
            <p className="text-white/70 text-xs mt-3">
              Then refresh this page to continue.
            </p>
          </>
        );

      case "mac":
        return (
          <>
            <p className="text-white/90 mb-3">To enable autoplay on macOS Safari:</p>
            <ol className="list-decimal pl-5 space-y-2 text-white/80 text-sm">
              <li>Open <strong>Safari</strong></li>
              <li>Click <strong>Safari</strong> in the menu bar, then <strong>Settings</strong></li>
              <li>Click the <strong>Websites</strong> tab</li>
              <li>In the left sidebar, click <strong>Auto-Play</strong></li>
              <li>Set this website to <strong>Allow All Auto-Play</strong></li>
            </ol>
            <p className="text-white/70 text-xs mt-3">
              Then refresh this page to continue.
            </p>
          </>
        );

      default:
        return (
          <>
            <p className="text-white/90 mb-3">Autoplay is blocked by your browser settings.</p>
            <p className="text-white/80 text-sm">Please check your browser's autoplay settings to enable video playback.</p>
          </>
        );
    }
  };

  // --- Render ---
  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] px-4">
          <div className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-xl p-6 border border-purple-500/40 shadow-2xl w-full max-w-md text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Enable Autoplay</h3>
            </div>

            <div className="space-y-2 mb-6">{getInstructions()}</div>

            <button
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 transition-colors rounded-lg text-white font-medium shadow-lg hover:shadow-xl"
              onClick={closePopup}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
