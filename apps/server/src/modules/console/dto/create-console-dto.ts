import { Node, NodeKey, NotNull } from "@nhogs/nestjs-neo4j";

@Node({label: "Console"})
export class CreateConsoleDto {
  @NodeKey()
  id: string;

  @NotNull()
  readonly name: string;

  @NotNull()
  readonly release_date: Date;
  @NotNull()
  readonly market_price: number;
  @NotNull()
  readonly image_url: string;
  @NotNull()
  readonly max_controllers: number;
  @NotNull()
  readonly online_capable: boolean;
}
