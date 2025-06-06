"use client";
import { useParams } from "next/navigation";

const ProfilePage: React.FC = () => {
  const { userPhoneNo } = useParams() as { userPhoneNo: string };

  return (
    <div className="border border-black flex-1">
      User Profile Page : User ID - {userPhoneNo}
    </div>
  );
};

export default ProfilePage;
