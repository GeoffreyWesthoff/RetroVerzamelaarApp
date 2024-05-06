import { Node, NodeKey, NotNull, Relationship } from "@nhogs/nestjs-neo4j";
import * as crypto from "crypto";

@Node({label: "Company"})
export class CreateCompanyDto {

  constructor(body: any){
    this.id = body.id;
    this.name = body.name;
    this.country = body.country;
    this.establishment_year = body.establishment_year;
    this.image_url = body.image_url;
    this.annual_revenue = body.annual_revenue;
  }  

  @NodeKey()
  id: string = crypto.randomBytes(64).toString('hex');

  @NotNull()
  readonly name: string;

  @NotNull()
  readonly image_url: string;

  @NotNull()
  readonly establishment_year: Date

  @NotNull()
  readonly country: string

  @NotNull()
  readonly annual_revenue: number
  

 
}

@Relationship({ type: 'DEVELOPED' })
export class Developed {
}
