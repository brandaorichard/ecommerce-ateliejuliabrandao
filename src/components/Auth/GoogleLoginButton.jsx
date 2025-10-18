import { useEffect, useRef } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '443535322074-7pp5innr18a230n59n255r48v5s5k6d5.apps.googleusercontent.com';

export default function GoogleLoginButton({ onSuccess, onError, text = "signin_with" }) {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (!window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onSuccess
    });

    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      {
        theme: "outline",
        size: "large",
        text: text, // "signin_with", "signup_with", "continue_with"
        width: 300,
        shape: "rectangular",
        logo_alignment: "left"
      }
    );
  }, [onSuccess, text]);

  return <div ref={googleButtonRef} className="google-button-container" />;
}
