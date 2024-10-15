"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PopupCallback = () => {
  const [mounted, setMounted] = useState(false);
  const params = useSearchParams();

  const code = params.get("code");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!code) return;
    // Send the code to the parent window

    const msg = { authResultCode: code };
    const channel = new BroadcastChannel("popup-channel");
    channel.postMessage(msg);

    console.log("POSTOU MSG: " + msg);
    window.close();
  }, []);

  if (!mounted) return null;

  // Close the popup if there is no code
  if (!code) {
    window.close();
  }

  return <div>&nbsp</div>;
};

export default PopupCallback;