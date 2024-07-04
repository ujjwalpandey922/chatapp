"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { auth, db } from "@/util/firebase";
import { ref, onValue, set, push, update } from "firebase/database";
import { MessageProps, UserProps } from "@/types/type";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

type DisplayProps = {
  selectedUser: UserProps | null;
};
const Display: React.FC<DisplayProps> = ({ selectedUser }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Fetch messages when selectedUser changes
    if (selectedUser && auth?.currentUser?.uid !== selectedUser?.uid) {
      // Get messages reference
      const messagesRef = ref(
        db,
        `messages/${auth?.currentUser?.uid}/${selectedUser?.uid}`
      );
      // Listen for messages
      onValue(messagesRef, (snapshot) => {
        // Check if there are any messages
        const data = snapshot.val();
        console.log({ data });
        if (data) {
          const messagesList: MessageProps[] = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messagesList);
        } else {
          setMessages([]);
        }
      });

      // Get recipient's messages
      const recipientMessagesRef = ref(
        db,
        `messages/${selectedUser?.uid}/${auth?.currentUser?.uid}`
      );
      // Listen for recipient's messages
      onValue(recipientMessagesRef, (snapshot) => {
        // Check if there are any messages
        const data = snapshot.val();
        if (data) {
          // Loop through each message
          Object.keys(data).forEach((key) => {
            // Check if the message has been read
            if (!data[key].read && data[key].delivered) {
              update(
                ref(
                  db,
                  `messages/${selectedUser?.uid}/${auth?.currentUser?.uid}/${key}`
                ),
                {
                  read: true,
                }
              );
            }
          });
        }
      });
    }
  }, [selectedUser]);

  const sendMessage = () => {
    if (!selectedUser || !auth.currentUser) return;

    const messageRef = push(
      ref(db, `messages/${auth.currentUser.uid}/${selectedUser.uid}`)
    );
    set(messageRef, {
      sender: auth.currentUser.uid,
      content: message,
      timestamp: Date.now(),
      delivered: false,
      read: false,
    });

    const recipientMessageRef = push(
      ref(db, `messages/${selectedUser.uid}/${auth.currentUser.uid}`)
    );
    set(recipientMessageRef, {
      sender: auth.currentUser.uid,
      content: message,
      timestamp: Date.now(),
      delivered: false,
      read: false,
    });

    setMessage("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  console.log({ selectedUser, messages });
  if (!selectedUser)
    return (
      <h1 className="text-center w-full text-3xl font-bold text-white">
        Select any user online to start chat
      </h1>
    );
  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex flex-col flex-1 p-2 bg-slate-900 rounded-lg overflow-y-auto">
        <h1 className="text-2xl font-bold text-white text-center pb-4 pt-2 border-b-2">
          {selectedUser?.email}
        </h1>
        {messages
          ?.filter((msg) => msg.content)
          .map((msg) => (
            <div
              key={msg.id}
              className={`p-2 my-2 w-max rounded-lg border flex gap-2 ${
                msg.sender === auth.currentUser?.uid
                  ? "ms-auto justify-end text-right bg-lime-300 "
                  : "me-auto justify-start text-left bg-sky-300"
              }`}
            >
              <p>{msg.content}</p>

              <div className="flex items-center space-x-2 text-sm">
                {
                  msg.delivered ? (
                    msg.read ? (
                      <FaCheckDouble className="text-blue-500" /> // Delivered and read
                    ) : (
                      <FaCheckDouble /> // Delivered but not read
                    )
                  ) : (
                    <FaCheck />
                  ) // Message not delivered only sent
                }
              </div>
            </div>
          ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Enter message!!!!!!!!!"
          className="flex-1 p-2 px-4 rounded-l-lg outline-none bg-slate-900 text-white"
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-900 text-white rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Display;
