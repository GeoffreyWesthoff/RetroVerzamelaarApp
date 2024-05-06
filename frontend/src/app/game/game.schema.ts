export interface Game {
    id: string;
    name: string;
    release_date: Date;
    market_price: number;
    image_url: string;
    online_support: boolean;
    max_players: number;
    region: string;
    rating: number;
    genre: string;
    released_on: string[]
    developed_by: string[]
  }
  