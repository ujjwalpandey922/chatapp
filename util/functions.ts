// utils/firebaseUtils.ts
import { auth, db } from "@/util/firebase";
import { onValue, ref, set, update } from "firebase/database";
// CHANGE THE USER STATUS WHEN LOGGED IN
export const updateUserStatus = (userId: string, status: boolean) => {
  update(ref(db, `users/${userId}`), { online: status });
};
// LOG OUT THE USER
export const logoutUser = async () => {
  if (auth.currentUser) {
    await updateUserStatus(auth.currentUser.uid, false);
    await auth.signOut();
  }
};
// SAVING A USER TO DB When he sign up
export const saveUserToDatabase = (user: any): void => {
  set(ref(db, "users/" + user.uid), {
    uid: user.uid,
    email: user.email,
    online: true,
  });
};
// login message status Listener
export const updateMessageStatus = (user: any) => {
  // Get messages reference Of the current user
  const messagesRef = ref(db, `messages/${user.uid}`);
  const handleMessageSnapshot = (snapshot: any) => {
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
  };
  // Listen for messages
  const unsubscribeLoggedInUser = onValue(messagesRef, handleMessageSnapshot);

  // Clean up the listeners on unmount or when selectedUser changes
  return () => {
    unsubscribeLoggedInUser();
  };
};
