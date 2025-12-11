import { Team } from '@/types/user';

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      className="team-card-cartoon p-4 text-left w-full"
    >
      <div className="text-4xl mb-3 drop-shadow-lg">{team.flag}</div>
      <h3 className="font-bold text-foreground text-sm mb-1 tracking-wide">{team.name}</h3>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground font-medium">Popularidade:</span>
        <span className="text-xs font-black text-primary">{team.popularity.toFixed(1)}</span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground font-semibold">
        {team.bettors} apostadores
      </div>
    </button>
  );
}
