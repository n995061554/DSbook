import React, { useState } from 'react';
import { XMarkIcon, UserPlusIcon } from '../icons';

interface InviteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInviteUser: (user: { name: string; email: string; role: string; }) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ isOpen, onClose, onInviteUser }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Viewer');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim()) {
            onInviteUser({ name, email, role });
            setName('');
            setEmail('');
            setRole('Viewer');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark flex items-center">
                        <UserPlusIcon className="w-7 h-7 mr-3 text-brand-primary" />
                        Invite New User
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="user-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="user-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary"
                                required
                            />
                        </div>
                        <div>
                             <label htmlFor="user-role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select 
                                id="user-role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary bg-white"
                            >
                                <option value="Administrator">Administrator</option>
                                <option value="Accountant">Accountant</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-primary transition-colors">
                            Send Invite
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteUserModal;