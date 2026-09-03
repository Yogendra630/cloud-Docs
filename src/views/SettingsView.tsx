import React, { useState, useRef, useEffect } from 'react';
import {
  User as UserIcon,
  Lock,
  Check,
  AlertCircle,
  Server,
  Camera,
  UploadCloud,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Bell,
  Sliders,
  Shield,
  HardDrive,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatBytes } from '../utils/formatters';

const PRESET_AVATAR_STYLES = [
  { name: 'Modern Tech', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=TechLead' },
  { name: 'Professional 1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&mouth=smile' },
  { name: 'Professional 2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&clothing=blazerAndShirt' },
  { name: 'Minimalist', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Morgan' },
  { name: 'Creative', url: 'https://api.dicebear.com/7.x/micah/svg?seed=Jordan' },
  { name: 'Architect', url: 'https://api.dicebear.com/7.x/personas/svg?seed=Taylor' },
];

export const SettingsView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [title, setTitle] = useState(user?.title || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Preferences States ("Other options")
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences?.emailNotifications ?? true
  );
  const [activityAlerts, setActivityAlerts] = useState(
    user?.preferences?.activityAlerts ?? true
  );
  const [autoThumbnail, setAutoThumbnail] = useState(
    user?.preferences?.autoThumbnail ?? true
  );
  const [defaultSharePermission, setDefaultSharePermission] = useState<'VIEWER' | 'EDITOR'>(
    user?.preferences?.defaultSharePermission || 'VIEWER'
  );
  const [defaultSort, setDefaultSort] = useState(
    user?.preferences?.defaultSort || 'date_desc'
  );

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Status & Feedback States
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);
  const [prefError, setPrefError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  // Sync state if user changes in context
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setDepartment(user.department || '');
      setTitle(user.title || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      if (user.preferences) {
        setEmailNotifications(user.preferences.emailNotifications ?? true);
        setActivityAlerts(user.preferences.activityAlerts ?? true);
        setAutoThumbnail(user.preferences.autoThumbnail ?? true);
        setDefaultSharePermission(user.preferences.defaultSharePermission || 'VIEWER');
        setDefaultSort(user.preferences.defaultSort || 'date_desc');
      }
    }
  }, [user]);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Photo exceeds 5MB size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setAvatar(dataUrl);
        setProfileError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset to default Dicebear avatar based on name
  const handleResetAvatar = () => {
    const defaultUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'User')}`;
    setAvatar(defaultUrl);
  };

  // Save Profile Details
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    if (!name.trim()) {
      setProfileError('Full Name is required.');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        department: department.trim(),
        title: title.trim(),
        avatar,
        phone: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
      });
      setProfileSuccess('Profile and photo updated successfully!');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Save Workspace & Account Preferences
  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefError(null);
    setPrefSuccess(null);
    setIsSavingPrefs(true);

    try {
      await updateProfile({
        preferences: {
          emailNotifications,
          activityAlerts,
          autoThumbnail,
          defaultSharePermission,
          defaultSort,
        },
      });
      setPrefSuccess('Workspace preferences saved successfully!');
      setTimeout(() => setPrefSuccess(null), 4000);
    } catch (err: any) {
      setPrefError(err.message || 'Failed to save preferences.');
    } finally {
      setIsSavingPrefs(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPassword) {
      setPassError('Please enter your current password.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPassSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(null), 4000);
    } catch (err: any) {
      setPassError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const storageUsed = user?.storageUsedBytes || 0;
  const storageTotal = user?.storageQuotaBytes || 5 * 1024 * 1024 * 1024;
  const storagePercent = Math.min(100, Math.round((storageUsed / storageTotal) * 100));

  return (
    <div id="settings-view" className="max-w-4xl space-y-8 pb-16">
      {/* View Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
          Account Settings & Profile
        </h1>
        <p className="text-xs text-[#7B806F] dark:text-[#8E9484] mt-1">
          Customize your photo, personal & professional details, security credentials, and app preferences.
        </p>
      </div>

      {/* 1. Profile Information & Photo Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EBE7DC] dark:border-[#2F342B]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#EEF3ED] dark:bg-[#283226] text-[#556855] dark:text-[#A7C2A4]">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                Personal Profile & Photo
              </h3>
              <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                This information is shown to collaborators across documents and shared workspaces
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[10px] font-semibold bg-[#FAF9F5] dark:bg-[#292D25] text-[#556855] dark:text-[#889E86] border border-[#E2DEC9] dark:border-[#383E33] rounded-full">
            {user?.role === 'ADMIN' ? 'Enterprise Admin' : 'Standard Member'}
          </span>
        </div>

        {profileSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-medium">{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{profileError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* Avatar Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#282C24] border border-[#EBE7DC] dark:border-[#33382D] space-y-4">
            <label className="block text-xs font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              Profile Photo & Avatar
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Current Avatar Display */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <img
                    src={avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
                    alt="Profile Avatar"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-[#E5E1D5] dark:bg-[#33382D] border-2 border-white dark:border-[#222520] shadow-md transition group-hover:opacity-90"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change Photo"
                    className="absolute -bottom-1.5 -right-1.5 p-2 bg-[#556855] hover:bg-[#445544] text-white rounded-xl shadow-md transition active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                    {name || 'Your Name'}
                  </h4>
                  <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                    Upload a custom JPG, PNG, or WEBP photo (max 5MB), or pick a preset style below.
                  </p>
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FFFFFF] dark:bg-[#222520] hover:bg-[#F3F1EA] dark:hover:bg-[#31372C] border border-[#DCD8C8] dark:border-[#3D4435] text-[#3A3A32] dark:text-[#EDEBE4] text-[11px] font-semibold rounded-lg transition"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                      <span>Upload Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAvatar}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-transparent hover:bg-[#EFECE3] dark:hover:bg-[#31372C] text-[#7B806F] dark:text-[#8E9484] hover:text-[#3A3A32] dark:hover:text-[#EDEBE4] text-[11px] font-medium rounded-lg transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Style</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Preset Avatars Selector */}
            <div className="pt-2 border-t border-[#EBE7DC] dark:border-[#33382D]">
              <p className="text-[11px] font-semibold text-[#6B705C] dark:text-[#9DA393] mb-2 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#B5825D] dark:text-[#DDA15E]" />
                <span>Or pick from preset avatar styles:</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATAR_STYLES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setAvatar(preset.url)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center space-y-1.5 ${
                      avatar === preset.url
                        ? 'border-[#556855] bg-[#EEF3ED] dark:bg-[#283226] text-[#3A3A32] dark:text-[#EDEBE4]'
                        : 'border-[#E2DEC9] dark:border-[#383E33] bg-[#FFFFFF] dark:bg-[#222520] hover:bg-[#F3F1EA] dark:hover:bg-[#2E332A] text-[#7B806F] dark:text-[#8E9484]'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-10 h-10 rounded-lg object-cover bg-[#E5E1D5] dark:bg-[#2F342B]"
                    />
                    <span className="text-[10px] font-medium truncate w-full">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Yogendra Pratap"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Email Address (Primary Account)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-[#F3F1EA] dark:bg-[#2A2E27] border border-[#E5E2D9] dark:border-[#2F342B] rounded-xl text-[#8C907F] dark:text-[#787D70] cursor-not-allowed"
                />
                <span className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[9px] font-bold bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] rounded">
                  Verified
                </span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Department / Faculty</span>
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Designation / Role Title</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Principal Cloud Architect & Lead"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Phone / Contact Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 438-9201"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
                <span>Office Location / City</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Tech Park West, Building 4 • San Francisco"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition"
              />
            </div>
          </div>

          {/* Bio Textarea */}
          <div className="text-xs">
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-semibold text-[#4B4F42] dark:text-[#D1D4CA]">
                About / Professional Summary
              </label>
              <span className="text-[10px] text-[#8C907F] dark:text-[#787D70]">
                {bio.length}/300 characters
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={300}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief summary about your research interests, team responsibilities, or document management roles..."
              className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] transition resize-none leading-relaxed"
            />
          </div>

          {/* Submit Profile Changes */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#556855] hover:bg-[#455545] active:scale-98 text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {isSavingProfile && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Workspace & App Preferences ("Other Options") Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-[#EBE7DC] dark:border-[#2F342B]">
          <div className="p-2 rounded-xl bg-[#F7F2E8] dark:bg-[#2F2C24] text-[#B5825D] dark:text-[#DDA15E]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              Workspace Preferences & Options
            </h3>
            <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
              Configure default document behavior, alerts, and notifications
            </p>
          </div>
        </div>

        {prefSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-medium">{prefSuccess}</span>
          </div>
        )}

        {prefError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{prefError}</span>
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="space-y-5 text-xs">
          {/* Notification Toggles */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2">
              <Bell className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
              <span>Notification Settings</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#FAF9F5] dark:bg-[#282C24] border border-[#EBE7DC] dark:border-[#383E33] cursor-pointer hover:bg-[#F3F1EA] dark:hover:bg-[#2E332A] transition">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="mt-0.5 rounded text-[#556855] focus:ring-[#556855] w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">Email Notifications</p>
                  <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                    Receive emails when collaborators share files or update versions
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#FAF9F5] dark:bg-[#282C24] border border-[#EBE7DC] dark:border-[#383E33] cursor-pointer hover:bg-[#F3F1EA] dark:hover:bg-[#2E332A] transition">
                <input
                  type="checkbox"
                  checked={activityAlerts}
                  onChange={(e) => setActivityAlerts(e.target.checked)}
                  className="mt-0.5 rounded text-[#556855] focus:ring-[#556855] w-4 h-4"
                />
                <div>
                  <p className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">In-App Activity Alerts</p>
                  <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                    Display instant popover alerts for document downloads & comments
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Document & Sharing Options */}
          <div className="pt-3 border-t border-[#EBE7DC] dark:border-[#2F342B] space-y-3">
            <h4 className="font-bold text-[#3A3A32] dark:text-[#EDEBE4] flex items-center space-x-2">
              <FileCheck className="w-3.5 h-3.5 text-[#556855] dark:text-[#889E86]" />
              <span>Document Defaults</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                  Default Sharing Role
                </label>
                <select
                  value={defaultSharePermission}
                  onChange={(e) => setDefaultSharePermission(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                >
                  <option value="VIEWER">Viewer (Read & Download only)</option>
                  <option value="EDITOR">Editor (Can upload revisions & rename)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1">
                  Default File Sorting
                </label>
                <select
                  value={defaultSort}
                  onChange={(e) => setDefaultSort(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
                >
                  <option value="date_desc">Last Modified (Newest First)</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="name_asc">Name (A to Z)</option>
                  <option value="name_desc">Name (Z to A)</option>
                  <option value="size_desc">File Size (Largest First)</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[#FAF9F5] dark:bg-[#282C24] border border-[#EBE7DC] dark:border-[#383E33] cursor-pointer w-full mt-5">
                  <input
                    type="checkbox"
                    checked={autoThumbnail}
                    onChange={(e) => setAutoThumbnail(e.target.checked)}
                    className="rounded text-[#556855] focus:ring-[#556855] w-4 h-4"
                  />
                  <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">
                    Auto-generate previews
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPrefs}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#4B5A4B] hover:bg-[#3D4A3D] text-white font-semibold text-xs rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {isSavingPrefs && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSavingPrefs ? 'Saving...' : 'Save Workspace Preferences'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Security & Password Update Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-[#EBE7DC] dark:border-[#2F342B]">
          <div className="p-2 rounded-xl bg-[#F4EFF7] dark:bg-[#2B2330] text-[#6F4E85] dark:text-[#C5A3DE]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
              Security & Password
            </h3>
            <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
              Ensure your account is protected with a secure PBKDF2 salted credential
            </p>
          </div>
        </div>

        {passSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-medium">{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FAF0ED] dark:bg-[#341F1B] text-[#B84A39] dark:text-[#E88C7D] text-xs flex items-center space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-2.5 text-[#8C907F] hover:text-[#3A3A32] dark:hover:text-[#EDEBE4]"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-2.5 text-[#8C907F] hover:text-[#3A3A32] dark:hover:text-[#EDEBE4]"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#4B4F42] dark:text-[#D1D4CA] mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-[#FDFCFA] dark:bg-[#282C24] border border-[#E2DEC9] dark:border-[#383E33] rounded-xl outline-hidden focus:border-[#556855] text-[#3A3A32] dark:text-[#EDEBE4]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#556855] hover:bg-[#455545] text-white font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {isChangingPass && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isChangingPass ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Storage Quota & AWS S3 Connection Info */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] dark:bg-[#222520] border border-[#E5E2D9] dark:border-[#2F342B] shadow-2xs">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#EBE7DC] dark:border-[#2F342B]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#3A3A32] dark:text-[#EDEBE4]">
                Assigned Storage & AWS S3 Infrastructure
              </h3>
              <p className="text-[11px] text-[#7B806F] dark:text-[#8E9484]">
                Enterprise storage quota connected to AWS S3 bucket and MySQL metadata catalog
              </p>
            </div>
          </div>
        </div>

        {/* Quota Progress Meter */}
        <div className="mb-6 p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#282C24] border border-[#EBE7DC] dark:border-[#383E33]">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-[#3A3A32] dark:text-[#EDEBE4]">Account Storage Usage</span>
            <span className="font-mono text-[#556855] dark:text-[#889E86] font-semibold">
              {formatBytes(storageUsed)} / {formatBytes(storageTotal)} ({storagePercent}%)
            </span>
          </div>
          <div className="w-full bg-[#E5E1D5] dark:bg-[#383E33] rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                storagePercent > 90
                  ? 'bg-[#B84A39]'
                  : storagePercent > 70
                  ? 'bg-[#B5825D]'
                  : 'bg-[#556855]'
              }`}
              style={{ width: `${Math.max(2, storagePercent)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E1D5] dark:border-[#353A2F] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">Target S3 Bucket:</span>
              <span className="font-mono font-bold text-[#3A3A32] dark:text-[#EDEBE4]">clouddocs-storage</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">AWS Region:</span>
              <span className="font-mono text-[#3A3A32] dark:text-[#EDEBE4]">us-east-1 (N. Virginia)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">Encryption Scheme:</span>
              <span className="px-2 py-0.5 bg-[#EEF4EC] dark:bg-[#202E1E] text-[#47703D] dark:text-[#8DBB81] rounded font-semibold text-[10px]">
                SSE-S3 AES-256
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F4EE] dark:bg-[#292D25] border border-[#E5E1D5] dark:border-[#353A2F] space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">Database Engine:</span>
              <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">MySQL 8.0 / InnoDB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">Authentication Protocol:</span>
              <span className="font-semibold text-[#3A3A32] dark:text-[#EDEBE4]">JWT Bearer (HS256)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7B806F] dark:text-[#8E9484]">Current User Role:</span>
              <span className="font-bold text-[#556855] dark:text-[#889E86]">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
