import { Node, NodeKey, NotNull, Unique } from "@nhogs/nestjs-neo4j"


@Node({label: 'Company'})
export class Company {
  @Unique()
  @NodeKey()
  id: string

  @NotNull()
  name: string;

  @NotNull()
  establishment_year: Date;

  @NotNull()
  annual_revenue: number;

  @NotNull()
  image_url: string;

  @NotNull()
  country: string;
}