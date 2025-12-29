import React, { useState, useEffect } from 'react';
import { api } from '../api/endpoints';
import Button from '../design-system/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../design-system/atoms/Card';
import { User, Lock, Key, Mail, Shield, Save } from 'lucide-react';
import Toast from '../components/Toast';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    Username: '',
    DisplayName: '',
    Role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [displayName, setDisplayName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [toast, setToast] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.auth.getProfile();
      if (res) {
        setProfile(res);
        setDisplayName(res.DisplayName);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Failed to load profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.auth.updateProfile({ displayName });
      if (res.success) {
        setToast({ message: 'Profile updated successfully', type: 'success' });
        fetchProfile();
      } else {
        setToast({ message: res.message || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Update failed', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    
    setSaving(true);
    try {
      const res = await api.auth.updateProfile({ 
        password: currentPassword, 
        newPassword 
      });
      
      if (res.success) {
        setToast({ message: 'Password changed successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setToast({ message: res.message || 'Change failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to change password. check current password.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shadow-inner">
           <User size={32} />
        </div>
        <div>
           <h1 className="text-2xl font-bold text-slate-900">{profile.DisplayName}</h1>
           <div className="flex items-center gap-2 text-slate-500 text-sm">
             <Shield size={14} className="text-emerald-600" />
             <span className="capitalize">{profile.Role} Account</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <Card className="h-fit">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg">
                <User size={20} className="text-blue-600" />
                Personal Information
             </CardTitle>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Username</label>
                    <div className="relative">
                       <Mail className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                       <input 
                         className="flex h-10 w-full rounded-md border border-input bg-slate-50 px-3 py-2 pl-9 text-sm text-slate-500 cursor-not-allowed"
                         value={profile.Username}
                         disabled
                       />
                       <p className="text-xs text-slate-400 mt-1">Username cannot be changed.</p>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Display Name</label>
                    <input 
                       className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus:ring-2 focus:ring-blue-500"
                       value={displayName}
                       onChange={(e) => setDisplayName(e.target.value)}
                       placeholder="Enter display name"
                    />
                 </div>

                 <Button type="submit" disabled={saving || displayName === profile.DisplayName} className="w-full">
                    {saving ? 'Saving...' : 'Update Info'}
                 </Button>
              </form>
           </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="h-fit">
            <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg">
                <Lock size={20} className="text-rose-600" />
                Security Settings
             </CardTitle>
           </CardHeader>
           <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Password</label>
                    <div className="relative">
                       <Key className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                       <input 
                         type="password"
                         className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 pl-9 text-sm focus-visible:outline-none focus:ring-2 focus:ring-rose-500"
                         value={currentPassword}
                         onChange={(e) => setCurrentPassword(e.target.value)}
                         placeholder="Enter current password"
                         required
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">New Password</label>
                        <input 
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus:ring-2 focus:ring-rose-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Confirm</label>
                        <input 
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus:ring-2 focus:ring-rose-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Same as new"
                            required
                        />
                    </div>
                 </div>

                 <Button variant="destructive" type="submit" disabled={saving || !currentPassword || !newPassword} className="w-full">
                    {saving ? 'Processing...' : 'Change Password'}
                 </Button>
              </form>
           </CardContent>
        </Card>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ProfilePage;
