"use client";
import { useEffect, useState } from "react";
import Display from "./Display";
import SideBar from "./SideBar";
import { onValue, ref } from "firebase/database";
import { db } from "@/util/firebase";
import { UserProps } from "@/types/type";

const Main = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  useEffect(() => {
    const usersRef = ref(db, "users/");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList: UserProps[] = Object.keys(data)?.map((key) => ({
        uid: key,
        ...data[key],
      }));
      setUsers(usersList);
    });
  }, []);

  return (
    <div className="flex-1  flex h-full w-full">
      <div className="flex flex-1 md:flex-row  w-full flex-col-reverse gap-4 justify-start">
        <SideBar
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <Display selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Main;
