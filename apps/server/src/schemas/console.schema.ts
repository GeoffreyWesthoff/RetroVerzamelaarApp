import {Node, NodeKey, NotNull, Unique } from "@nhogs/nestjs-neo4j";
@Node({label: 'Console'})
export class Console {
  @Unique()
  @NodeKey()
  id: string

  @NotNull()
  name: string;

  @NotNull()
  release_date: Date;

  @NotNull()
  market_price: number;

  @NotNull()
  image_url: string;

  @NotNull()
  max_controllers: number;

  @NotNull()
  online_capable: boolean;
}

