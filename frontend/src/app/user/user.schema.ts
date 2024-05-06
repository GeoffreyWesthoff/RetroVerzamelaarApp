import { Game } from "../game/game.schema";
import { Console } from "../console/console.schema";

export interface UserResponse {
    _id: string,
    user: User;

    consoles: Console[];
    games: Game[];
    recommendations: Game[];
    
  }

  export interface User {
    username: string, 
    owned_consoles: Collectable[];
    owned_games: Collectable[];
    admin: boolean;
  }
  
  export interface Collectable {
    id: string;
    region: string;
    condition: string;
    purchase_price: number;
    for_console?: string;
    nonce: string;
  }