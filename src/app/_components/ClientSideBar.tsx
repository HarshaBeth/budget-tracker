"use client";

import dynamic from "next/dynamic";

const SideBar = dynamic(() => import("./SideBar"), {
  ssr: false,
});

export default function ClientSideBar() {
  return <SideBar />;
}
