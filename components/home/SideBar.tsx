"use client";
import { UserProps } from "@/types/type";
import { auth } from "@/util/firebase";
import { useEffect } from "react";

type sidebarProps = {
  users: UserProps[];
  selectedUser: UserProps | null;
  setSelectedUser: (user: UserProps) => void;
};
const Side: React.FC<sidebarProps> = ({
  users,
  selectedUser,
  setSelectedUser,
}) => {
  // Check if user is not the current user
  const filteredUsers = users?.filter((user) => {
    return user.uid !== auth?.currentUser?.uid;
  });
  return (
    <div className=" w-full bg-slate-900 md:w-72 p-4 rounded-xl max-h-[75vh]  ">
      <h1 className="text-lime-300 font-semibold text-center text-lg">
        Users List
      </h1>
      <div className="flex flex-col gap-4 p-4 h-[90%] w-full overflow-y-auto">
        {/* Render Users List items */}
        {filteredUsers?.map((singleUser: sidebarProps["users"][0]) => (
          <div
            key={singleUser?.uid}
            className={`rounded-md bg-sky-100 hover:scale-105 cursor-pointer px-4 py-2 flex  transition-all  text-black items-center  border w-full gap-1 lg:gap-4 justify-between 
              ${
                singleUser.uid == selectedUser?.uid
                  ? " bg-sky-600 border-black shadow-lg scale-105  cursor-default"
                  : ""
              }
              `}
            // Handle click event to select an order
            onClick={() => setSelectedUser(singleUser)}
          >
            <div className="w-full flex justify-start items-center gap-2 ">
              <span className="rounded-full min-w-10 h-10 grid place-items-center bg-black text-white font-bold text-xl ">
                {singleUser?.email?.slice(0, 1).toUpperCase()}
              </span>
              <div className="flex flex-col truncate">
                <h2 className="truncate font-medium  text-lg text-left">
                  {singleUser?.email}{" "}
                </h2>
                <p
                  className={`text-sm font-semibold ${
                    singleUser?.online ? "text-lime-500" : "text-sky-900"
                  } `}
                >
                  {singleUser?.online ? "(Online)" : "(Offline)"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Side;
