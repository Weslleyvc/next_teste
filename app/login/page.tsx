"use client"

import { useEffect, useState } from "react";

import { login, signup, signupGoogle, handleSignInWithGoogle } from './actions';
import { createClient } from "@/utils/supabase/client";

import { useRouter } from "next/navigation";


export default function LoginPage() {

  const [popup, setPopup] = useState<Window | null>(null);
  const router = useRouter();

  useEffect(() => {
    // If there is no popup, nothing to do

    console.log("POP UP");

    if (!popup) return;

    console.log("COM POP UP");

    // Listen for messages from the popup by creating a BroadcastChannel
    const channel = new BroadcastChannel("popup-channel");
    channel.addEventListener("message", getDataFromPopup);

    // effect cleaner (when component unmount)
    return () => {

      console.log("DESMONTANDO");

      channel.removeEventListener("message", getDataFromPopup);
      setPopup(null);
    };
  }, [popup]);

  const login = async () => {
    const supabase = createClient();
    const origin = location.origin;

    const ul = `${origin}/auth/callback`;

    console.log("URL: " + ul);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: ul,
        queryParams: { prompt: "select_account" },
        skipBrowserRedirect: true,
      },
    });

    if (error || !data) {
      console.log("ERRO AO FAZER LOGIN");
      return;
    }

    console.log(data.url);

    const popup = openPopup(data.url);

    console.log("POPUP");
    console.log(popup);

    setPopup(popup);
  };

  const openPopup = (url: string) => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // window features for popup
    const windowFeatures = `scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`;
    const popup = window.open(url, "popup", windowFeatures);
    
    console.log("OPEN POPUP");

    return popup;
  };

  const getDataFromPopup = (e: any) => {

    console.log("GET DATA");

    // check origin
    if (e.origin !== window.location.origin) return;

    // get authResultCode from popup
    const code = e.data?.authResultCode;
    if (!code) return;

    console.log("CODIGO: ");
    console.log(code);

    // clear popup and replace the route
    // setPopup(null);
    // router.replace(`/api/~~/?code=${code}`);
  };

  return (
    <form>
      {/* <script src="https://accounts.google.com/gsi/client" async></script> */}
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email"  />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password"  />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <button formAction={signupGoogle}>Sign up Google</button>
      <button formAction={handleSignInWithGoogle}>Sign up Google</button>

      <button onClick={login}>
      Google Login {popup ? "processing..." : ""}
      </button>

      <div id="g_id_onload"
     data-client_id="642352556064-jk60atlceacvhv9g2l0i8s2aqhn2ghp5.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="popup"
     data-login_uri="http://localhost:3000/auth/callback"
     data-auto_prompt="false">
</div>

<div className="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div>

    </form>
  )
}