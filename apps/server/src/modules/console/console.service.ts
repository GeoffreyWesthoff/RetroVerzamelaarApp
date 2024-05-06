import { Injectable } from '@nestjs/common';
import {
  Console,
} from '../../schemas/console.schema';
import { CreateConsoleDto } from './dto/create-console-dto';
import { Neo4jNodeModelService, Neo4jService } from '@nhogs/nestjs-neo4j';
import { Game } from 'src/schemas/game.schema';

@Injectable()
export class ConsoleService extends Neo4jNodeModelService<Console> {
  constructor(readonly neo4jService: Neo4jService) {super()}

  label = 'Console';
  logger = undefined;
  protected timestamp: string = 'created';

  toNeo4j(params: Partial<Console>): Record<string, any> {
    let result: Record<string, any> = {...params};
    
    return super.toNeo4j(params)
}

  async search(input: string): Promise<Console[]> {
    console.log(input)
    return (await this.neo4jService.run({
      cypher: 'MATCH (console:Console) WHERE console.name =~ "(?i).*" + $input + ".*" RETURN properties(console) as console',
      parameters: {
        input: input
      }
    })
    ).records.map((record) => record.toObject().console)
  }

  async getBest(id: String): Promise<Game[]> {
    return (await this.neo4jService.run({
      cypher: `MATCH (console:Console)<-[:RELEASED_ON]-(game:Game) WHERE console.id = $id
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
