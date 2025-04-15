"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [today, setToday] = useState("");
  const [groupedStaff, setGroupedStaff] = useState({});
  const [selectedStaffById, setSelectedStaffById] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      const date = new Date().toISOString().split("T")[0];
      setToday(date);

      // Fetch staff for current incharge
      const q = query(collection(db, "staff"), where("inchargeUid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const allStaff = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allStaff.push({ id: doc.id, ...data });
      });

      // Group by role
      const grouped = {};
      allStaff.forEach((member) => {
        (member.role || []).forEach((role) => {
          if (!grouped[role]) grouped[role] = [];
          grouped[role].push(member);
        });
      });

      setGroupedStaff(grouped);
    });

    return () => unsubscribe();
  }, [router]);

  const toggleSelection = (worker, role) => {
    setSelectedStaffById((prev) => {
      const newSelected = { ...prev };
      if (newSelected[worker.id]) {
        delete newSelected[worker.id];
      } else {
        newSelected[worker.id] = { ...worker, selectedRole: role };
      }
      return newSelected;
    });
  };

  const isSelected = (workerId) => {
    return !!selectedStaffById[workerId];
  };

  const isDisabled = (workerId, role) => {
    return selectedStaffById[workerId] && selectedStaffById[workerId].selectedRole !== role;
  };

  const handlePreview = () => {
    const grouped = {};
    Object.values(selectedStaffById).forEach(({ name, selectedRole }) => {
      if (!grouped[selectedRole]) grouped[selectedRole] = [];
      grouped[selectedRole].push(name);
    });
    setPreviewData(grouped);
  };

  const handleSubmitFinal = async () => {
    try {
      await addDoc(collection(db, "allocations"), {
        inchargeUid: user.uid,
        inchargeEmail: user.email,
        date: today,
        allocation: previewData,
        timestamp: new Date()
      });
      alert("Allocation submitted successfully!");
      setPreviewData(null);
      setSelectedStaffById({});
    } catch (err) {
      console.error("Error submitting allocation:", err);
      alert("Something went wrong while saving!");
    }
  };

  const selectedCount = Object.keys(selectedStaffById).length;

  return (
    <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
        <h2>Welcome, {user?.email}</h2>
        <p>Today's Date: {today}</p>
        </div>
      <button
        className="btn btn-outline-danger"
        onClick={async () => {
          await auth.signOut();
          router.push("/login");
        }}
      >
        ⛏ Logout
      </button>
      </div>
      <div className="alert alert-info">Selected Staff: <b>{selectedCount}</b></div>

      {Object.keys(groupedStaff).map((role) => (
        <div key={role} className="mb-4">
          <h5 className="text-primary">{role.toUpperCase()}</h5>
          {groupedStaff[role].map((member) => (
            <div key={member.id + "-" + role} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`${role}-${member.id}`}
                checked={isSelected(member.id) && selectedStaffById[member.id]?.selectedRole === role}
                onChange={() => toggleSelection(member, role)}
                disabled={isDisabled(member.id, role)}
              />
              <label className="form-check-label" htmlFor={`${role}-${member.id}`}>
                {member.name}
              </label>
            </div>
          ))}
        </div>
      ))}

      <button className="btn btn-primary mt-4" onClick={handlePreview}>
        Preview Selected Allocation
      </button>

      {previewData && (
        <div className="mt-4">
          <h4>Selected Manpower Allocation - <b></b></h4>
          {Object.keys(previewData).map((role) => (
            <div key={role} className="mb-3">
              <h6>{role.toUpperCase()} ({previewData[role].length})</h6>
              <table className="table table-bordered table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Worker Name</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData[role].map((name, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {/* <button className="btn btn-success" onClick={handleSubmitFinal}>
            Submit Final Allocation
          </button> */}
        </div>
      )}
    </div>
  );
}
