import { createContext, useMemo, useState, useContext, useEffect } from "react";
import doctorApi from "../services/doctorApi";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

const PROFILE_STORAGE_KEY = 'doctor-profile';

const defaultDoctorProfile = {
  fullName: '',
  specialization: '',
  phone: '',
  email: '',
  profileImage: null,
  address: '',
  clinicName: '',
  licenseNumber: '',
  experience: '',
  about: '',
  consultationFee: '',
};

const isDoctorProfileCompleteInternal = (profile) => {
  const requiredFields = [
    profile?.fullName,
    profile?.specialization,
    profile?.phone,
    profile?.email,
    profile?.profileImage,
    profile?.address,
    profile?.clinicName,
    profile?.licenseNumber,
    profile?.experience,
    profile?.about,
    profile?.consultationFee,
  ];

  return requiredFields.every((value) => {
    if (typeof value === 'string') return value.trim().length > 0;
    return Boolean(value);
  });
};

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const isDoctorUser = user?.role === 'doctor';
  const profileStorageKey = useMemo(
    () => `${PROFILE_STORAGE_KEY}:${user?.id || 'anonymous'}`,
    [user?.id]
  );

  const [profile, setProfile] = useState(defaultDoctorProfile);
  const [loading, setLoading] = useState(false);
  const [completionMeta, setCompletionMeta] = useState({
    isProfileComplete: false,
    completionPercent: 0,
    missingFields: [],
  });

  const normalizeProfile = (raw = {}) => ({
    ...defaultDoctorProfile,
    fullName: raw.fullName || raw.full_name || defaultDoctorProfile.fullName,
    specialization: raw.specialization || defaultDoctorProfile.specialization,
    phone: raw.phone || defaultDoctorProfile.phone,
    email: raw.email || defaultDoctorProfile.email,
    profileImage: raw.profileImage || raw.profile_image || raw.avatar_url || null,
    address: raw.address || '',
    clinicName: raw.clinicName || raw.clinic_name || '',
    licenseNumber: raw.licenseNumber || raw.license_number || '',
    experience: raw.experience || raw.years_experience || '',
    about: raw.about || raw.bio || '',
    consultationFee: raw.consultationFee || raw.consultation_fee || '',
  });

  const refreshProfileFromApi = async () => {
    if (!isDoctorUser) {
      setProfile(defaultDoctorProfile);
      setCompletionMeta({
        isProfileComplete: false,
        completionPercent: 0,
        missingFields: [],
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await doctorApi.getDoctorProfile();
      const data = response?.data || response || {};

      setProfile(normalizeProfile(data));
      setCompletionMeta({
        isProfileComplete: Boolean(data.isProfileComplete ?? data.is_profile_complete),
        completionPercent: Number(data.completionPercent ?? data.completion_percent ?? 0),
        missingFields: data.missingFields || data.missing_fields || [],
      });
    } catch {
      // Avoid showing previous account data when request fails.
      setProfile(defaultDoctorProfile);
      setCompletionMeta({
        isProfileComplete: false,
        completionPercent: 0,
        missingFields: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isDoctorUser) {
      setProfile(defaultDoctorProfile);
      setCompletionMeta({
        isProfileComplete: false,
        completionPercent: 0,
        missingFields: [],
      });
      setLoading(false);
      return;
    }

    const saved = localStorage.getItem(profileStorageKey);

    if (!saved) {
      setProfile(defaultDoctorProfile);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setProfile({ ...defaultDoctorProfile, ...parsed });
    } catch {
      setProfile(defaultDoctorProfile);
    }
  }, [isDoctorUser, profileStorageKey]);

  useEffect(() => {
    if (!user?.id || !isDoctorUser) {
      setProfile(defaultDoctorProfile);
      setCompletionMeta({
        isProfileComplete: false,
        completionPercent: 0,
        missingFields: [],
      });
      setLoading(false);
      return;
    }

    refreshProfileFromApi();
  }, [isDoctorUser, user?.id]);

  useEffect(() => {
    if (!isDoctorUser) return;
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  }, [isDoctorUser, profile, profileStorageKey]);

  const isProfileComplete = useMemo(() => {
    if (completionMeta.completionPercent > 0 || completionMeta.missingFields.length > 0) {
      return completionMeta.isProfileComplete;
    }
    return isDoctorProfileCompleteInternal(profile);
  }, [completionMeta, profile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isProfileComplete,
        completionMeta,
        refreshProfileFromApi,
        loading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}

export { isDoctorProfileCompleteInternal };