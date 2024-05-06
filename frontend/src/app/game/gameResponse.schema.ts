import { Game } from '../game/game.schema';
import { Console } from '../console/console.schema';
import { Company } from '../company/company.schema';
export interface GameResponse {
    game: Game,
    consoles: Console[],
    companies: Company[]
  }
  