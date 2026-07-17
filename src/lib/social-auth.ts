import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Public client-side identifiers for the mediheal-4504e Firebase project (same stance as
// the web frontend's VITE_FIREBASE_* values: safe to ship, security is enforced in the
// Firebase console via enabled providers and registered app credentials).
const FIREBASE_API_KEY =
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyCDBpZGC1g2Am_BJtvh1KZL9t-eoHIifpI';
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  '150778617195-3r3r1e4d2a2q2rmgr3q3b364cth2qm1l.apps.googleusercontent.com';

let configured = false;
function ensureConfigured() {
  if (!configured) {
    GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    configured = true;
  }
}

/**
 * Exchange a Google ID token for a Firebase ID token via the Identity Toolkit REST API —
 * the same exchange the Firebase JS SDK performs for the web app's signInWithPopup.
 * The backend's /auth/login_social verifies Firebase ID tokens, not raw Google ones.
 */
async function exchangeGoogleToken(googleIdToken: string): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postBody: `id_token=${googleIdToken}&providerId=google.com`,
        requestUri: 'http://localhost',
        returnSecureToken: true,
        returnIdpCredential: true,
      }),
    },
  );
  const data = (await res.json()) as { idToken?: string; error?: { message?: string } };
  if (!res.ok || !data.idToken) {
    throw new Error(data.error?.message ?? 'Could not verify the Google account with Firebase');
  }
  return data.idToken;
}

/**
 * Native Google sign-in → Firebase ID token.
 * Returns null when the user dismissed the account picker (not an error).
 */
export async function signInWithGoogle(): Promise<string | null> {
  ensureConfigured();
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return null; // cancelled
    const googleIdToken = response.data.idToken;
    if (!googleIdToken) throw new Error('Google sign-in did not return an ID token');
    return await exchangeGoogleToken(googleIdToken);
  } catch (e) {
    if (isErrorWithCode(e)) {
      switch (e.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          return null;
        case statusCodes.IN_PROGRESS:
          return null;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error('Google Play Services is not available on this device');
        default:
          // DEVELOPER_ERROR usually means this build's SHA-1 is not registered in Firebase.
          throw new Error(`Google sign-in failed (${e.code}). ${e.message}`);
      }
    }
    throw e;
  }
}
