import { Node, NodeKey, NotNull, Relationship } from "@nhogs/nestjs-neo4j";
import * as crypto from "crypto";

@Node({label: "Game"})
export class CreateGameDto {

  constructor(body: any){
    this.id = body.id;
    this.name = body.name;
    this.release_date = body.release_date;
    this.market_price = body.market_price;
    this.image_url = body.image_url;
    this.rating = body.rating;
    this.max_players = body.max_players;
    this.online_support = body.online_support;
    this.region = body.region;
    this.genre = body.genre;
  }  

  @NodeKey()
  id: string = crypto.randomBytes(64).toString('hex');

  @NotNull()
  readonly name: string;

  @NotNull()
  readonly release_date: Date;
  @NotNull()
  readonly market_price: number;
  @NotNull()
  readonly image_url: string;
  @NotNull()
  readonly rating: number;
  @NotNull()
  readonly region: string;
  @NotNull()
  readonly max_players: number;
  @NotNull()
  readonly online_support: boolean;
  @NotNull()
  readonly genre: string;

 
}

@Relationship({ type: 'RELEASED_ON' })
export class ReleasedOnDto {
  @NotNull()
  since: Date;
}
