import { Team } from '@/types/user';

interface TeamCardProps {
  team: Team;
  onClick: () => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-3d rounded-xl p-4 text-left w-full transition-all duration-300"
    >
      <div className="text-3xl mb-2">{team.flag}</div>
      <h3 className="font-semibold text-foreground text-sm mb-1">{team.name}</h3>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">Popularidade:</span>
        <span className="text-xs font-bold text-primary">{team.popularity.toFixed(1)}</span>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {team.bettors} apostadores
      </div>
    </button>
  );
}
