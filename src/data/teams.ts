import { Team } from '@/types/user';

export interface TeamWithGroup extends Team {
  group: string;
}

export const allTeams: TeamWithGroup[] = [
  // Grupo A - Total ~40 apostadores (proporcional a 325 base)
  { id: '1', name: 'Catar', flag: '🇶🇦', popularity: 5.2, totalBet: 80, bettors: 4, estimatedPrize: 800, group: 'A' },
  { id: '2', name: 'Equador', flag: '🇪🇨', popularity: 5.8, totalBet: 140, bettors: 7, estimatedPrize: 1000, group: 'A' },
  { id: '3', name: 'Senegal', flag: '🇸🇳', popularity: 6.1, totalBet: 200, bettors: 10, estimatedPrize: 1200, group: 'A' },
  { id: '4', name: 'Holanda', flag: '🇳🇱', popularity: 7.2, totalBet: 380, bettors: 19, estimatedPrize: 1800, group: 'A' },

  // Grupo B - Total ~42 apostadores
  { id: '5', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', popularity: 7.9, totalBet: 500, bettors: 25, estimatedPrize: 2200, group: 'B' },
  { id: '6', name: 'Irã', flag: '🇮🇷', popularity: 5.0, totalBet: 60, bettors: 3, estimatedPrize: 600, group: 'B' },
  { id: '7', name: 'Estados Unidos', flag: '🇺🇸', popularity: 6.5, totalBet: 220, bettors: 11, estimatedPrize: 1400, group: 'B' },
  { id: '8', name: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', popularity: 5.5, totalBet: 60, bettors: 3, estimatedPrize: 700, group: 'B' },

  // Grupo C - Total ~52 apostadores
  { id: '9', name: 'Argentina', flag: '🇦🇷', popularity: 8.8, totalBet: 1300, bettors: 65, estimatedPrize: 4200, group: 'C' },
  { id: '10', name: 'Arábia Saudita', flag: '🇸🇦', popularity: 4.8, totalBet: 40, bettors: 2, estimatedPrize: 500, group: 'C' },
  { id: '11', name: 'México', flag: '🇲🇽', popularity: 6.3, totalBet: 180, bettors: 9, estimatedPrize: 1200, group: 'C' },
  { id: '12', name: 'Polônia', flag: '🇵🇱', popularity: 6.0, totalBet: 120, bettors: 6, estimatedPrize: 900, group: 'C' },

  // Grupo D - Total ~45 apostadores
  { id: '13', name: 'França', flag: '🇫🇷', popularity: 8.5, totalBet: 1000, bettors: 50, estimatedPrize: 3800, group: 'D' },
  { id: '14', name: 'Austrália', flag: '🇦🇺', popularity: 5.3, totalBet: 80, bettors: 4, estimatedPrize: 700, group: 'D' },
  { id: '15', name: 'Dinamarca', flag: '🇩🇰', popularity: 6.4, totalBet: 160, bettors: 8, estimatedPrize: 1100, group: 'D' },
  { id: '16', name: 'Tunísia', flag: '🇹🇳', popularity: 5.1, totalBet: 60, bettors: 3, estimatedPrize: 600, group: 'D' },

  // Grupo E - Total ~47 apostadores
  { id: '17', name: 'Espanha', flag: '🇪🇸', popularity: 7.7, totalBet: 700, bettors: 35, estimatedPrize: 3100, group: 'E' },
  { id: '18', name: 'Costa Rica', flag: '🇨🇷', popularity: 4.9, totalBet: 40, bettors: 2, estimatedPrize: 500, group: 'E' },
  { id: '19', name: 'Alemanha', flag: '🇩🇪', popularity: 8.1, totalBet: 800, bettors: 40, estimatedPrize: 3500, group: 'E' },
  { id: '20', name: 'Japão', flag: '🇯🇵', popularity: 6.2, totalBet: 140, bettors: 7, estimatedPrize: 1000, group: 'E' },

  // Grupo F - Total ~40 apostadores
  { id: '21', name: 'Bélgica', flag: '🇧🇪', popularity: 7.4, totalBet: 500, bettors: 25, estimatedPrize: 2500, group: 'F' },
  { id: '22', name: 'Canadá', flag: '🇨🇦', popularity: 5.6, totalBet: 80, bettors: 4, estimatedPrize: 700, group: 'F' },
  { id: '23', name: 'Marrocos', flag: '🇲🇦', popularity: 6.6, totalBet: 200, bettors: 10, estimatedPrize: 1300, group: 'F' },
  { id: '24', name: 'Croácia', flag: '🇭🇷', popularity: 7.0, totalBet: 340, bettors: 17, estimatedPrize: 1800, group: 'F' },

  // Grupo G - Total ~50 apostadores
  { id: '25', name: 'Brasil', flag: '🇧🇷', popularity: 9.2, totalBet: 1700, bettors: 85, estimatedPrize: 5000, group: 'G' },
  { id: '26', name: 'Sérvia', flag: '🇷🇸', popularity: 5.7, totalBet: 100, bettors: 5, estimatedPrize: 800, group: 'G' },
  { id: '27', name: 'Suíça', flag: '🇨🇭', popularity: 6.1, totalBet: 140, bettors: 7, estimatedPrize: 1000, group: 'G' },
  { id: '28', name: 'Camarões', flag: '🇨🇲', popularity: 5.4, totalBet: 80, bettors: 4, estimatedPrize: 700, group: 'G' },

  // Grupo H - Total ~39 apostadores
  { id: '29', name: 'Portugal', flag: '🇵🇹', popularity: 7.5, totalBet: 500, bettors: 25, estimatedPrize: 2500, group: 'H' },
  { id: '30', name: 'Gana', flag: '🇬🇭', popularity: 5.5, totalBet: 80, bettors: 4, estimatedPrize: 700, group: 'H' },
  { id: '31', name: 'Uruguai', flag: '🇺🇾', popularity: 6.8, totalBet: 280, bettors: 14, estimatedPrize: 1600, group: 'H' },
  { id: '32', name: 'Coreia do Sul', flag: '🇰🇷', popularity: 6.0, totalBet: 120, bettors: 6, estimatedPrize: 900, group: 'H' },
];

// Times em destaque para a página inicial (apenas alguns)
export const teams: Team[] = allTeams.slice(0, 8).map(({ group, ...team }) => team);

// Agrupa times por grupo
export const teamsByGroup = allTeams.reduce((acc, team) => {
  if (!acc[team.group]) {
    acc[team.group] = [];
  }
  acc[team.group].push(team);
  return acc;
}, {} as Record<string, TeamWithGroup[]>);
