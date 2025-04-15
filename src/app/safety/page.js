'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SafetyPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === 'safety officer') {
        setAuthorized(true);
        setLoading(false);
        // Redirect to Notion link after verifying role
        window.location.href = 'https://www.notion.so/Safety-Officer-1d62a6f9631b800b8593da6966a79fc3?pvs=4';
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-5">Checking access...</p>;
  }

  return authorized ? <p className="text-center mt-5">Redirecting to Notion...</p> : null;
}
