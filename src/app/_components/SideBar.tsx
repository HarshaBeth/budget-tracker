"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import HomeImage from "../../../public/overview_icon.png";
import ViewSpendingsIcon from "../../../public/view_icon.png";
import AddSpendingIcon from "../../../public/add_icon.png";
import SideBarOpen from "../../../public/sidebar_open_icon.png";
import { signOut } from "@/lib/actions";
import { useSidebar } from "../_context/SidebarContext";
import Portal from "./Portal";
import ExitIcon from "../../../public/exit_icon.png";

type SideBarProps = {
  user_name?: string;
};

function SideBar({ user_name }: SideBarProps) {
  const { isOpen, toggle } = useSidebar();

  // --- Hooks (always in same order) ---
  const [userButtonOpen, setUserButtonOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // defer to next microtask / tick
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Handle clicking outside user button
  useEffect(() => {
    const handleClickOutside = () => setUserButtonOpen(false);

    if (userButtonOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userButtonOpen]);

  const handleUserButton = () => setUserButtonOpen(!userButtonOpen);

  // Always return a wrapper even if not mounted (hooks order stays same)
  if (!mounted) return <div style={{ display: "none" }} />;

  return (
    <div
      className={`flex flex-col gap-4 fixed top-0 left-0 min-h-screen overflow-x-visible overflow-y-auto bg-black text-white font-sans transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-20"
      } ${!isOpen && "items-center"} z-10`}
    >
      {mounted && (
        <Portal>
          <button
            onClick={toggle}
            className={`fixed top-6 z-50 transition-all duration-300 ${
              isOpen ? "left-56" : "left-16"
            } text-white`}
          >
            {isOpen ? (
              <span className="bg-green-500 px-2.5 pt-0.5 pb-1 text-black font-bold flex">
                x
              </span>
            ) : (
              <Image
                src={SideBarOpen}
                alt="Open"
                className="bg-black h-7 w-7"
                width={50}
                height={50}
              />
            )}
          </button>
        </Portal>
      )}

      <div className="flex flex-col flex-1 justify-between w-full p-4">
        <div className="flex flex-col">
          <Link
            href={"/dashboard"}
            className={`mt-20 flex gap-3 ${
              !isOpen && "justify-center"
            } hover:bg-gray-700 rounded-lg py-3 px-2`}
          >
            <Image className="h-5 w-5" src={HomeImage} alt="Home" />
            {isOpen && (
              <span className="transition duration-500 opacity-100">
                Overview
              </span>
            )}
          </Link>

          <Link
            href="/view-spendings"
            className={`flex gap-3 ${
              !isOpen && "justify-center"
            } hover:bg-gray-700 rounded-lg py-3 px-2`}
          >
            <Image
              className="h-5 w-5"
              src={ViewSpendingsIcon}
              alt="View Spending"
            />
            {isOpen && (
              <span className="transition duration-500 opacity-100">
                View Spending
              </span>
            )}
          </Link>

          <Link
            href="/add-spending"
            className={`flex gap-3 ${
              !isOpen && "justify-center"
            } hover:bg-gray-700 rounded-lg py-3 px-2`}
          >
            <Image
              className="h-5 w-5"
              src={AddSpendingIcon}
              alt="Add Spending"
            />
            {isOpen && (
              <span className="transition duration-500 opacity-100">
                Add Spending
              </span>
            )}
          </Link>

          <Link
            href="/add-budget"
            className={`flex gap-3 ${
              !isOpen && "justify-center"
            } hover:bg-gray-700 rounded-lg py-3 px-2`}
          >
            <Image className="h-5 w-5" src={AddSpendingIcon} alt="Add Budget" />
            {isOpen && (
              <span className="transition duration-500 opacity-100">
                Add Budget
              </span>
            )}
          </Link>
        </div>

        <div className={`flex flex-col gap-4 ${isOpen ? "relative" : ""} z-20`}>
          {userButtonOpen && (
            <span
              onClick={signOut}
              className={`border-2 px-2 py-3 rounded-lg hover:cursor-pointer min-w-50 max-w-50 absolute z-50 ${
                isOpen ? "" : "left-16"
              } ${
                isOpen
                  ? "-top-16 bg-red-500/45 border-red-400/45"
                  : " bg-red-600 border-red-500 bottom-2.5 hidden"
              } text-center font-serif`}
            >
              Sign Out
            </span>
          )}

          <div
            className={`flex flex-col ${isOpen ? "hidden" : "visible"} gap-2 items-center`}
          >
            <button
              onClick={signOut}
              className=" flex justify-center bg-gray-500/45 hover:bg-gray-500/60 transition w-fit pl-2 pr-1.5 rounded-lg py-2"
            >
              <Image
                src={ExitIcon}
                alt="Exit"
                className="h-5 w-5  rounded-sm "
              />
            </button>

            <div className="bg-red-400 rounded-full py-2 px-3.5 w-fit">
              {user_name?.charAt(0)}
            </div>
          </div>

          <div
            onClick={handleUserButton}
            className={`${
              !isOpen ? "hidden" : "visible"
            } flex gap-2 items-center font-sans font-semibold ${
              !isOpen && "justify-center"
            } hover:cursor-pointer`}
          >
            <div className="bg-red-400 rounded-full py-2 px-3.5 w-fit">
              {user_name?.charAt(0)}
            </div>
            {isOpen && <span>{user_name}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
