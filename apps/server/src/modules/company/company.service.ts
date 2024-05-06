import { Injectable, Logger } from '@nestjs/common';
import { Neo4jNodeModelService, Neo4jService } from '@nhogs/nestjs-neo4j';
import { CreateCompanyDto } from './dto/create-company-dto';
import { Company } from 'src/schemas/company.schema';
import { Game } from 'src/schemas/game.schema';

@Injectable()
export class CompanyService extends Neo4jNodeModelService<Company> {

    constructor(readonly neo4jService: Neo4jService) {super()}

    label: string = 'Company';
    protected logger: Logger = undefined;
    protected timestamp: string = 'created';

    fromNeo4j(record: Record<string, any>): Company {
        return super.fromNeo4j({...record})
    }

    toNeo4j(params: Partial<Company>): Record<string, any> {
        let result: Record<string, any> = {...params};
        
        return super.toNeo4j(params)
    }

    async search(input: string): Promise<Company[]> {
      return (await this.neo4jService.run({
        cypher: 'MATCH (company:Company) WHERE company.name =~ "(?i).*" + $input + ".*" RETURN properties(company) as company',
        parameters: {
          input: input
        }
      })
      ).records.map((record) => record.toObject().company)
    }


    async getBest(id: String): Promise<Game[]> {
      return (await this.neo4jService.run({
        cypher: `MATCH (company:Company)<-[:DEVELOPED_BY]-(game:Game) WHERE company.id = $id
        RETURN properties(game) AS game
        ORDER BY game.rating DESC
        LIMIT 5
         `,
         parameters: {
          id: id
         }
      })
      ).records.map((record) => record.toObject().game)
    }
}
