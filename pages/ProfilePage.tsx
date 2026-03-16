
import React, { useState } from 'react';
import { Page } from '../types';
import ToggleSwitch from '../components/ToggleSwitch';
import AddCompanyModal from '../components/modals/AddCompanyModal';
import InviteUserModal from '../components/modals/InviteUserModal';
import { 
    EnvelopeIcon, 
    BuildingOfficeIcon, 
    PencilIcon, 
    WalletIcon,
    PlusIcon,
    PhoneIcon,
    ChatBubbleLeftEllipsisIcon,
} from '../components/icons';
import { formatCurrency } from '../utils/formatters';
import { useCurrency } from '../contexts/CurrencyContext';
import { useCompany } from '../contexts/CompanyContext';
import { Company } from '../types';

interface ProfilePageProps {
    onNavigate: (page: Page) => void;
}

interface User {
    name: string;
    email: string;
    role: string;
    avatar: string;
}

const mockUsersData: User[] = [
    { name: 'Priya Verma', email: 'priya.v@innovate.co.in', role: 'Accountant', avatar: 'https://picsum.photos/seed/user2/40/40' },
    { name: 'Ankit Sharma', email: 'ankit.s@innovate.co.in', role: 'Viewer', avatar: 'https://picsum.photos/seed/user3/40/40' },
];

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
    const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);

    const { currencyCode } = useCurrency();
    const { availableCompanies, addCompany } = useCompany();

    const [profile, setProfile] = useState({
        name: 'Sunil Patel',
        email: 'sunil.patel@innovate.co.in',
        company: 'Innovate Solutions Pvt. Ltd.',
        role: 'Administrator',
        phone: '9876543210',
        whatsappUpdates: true,
    });
    
    const [editableProfile, setEditableProfile] = useState(profile);
    const [users, setUsers] = useState<User[]>(mockUsersData);

    const handleEditToggle = () => {
        if (isEditing) {
            setEditableProfile(profile);
        }
        setIsEditing(!isEditing);
    };
    
    const handleSaveChanges = () => {
        setProfile(editableProfile);
        console.log('Saving profile:', {
            profile: editableProfile,
        });
        alert('Profile changes saved successfully!');
        setIsEditing(false);
    };

    const handleProfileChange = (field: keyof typeof editableProfile, value: string | boolean) => {
        setEditableProfile(prev => ({...prev, [field]: value }));
    };

    const handleAddCompany = (newCompanyData: Omit<Company, 'id'>) => {
        addCompany(newCompanyData);
        setIsAddCompanyModalOpen(false);
    };
    
    const handleInviteUser = (newUser: Omit<User, 'avatar'>) => {
        const avatar = `https://picsum.photos/seed/${newUser.email}/40/40`;
        setUsers(prev => [...prev, {...newUser, avatar}]);
        setIsInviteUserModalOpen(false);
    };

    return (
        <>
            <div className="p-6 md:p-8 bg-brand-light">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-brand-dark mb-8">Profile & Settings</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Companies Card */}
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-brand-dark">Manage Companies</h2>
                                    <button onClick={() => setIsAddCompanyModalOpen(true)} className="flex items-center bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors text-sm">
                                        <PlusIcon className="w-4 h-4 mr-2"/>
                                        Add Company
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {availableCompanies.map(company => (
                                        <div key={company.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <p className="font-medium text-brand-dark">{company.name}</p>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{company.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Users Card */}
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-brand-dark">Manage Users</h2>
                                    <button onClick={() => setIsInviteUserModalOpen(true)} className="flex items-center bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors text-sm">
                                        <PlusIcon className="w-4 h-4 mr-2"/>
                                        Invite User
                                    </button>
                                </div>
                                 <div className="space-y-3">
                                    {users.map(user => (
                                        <div key={user.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4"/>
                                                <div>
                                                    <p className="font-semibold text-brand-dark">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">{user.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* User Profile Card */}
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex flex-col items-center text-center">
                                    <img 
                                        src="https://picsum.photos/seed/user/100/100" 
                                        alt="User Avatar" 
                                        className="h-24 w-24 rounded-full object-cover border-4 border-brand-secondary shadow-md mb-4"
                                    />
                                    {!isEditing ? (
                                        <>
                                            <h2 className="text-2xl font-bold text-brand-dark">{profile.name}</h2>
                                            <p className="text-gray-500">{profile.role}</p>
                                            <div className="mt-3 space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center"><EnvelopeIcon className="w-5 h-5 mr-2 text-gray-400"/><span>{profile.email}</span></div>
                                                <div className="flex items-center"><PhoneIcon className="w-5 h-5 mr-2 text-gray-400"/><span>+91 {profile.phone}</span></div>
                                                <div className="flex items-center"><BuildingOfficeIcon className="w-5 h-5 mr-2 text-gray-400"/><span>{profile.company}</span></div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full space-y-4 text-left">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                                <input type="text" value={editableProfile.name} onChange={e => handleProfileChange('name', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"/>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                                <input type="email" value={editableProfile.email} onChange={e => handleProfileChange('email', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"/>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                                <input type="tel" value={editableProfile.phone} onChange={e => handleProfileChange('phone', e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"/>
                                            </div>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex items-center">
                                                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5 mr-2 text-gray-400" />
                                                    <span className="text-sm text-gray-700">Get business updates on WhatsApp</span>
                                                </div>
                                                <ToggleSwitch enabled={editableProfile.whatsappUpdates} onChange={checked => handleProfileChange('whatsappUpdates', checked)} />
                                            </div>
                                        </div>
                                    )}
                                    <div className="w-full mt-4 space-y-2">
                                        <button 
                                            onClick={handleEditToggle}
                                            className="w-full flex items-center justify-center bg-gray-100 text-brand-dark font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4 mr-2" />
                                            {isEditing ? 'Cancel' : 'Edit Profile'}
                                        </button>
                                        {isEditing && (
                                            <button 
                                                onClick={handleSaveChanges}
                                                className="w-full flex items-center justify-center bg-brand-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Wallet Balance Card */}
                            <div className="bg-brand-dark p-6 rounded-xl shadow-lg text-white">
                                 <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-semibold">Wallet Balance</h3>
                                    <WalletIcon className="w-6 h-6 text-brand-secondary"/>
                                 </div>
                                 <p className="text-4xl font-bold">{formatCurrency(12530, currencyCode)}</p>
                                 <p className="text-sm text-gray-400 mt-1">Available for AI Calls & Actions</p>
                                 <button className="w-full mt-4 bg-brand-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                                    Add Funds
                                 </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <AddCompanyModal 
                isOpen={isAddCompanyModalOpen}
                onClose={() => setIsAddCompanyModalOpen(false)}
                onAddCompany={handleAddCompany}
            />
            <InviteUserModal
                isOpen={isInviteUserModalOpen}
                onClose={() => setIsInviteUserModalOpen(false)}
                onInviteUser={handleInviteUser}
            />
        </>
    );
};

export default ProfilePage;