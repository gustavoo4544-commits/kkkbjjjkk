import { Team } from '@/types/user';

export interface TeamWithGroup extends Team {
  group: string;
}

export const allTeams: TeamWithGroup[] = [
  // Grupo A
  { id: '1', name: 'Catar', flag: '🇶🇦', popularity: 5.2, totalBet: 12000, bettors: 320, estimatedPrize: 8000, group: 'A' },
  { id: '2', name: 'Equador', flag: '🇪🇨', popularity: 5.8, totalBet: 18000, bettors: 480, estimatedPrize: 12000, group: 'A' },
  { id: '3', name: 'Senegal', flag: '🇸🇳', popularity: 6.1, totalBet: 22000, bettors: 540, estimatedPrize: 14000, group: 'A' },
  { id: '4', name: 'Holanda', flag: '🇳🇱', popularity: 7.2, totalBet: 58000, bettors: 1380, estimatedPrize: 27000, group: 'A' },

  // Grupo B
  { id: '5', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', popularity: 7.9, totalBet: 72000, bettors: 1870, estimatedPrize: 33000, group: 'B' },
  { id: '6', name: 'Irã', flag: '🇮🇷', popularity: 5.0, totalBet: 10000, bettors: 280, estimatedPrize: 7000, group: 'B' },
  { id: '7', name: 'Estados Unidos', flag: '🇺🇸', popularity: 6.5, totalBet: 35000, bettors: 890, estimatedPrize: 18000, group: 'B' },
  { id: '8', name: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', popularity: 5.5, totalBet: 15000, bettors: 390, estimatedPrize: 10000, group: 'B' },

  // Grupo C
  { id: '9', name: 'Argentina', flag: '🇦🇷', popularity: 8.8, totalBet: 98000, bettors: 2890, estimatedPrize: 42000, group: 'C' },
  { id: '10', name: 'Arábia Saudita', flag: '🇸🇦', popularity: 4.8, totalBet: 8000, bettors: 220, estimatedPrize: 6000, group: 'C' },
  { id: '11', name: 'México', flag: '🇲🇽', popularity: 6.3, totalBet: 28000, bettors: 720, estimatedPrize: 16000, group: 'C' },
  { id: '12', name: 'Polônia', flag: '🇵🇱', popularity: 6.0, totalBet: 24000, bettors: 580, estimatedPrize: 15000, group: 'C' },

  // Grupo D
  { id: '13', name: 'França', flag: '🇫🇷', popularity: 8.5, totalBet: 87000, bettors: 2340, estimatedPrize: 38000, group: 'D' },
  { id: '14', name: 'Austrália', flag: '🇦🇺', popularity: 5.3, totalBet: 14000, bettors: 350, estimatedPrize: 9000, group: 'D' },
  { id: '15', name: 'Dinamarca', flag: '🇩🇰', popularity: 6.4, totalBet: 30000, bettors: 780, estimatedPrize: 17000, group: 'D' },
  { id: '16', name: 'Tunísia', flag: '🇹🇳', popularity: 5.1, totalBet: 11000, bettors: 300, estimatedPrize: 7500, group: 'D' },

  // Grupo E
  { id: '17', name: 'Espanha', flag: '🇪🇸', popularity: 7.7, totalBet: 68000, bettors: 1650, estimatedPrize: 31000, group: 'E' },
  { id: '18', name: 'Costa Rica', flag: '🇨🇷', popularity: 4.9, totalBet: 9000, bettors: 250, estimatedPrize: 6500, group: 'E' },
  { id: '19', name: 'Alemanha', flag: '🇩🇪', popularity: 8.1, totalBet: 76000, bettors: 1980, estimatedPrize: 35000, group: 'E' },
  { id: '20', name: 'Japão', flag: '🇯🇵', popularity: 6.2, totalBet: 26000, bettors: 650, estimatedPrize: 15500, group: 'E' },

  // Grupo F
  { id: '21', name: 'Bélgica', flag: '🇧🇪', popularity: 7.4, totalBet: 62000, bettors: 1480, estimatedPrize: 29000, group: 'F' },
  { id: '22', name: 'Canadá', flag: '🇨🇦', popularity: 5.6, totalBet: 16000, bettors: 420, estimatedPrize: 11000, group: 'F' },
  { id: '23', name: 'Marrocos', flag: '🇲🇦', popularity: 6.6, totalBet: 38000, bettors: 920, estimatedPrize: 19000, group: 'F' },
  { id: '24', name: 'Croácia', flag: '🇭🇷', popularity: 7.0, totalBet: 52000, bettors: 1250, estimatedPrize: 25000, group: 'F' },

  // Grupo G
  { id: '25', name: 'Brasil', flag: '🇧🇷', popularity: 9.2, totalBet: 125000, bettors: 3420, estimatedPrize: 50000, group: 'G' },
  { id: '26', name: 'Sérvia', flag: '🇷🇸', popularity: 5.7, totalBet: 17000, bettors: 440, estimatedPrize: 11500, group: 'G' },
  { id: '27', name: 'Suíça', flag: '🇨🇭', popularity: 6.1, totalBet: 23000, bettors: 560, estimatedPrize: 14500, group: 'G' },
  { id: '28', name: 'Camarões', flag: '🇨🇲', popularity: 5.4, totalBet: 14500, bettors: 370, estimatedPrize: 9500, group: 'G' },

  // Grupo H
  { id: '29', name: 'Portugal', flag: '🇵🇹', popularity: 7.5, totalBet: 64000, bettors: 1520, estimatedPrize: 29000, group: 'H' },
  { id: '30', name: 'Gana', flag: '🇬🇭', popularity: 5.5, totalBet: 15500, bettors: 400, estimatedPrize: 10500, group: 'H' },
  { id: '31', name: 'Uruguai', flag: '🇺🇾', popularity: 6.8, totalBet: 45000, bettors: 1100, estimatedPrize: 22000, group: 'H' },
  { id: '32', name: 'Coreia do Sul', flag: '🇰🇷', popularity: 6.0, totalBet: 25000, bettors: 600, estimatedPrize: 15000, group: 'H' },
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
