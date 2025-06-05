"use client";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };

  return <div className="">User Profile Page : User ID - {userPhoneNo}</div>;
};

export default ProfilePage;
