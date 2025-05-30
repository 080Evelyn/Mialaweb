import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPopup(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPopup(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
      setShowPopup(false);
    }
  };

  if (isInstalled) return null;

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-sm p-6 text-center space-y-4">
            <div className="text-3xl">📲</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Install Our App
            </h2>
            <p className="text-gray-600">
              For a faster and better experience, install our PWA on your
              device.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleInstallClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                Install Now
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
