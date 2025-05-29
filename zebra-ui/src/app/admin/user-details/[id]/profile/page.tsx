"use client";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { id } = useParams();

  return <div className="">User Profile Page : User ID - {id}</div>;
};

export default ProfilePage;
