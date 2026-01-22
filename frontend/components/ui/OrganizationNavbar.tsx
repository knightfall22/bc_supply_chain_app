"use client";

import Link from "next/link";

const OrganizationNavbar = () => {
  return (
    <header className="border-b border-border-low">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <span className="text-sm font-medium tracking-tight">
          <Link href="/">Organization</Link>
        </span>

        <ul className="flex h-full items-center gap-10 text-sm">
          {/* Products */}
          <li className="nav-item-root">
            <span className="nav-trigger">Products</span>

            <div className="nav-dropdown">
              <Link href="/products/create" className="nav-item">
                Create product
              </Link>
              <Link href="/products" className="nav-item">
                View all products
              </Link>
            </div>
          </li>

          {/* Participants */}
          <li className="nav-item-root">
            <span className="nav-trigger">Participants</span>

            <div className="nav-dropdown">
              <Link href="/participants/create" className="nav-item">
                Create participant
              </Link>
              <Link href="/participants" className="nav-item">
                View all participants
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default OrganizationNavbar;
