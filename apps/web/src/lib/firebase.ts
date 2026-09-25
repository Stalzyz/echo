import { initializeApp, getApps, getApp, FirebaseApp } from  "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail, onAuthStateChanged, type User, Auth } from  "firebase/auth"
import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp, Timestamp, Firestore } from  "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, FirebaseStorage } from  "firebase/storage"
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported, Messaging } from  "firebase/messaging"
import { getAnalytics, logEvent, isSupported as isAnalyticsSupported, Analytics } from  "firebase/analytics"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCmskkuHzlilvOL0bvFIzUmmUOBeSYPYkc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "echo-lms-aecb3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "echo-lms-aecb3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "echo-lms-aecb3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "468643314531",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:468643314531:web:6aa9e22208aeb3904cf156",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BKH640E6VK"
}


// 1. Core App Singleton
export const firebaseApp: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// 2. Auth Singleton & Providers
export const firebaseAuth: Auth = getAuth(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider()
export const githubAuthProvider = new GithubAuthProvider()

// Auth Helper Functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleAuthProvider)
    return result.user
  } catch (error) {
    console.error("[Firebase Auth]: Google Sign-In failed", error)
    throw error
  }
}

export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, githubAuthProvider)
    return result.user
  } catch (error) {
    console.error("[Firebase Auth]: GitHub Sign-In failed", error)
    throw error
  }
}

export const signOutUser = async () => {
  try {
    await signOut(firebaseAuth)
  } catch (error) {
    console.error("[Firebase Auth]: Sign-out failed", error)
    throw error
  }
}

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(firebaseAuth, email)
  } catch (error) {
    console.error("[Firebase Auth]: Password reset email failed", error)
    throw error
  }
}

// 3. Firestore Singleton
export const firebaseDb: Firestore = getFirestore(firebaseApp)

// 4. Storage Singleton & Helpers
export const firebaseStorage: FirebaseStorage = getStorage(firebaseApp)

export const uploadFileToFirebase = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(firebaseStorage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) onProgress(progress)
      },
      (error) => {
        console.error("[Firebase Storage]: Upload failed", error)
        reject(error)
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadUrl)
      }
    )
  })
}

export const deleteFileFromFirebase = async (path: string): Promise<void> => {
  const storageRef = ref(firebaseStorage, path)
  try {
    await deleteObject(storageRef)
  } catch (error) {
    console.error("[Firebase Storage]: Delete failed", error)
    throw error
  }
}

// 5. Cloud Messaging (SSR Safe)
export const getFcmMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null
  const supported = await isMessagingSupported()
  return supported ? getMessaging(firebaseApp) : null
}

export const requestFcmToken = async (vapidKey?: string): Promise<string | null> => {
  try {
    const messaging = await getFcmMessaging()
    if (!messaging) return null
    const token = await getToken(messaging, { vapidKey })
    return token
  } catch (error) {
    console.error("[Firebase FCM]: Failed to get FCM token", error)
    return null
  }
}

// 6. Analytics (SSR Safe)
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null
  const supported = await isAnalyticsSupported()
  return supported ? getAnalytics(firebaseApp) : null
}

export const logFirebaseEvent = async (eventName: string, eventParams?: Record<string, any>) => {
  try {
    const analytics = await getFirebaseAnalytics()
    if (analytics) {
      logEvent(analytics, eventName, eventParams)
    }
  } catch (error) {
    console.warn("[Firebase Analytics]: Event logging failed", error)
  }
}

// Re-exports for Auth & Firestore & Storage
export {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  onMessage
}

export type { ConfirmationResult, User }

