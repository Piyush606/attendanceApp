'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
// import Navbar from "@/components/Navbar";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/lib/firebase'; // already imported above

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await userCredential.user.getIdToken(); // Firebase JWT

      // Get user role from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
        setError("No user profile found.");
        return;
        }

        const userData = docSnap.data();
        if (userData.role !== "incharge" && userData.role !== "safety officer") {
        setError("You are not authorized to access this dashboard.");
        return;
        }
        
        if (userData.role === "safety officer"){
            window.location.href = "https://www.notion.so/Safety-Officer-1d62a6f9631b800b8593da6966a79fc3?pvs=4";
            return;
        }

      // Store token in localStorage (or cookies if you prefer)
      localStorage.setItem('token', token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

  return (<>
    {/* <Navbar/> */}
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4">Incharge Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
    </>
  );
}
