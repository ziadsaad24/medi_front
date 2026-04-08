import { createContext, useState, useContext } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    fullName: "د. أحمد محمد الشمري",
    specialization: "استشاري أمراض القلب والأوعية الدموية",
    phone: "0501234567",
    email: "dr.ahmed@clinic.com",
    profileImage: null,
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}