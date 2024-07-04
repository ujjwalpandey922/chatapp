"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db, googleProvider } from "@/util/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { onValue, ref, update } from "firebase/database";
import Link from "next/link";

// Interface for user credentials
interface Credentials {
  email: string;
  password: string;
}

// Login component for user authentication
const Login: React.FC = () => {
  // State for user credentials and errors
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    email: "",
    password: "",
  });

  // React.js router instance
  const router = useRouter();

  const updateUserStatus = (user: any, status: boolean) => {
    update(ref(db, "users/" + user.uid), {
      online: status,
    });
  };
  const updateMessageStatus = (user: any) => {
    // Get messages reference Of the current user
    const messagesRef = ref(db, `messages/${user.uid}`);
    onValue(messagesRef, (snapshot) => {
      // Check if there are any messages
      const data = snapshot.val();
      if (data) {
        // Loop through each message
        Object.keys(data).forEach((recipientUid) => {
          // Loop through each message ID
          Object.keys(data[recipientUid]).forEach((messageId) => {
            // Get the recipient's online status to change the message status
            const isOnline = ref(db, `users/${recipientUid}/online`);
            // Check if the message has been delivered
            onValue(isOnline, (snapshot) => {
              // Check if the recipient is online vaalue
              const isOnline = snapshot.val();
              // Check if the message has been delivered and the recipient is online
              if (!data[recipientUid][messageId].delivered && isOnline) {
                // Update the message status to delivered and the recipient's message status to delivered
                update(
                  ref(db, `messages/${user.uid}/${recipientUid}/${messageId}`),
                  {
                    delivered: true,
                  }
                );
              }
            });
          });
        });
      }
    });
  };
  // Handle input changes
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle user login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(credentials.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      return;
    }
    if (credentials.password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password should be at least 6 characters",
      }));
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      updateUserStatus(res.user, true);
      updateMessageStatus(res.user);
      if (res.user) {
        router.push("/");
      }
    } catch (error) {
      console.log("Login ERROR", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email or password",
        password: "Invalid email or password",
      }));
    }
  };

  // Handle user login with Google
  const handleLoginWithGoogle = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      updateUserStatus(res.user, true);
      updateMessageStatus(res.user);
      if (res.user) {
        router.push("/");
      }
    } catch (error) {
      console.log("Login ERROR", error);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex lg:flex-row bg-sky-50 flex-col-reverse ">
      {/* Left Section */}
      <div className="flex justify-center items-center max-lg:hidden w-full lg:w-[50%] bg-slate-900">
        <div className="w-full">
          <Image
            unoptimized
            width={50}
            height={50}
            className="w-full cursor-pointer"
            alt="gif"
            src={"/gifimg.gif"}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="container flex-1 max-w-md mx-auto flex flex-col items-center justify-center px-2">
        <h1 className="text-neutral-900 text-4xl mb-4 text-start w-full font-bold font-['Open Sans']">
          Welcome Back!
        </h1>

        {/* Email */}
        <div className="w-full flex flex-col">
          <label className="text-neutral-600 text-base font-normal font-['Open Sans']">
            Email Address
          </label>
          <input
            type="text"
            className={`block text-black text-lg border-grey-light w-full p-2 px-4 rounded-[7px] border border-neutral-400 ${
              errors.email && "border-red-500"
            }`}
            name="email"
            placeholder="Enter Valid Email"
            value={credentials.email}
            onChange={handleOnchange}
          />

          <p className="text-red-500 min-h-6 text-sm">{errors?.email}</p>
        </div>

        {/* Password */}
        <div className="relative w-full flex flex-col">
          <label className="text-neutral-600 text-base font-normal font-['Open Sans']">
            Password
          </label>
          <input
            type="password"
            className={`block text-black text-lg border-grey-light w-full p-2 px-4 rounded-[7px] border border-neutral-400 ${
              errors.password && "border-red-500"
            }`}
            name="password"
            placeholder="Enter Password"
            value={credentials.password}
            onChange={handleOnchange}
          />

          <p className="text-red-500 text-sm min-h-6">{errors?.password}</p>
        </div>

        {/* TERMS AND CONDITION */}
        <div className="w-full mt-4 max-w-[450px] text-center">
          <span className="text-neutral-600 text-base font-normal font-['Inter']">
            By logging in you agree with
          </span>
          <span className="text-blue-600 text-base font-normal font-['Inter']">
            {" "}
            terms and conditions
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full text-center py-3 my-5 text-white rounded bg-slate-800 text-xl font-normal font-['Inter'] hover:scale-105 transition-all focus:outline-none"
          onClick={handleLogin}
        >
          Log in
        </button>

        {/* Log In With */}
        <div className="flex w-full gap-2 justify-center items-center">
          <div className="w-full h-[0px] border border-zinc-300"></div>
          <span className="text-neutral-600 w-max text-xl font-semibold font-['Open Sans']">
            Or
          </span>
          <div className="w-full h-[0px] border border-zinc-300"></div>
        </div>

        {/* Log In Images */}
        <div
          onClick={handleLoginWithGoogle}
          className="flex p-4 cursor-pointer hover:bg-slate-200 justify-center items-center rounded-xl gap-4 border w-full my-5"
        >
          <Image
            width={30}
            height={30}
            alt="google"
            src={"/google.png"}
            className="cursor-pointer hover:scale-105 transition-transform"
          />
          <span className="text-neutral-600 text-base font-semibold font-['Inter']">
            Log In With Google
          </span>
        </div>

        {/* Sign Up Button */}
        <div className="flex gap-2">
          <span className="text-neutral-600 text-base font-normal font-['Open Sans']">
            Don&apos;t have an account?
          </span>
          <Link
            href="/signup"
            className="text-blue-600 text-base font-normal font-['Inter']"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
