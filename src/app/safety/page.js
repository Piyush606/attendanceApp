"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function SafetyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        router.push("/login");
        return;
      }

      const userData = docSnap.data();
      if (userData.role !== "safety officer") {
        router.push("/dashboard");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return null;

  return (
    <div className="container mt-5">
      <h2>Welcome Safety Officer</h2>
      <p className="mb-4">Access categorized safety documents below:</p>

      <div className="accordion" id="safetyAccordion">

        {/* SOPs Section */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Standard Operating Procedures (SOPs)
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#safetyAccordion"
          >
            <div className="accordion-body">
              <ul>
                <li><a href="https://example.com/sop1.pdf" target="_blank">SOP for Machine Handling</a></li>
                <li><a href="https://example.com/sop2.pdf" target="_blank">SOP for Hazard Management</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Plans Section */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Emergency Response Plans
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#safetyAccordion"
          >
            <div className="accordion-body">
              <ul>
                <li><a href="https://example.com/emergency1.pdf" target="_blank">Fire Evacuation Plan</a></li>
                <li><a href="https://example.com/emergency2.pdf" target="_blank">Medical Emergency Protocol</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Safety Checklists */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Safety Checklists
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#safetyAccordion"
          >
            <div className="accordion-body">
              <ul>
                <li><a href="https://example.com/checklist1.pdf" target="_blank">Daily Safety Checklist</a></li>
                <li><a href="https://example.com/checklist2.pdf" target="_blank">PPE Inspection Checklist</a></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
