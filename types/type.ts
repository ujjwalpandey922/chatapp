export type UserProps = {
  uid: string;
  email: string;
  online: boolean;
};

export type MessageProps = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  delivered: boolean;
  read: boolean;
};
