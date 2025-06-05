import React, { FC, useState } from 'react';
import { UserRole } from '../types';
import { UserPlusIcon, UserMinusIcon } from './icons';

interface BoardMembersProps {
  members: { id: string; email: string; role: UserRole }[];
  onAddMember: (email: string, role: UserRole) => void;
  onRemoveMember: (memberId: string) => void;
  currentUserRole: UserRole;
}

const BoardMembers: FC<BoardMembersProps> = ({
  members,
  onAddMember,
  onRemoveMember,
  currentUserRole,
}) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('member');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberEmail.trim()) {
      onAddMember(newMemberEmail.trim(), newMemberRole);
      setNewMemberEmail('');
      setNewMemberRole('member');
    }
  };

  const canManageMembers = currentUserRole === 'admin' || currentUserRole === 'owner';

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Board Members</h2>

      {canManageMembers && (
        <form onSubmit={handleAddMember} className="mb-6">
          <div className="flex gap-4">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value as UserRole)}
              className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
            >
              <UserPlusIcon className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between bg-slate-700 p-3 rounded-lg"
          >
            <div>
              <span className="text-white">{member.email}</span>
              <span className="ml-2 text-sm text-slate-300">({member.role})</span>
            </div>
            {canManageMembers && member.role !== 'owner' && (
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                <UserMinusIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardMembers; 