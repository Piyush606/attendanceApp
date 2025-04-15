"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light mb-4">
      <div className="container justify-content-center">
        <Link href="/" className="navbar-brand text-center">
          <i className="bi bi-0-circle-fill"></i>
        </Link>
      </div>
    </nav>
  );
}
