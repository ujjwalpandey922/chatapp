"use client";
import { auth, db } from "@/util/firebase";
import { signOut } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
const Header = () => {
  // Hook for programmatic navigation
  const router = useRouter();

  // Function to handle user logout
  const handleLogOut = async () => {
    console.log("LOGOUT");
    try {
      // Set the user's online status to false in the database
      set(ref(db, "users/" + auth?.currentUser?.uid + "/online"), false);
      // Sign out the user using Firebase authentication
      await signOut(auth);
      // Navigate to the signup page after successful logout
      router.push("/signup");
    } catch (error) {
      console.log(error);
    }
  };

  // Render the component
  return (
    <div className="w-full flex justify-between md:gap-8 gap-2 md:p-8 p-2 items-center text-white">
      {/* Display user's display name */}
      <h1 className="md:text-[1.5rem] text-[1rem]">
        Hi , {auth?.currentUser?.displayName || auth?.currentUser?.email}
      </h1>
      <div className="flex gap-4">
        {/* Navigation Links */}
        <span className="text-center md:block hidden text-zinc-100 text-sm md:text-lg font-normal font-['DM Sans'] leading-[18px]">
          FAQs
        </span>
        <span className="text-center md:block hidden text-zinc-100 text-sm md:text-lg font-normal font-['DM Sans'] leading-[18px]">
          How to Use
        </span>
        <span className="text-center md:block hidden text-zinc-100 text-sm md:text-lg font-normal font-['DM Sans'] leading-[18px]">
          Support
        </span>
        <span className="text-center md:block hidden text-zinc-100 text-sm md:text-lg font-normal font-['DM Sans'] leading-[18px]">
          Plans
        </span>
        {/* User Logout Button */}
        <button
          className="border rounded-md px-2 p-1 hover:scale-105 transition-all hover:border-sky-600 hover:text-sky-500 text-white text-sm cursor-pointer"
          onClick={handleLogOut} // Trigger logout action on button click
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
