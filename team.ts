export interface TeamMember {
    id: string;
    name: string;
    avatar: string; // URL or initials
    color: string; // Tailwind color class for progress bars
}

export const TEAM_MEMBERS: TeamMember[] = [
    { id: 'member-1', name: 'Jeeta', avatar: 'J', color: 'bg-blue-500' },
    { id: 'member-2', name: 'Jigyas', avatar: 'Ji', color: 'bg-emerald-500' },
    { id: 'member-3', name: 'Kamal', avatar: 'K', color: 'bg-purple-500' },
    { id: 'member-4', name: 'Pradhumna', avatar: 'P', color: 'bg-orange-500' },
];

export const PIN_CODE = "8848";
