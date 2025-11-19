import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between animate-fade-in">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install MyMotoLog</h3>
          <p className="text-sm text-white/90">
            Install our app for a better experience!
          </p>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => setShowInstallButton(false)}
            className="px-3 py-2 text-white/90 hover:text-white text-sm font-medium"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-white text-cyan-600 rounded-md hover:bg-gray-100 font-semibold text-sm shadow-md"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;