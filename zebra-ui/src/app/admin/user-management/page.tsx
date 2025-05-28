import React from "react";
import { TUser, UsersManagement } from "./components/UserManagement";

async function getUsers(): Promise<TUser[]> {
  const res = await fetch(
    "https://682f1111746f8ca4a47faa4c.mockapi.io/api/users",
  );
  const data = await res.json();
  const editedData = [
    ...data,
    {
      name: "Brent Klein Brent",
      phoneNo: "1-336-718-7709",
      email: "Stewart.kow@gmail.com",
      admin: true,
      avatar: "",
      blacklisted: true,
      connectBalance: 29,
      id: "59",
    },
    {
      name: "Denni Lab",
      phoneNo: "(422) 818-5869",
      email: "Marianne77@mail.com",
      admin: true,
      avatar: "",
      blacklisted: true,
      connectBalance: 54,
      id: "60",
    },
    {
      name: "Den Jab",
      phoneNo: "(422) 998-5869",
      email: "denianne77@mail.com",
      admin: true,
      avatar: "",
      blacklisted: true,
      connectBalance: 54,
      id: "61",
    },
    {
      name: "Ned Jab",
      phoneNo: "(422) 998-5869",
      email: "deniane77@ail.com",
      admin: true,
      avatar: "",
      blacklisted: false,
      connectBalance: 54,
      id: "62",
    },
  ];
  return editedData;
}

const UserManagementPage: React.FC = async () => {
  const users = await getUsers();
  return <UsersManagement users={users} />;
};

export default UserManagementPage;
