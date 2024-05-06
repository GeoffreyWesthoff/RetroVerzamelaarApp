import { Injectable } from '@nestjs/common';
import { Neo4jService } from '@nhogs/nestjs-neo4j';
import { CreateGameDto } from './dto/create-game-dto';
import { Game } from 'src/schemas/game.schema';
import { Company } from 'src/schemas/company.schema';

@Injectable()
export class GameService {
    constructor(private readonly neo4jService: Neo4jService) {}

  async create(createGameDto: CreateGameDto, released_on: string[], developed_by: string[]): Promise<Game> {
    const queryResult = await this.neo4jService.run(
      {
        cypher: 'CREATE (c:`Game`) SET c=$props RETURN properties(c) AS game',
        parameters: {
          props: createGameDto,
        },
      },
      { write: true },
    );

    const game = queryResult.records[0].toObject().game;

    for (let i of released_on) {
      const queryResultRelation = await this.neo4jService.run(
          {
              cypher: `MATCH (g:Game), (c:Console) WHERE g.id = $gameId AND c.id = $consoleId CREATE (g)-[:RELEASED_ON]->(c) RETURN g`,
              parameters: {
                  gameId: createGameDto.id,
                  consoleId: i
              }
          },{write: true}
      );
      }

    for (let i of developed_by) {
      const queryResultCompany = await this.neo4jService.run(
          {
              cypher: `MATCH (g:Game), (c:Company) WHERE g.id = $gameId AND c.id = $companyId CREATE (g)-[:DEVELOPED_BY]->(c) RETURN g`,
              parameters: {
                  gameId: createGameDto.id,
                  companyId: i
              }
          },{write: true}
      );
      }
    return game;
  }

  async recommender(minRating: number, limit: number, consoleIds: string[], ownedGameIds: string[]) {
    return (await this.neo4jService.run(
      {
        cypher: `CALL {
        MATCH (game:Game)
        WHERE game.id IN $ownedGameIds
        MATCH (game)-[:DEVELOPED_BY]->(company:Company)<-[:DEVELOPED_BY]-(similarGame:Game)-[:RELEASED_ON]->(similarConsole:Console)
        WHERE similarConsole.id IN $consoleIds AND not similarGame.id IN $ownedGameIds
        WITH similarGame, game, CASE WHEN similarGame.genre = game.genre THEN 0 else 1 END AS sameGenre
        RETURN similarGame
        ORDER BY sameGenre, similarGame.rating DESC
        UNION
        MATCH (game)-[:RELEASED_ON]->(console:Console)<-[:RELEASED_ON]-(similarGame:Game) WHERE console.id IN $consoleIds AND not similarGame.id IN $ownedGameIds
        WITH similarGame, game, CASE WHEN similarGame.genre = game.genre THEN 0 else 1 END AS sameGenre
        RETURN similarGame
        ORDER BY sameGenre, similarGame.rating DESC
        }
        RETURN similarGame
        LIMIT 5

        
`,
        parameters: {

          minRating: minRating | 0,
          limit: limit | 0,
          consoleIds: consoleIds,
          ownedGameIds: ownedGameIds
        }
      }
    )).records.map((record) => record.toObject().similarGame.properties)
  }
    
  async releasedOn(gameId: string, consoleId: string) {
    const queryResult = await this.neo4jService.run(
        {
            cypher: `MATCH (g:Game), (c:Console)
            WHERE g.id = '$gameId' AND c.id = '$consoleId'
            CREATE (g)-[:RELEASED_ON]->(c)
            RETURN g`,
            parameters: {
                gameId: gameId,
                consoleId: consoleId
            }
        },{write: true}
    ); console.log(queryResult);
  }

  async findAll(): Promise<Game[]> {
    return (await this.neo4jService.run({
      cypher: 'MATCH (c:`Game`) RETURN properties(c) AS game',
    })
    ).records.map((record) => record.toObject().game)
  }

  async search(input: string): Promise<Game[]> {
    return (await this.neo4jService.run({
      cypher: 'MATCH (game:Game) WHERE game.name =~ "(?i).*" + $input + ".*" RETURN properties(game) as game',
      parameters: {
        input: input
      }
    })
    ).records.map((record) => record.toObject().game)
  }


  async findOne(id: string): Promise<any> {
    const gameRecords = (await this.neo4jService.run({
      cypher: 'MATCH (console: Console)<-[:RELEASED_ON]-(game:`Game`)-[:DEVELOPED_BY]->(company:Company) WHERE game.id=$id RETURN DISTINCT properties(game) AS game, properties(console) AS console, properties(company) as company',
      parameters: {
        id: id
      }
    })
    ).records;

    const gameResponse = {game: {}, consoles: [], companies: []}

    gameRecords.map(record => {
      gameResponse.game = record.toObject().game;
      let company = record.toObject()['company'];
      let c = record.toObject()['console'];
      
      if (!gameResponse.consoles.some(obj => obj.id === c.id)) {
        gameResponse.consoles.push(c);
      }
      
      if (!gameResponse.companies.some(obj => obj.id === company.id)) {
        gameResponse.companies.push(company);
      }
      
      
    });

    return gameResponse;
  }

  async deleteOne(id: string): Promise<boolean> {
    const result = (await this.neo4jService.run({
      cypher: 'MATCH (game:Game {id: $input}) DETACH DELETE game',
      parameters: {
        input: id
      }
    },{write: true})
    )
    return true;
  }

  async updateOne(id: string, props: CreateGameDto, released_on: string[], developed_by: string[]): Promise<Game> {
    const result = (await this.neo4jService.run({
      cypher: 'MATCH (game:Game {id: $input}) SET game=$props RETURN properties(game) AS game',
      parameters: {
        input: id,
        props: props
      }
    },{write: true})
    )
    await this.neo4jService.run({
      cypher: 'MATCH (game:Game {id: $input})-[c:DEVELOPED_BY]->() DELETE c',
      parameters: {input: id}
    },{write: true})
    await this.neo4jService.run({
      cypher: 'MATCH (game:Game {id: $input})-[co:RELEASED_ON]->() DELETE co',
      parameters: {input: id}
    },{write: true})
    for (let i of released_on) {
      const queryResultRelation = await this.neo4jService.run(
          {
              cypher: `MATCH (g:Game), (c:Console) WHERE g.id = $gameId AND c.id = $consoleId CREATE (g)-[:RELEASED_ON]->(c) RETURN g`,
              parameters: {
                  gameId: id,
                  consoleId: i
              }
          },{write: true}
      );
      }

    for (let i of developed_by) {
      const queryResultCompany = await this.neo4jService.run(
          {
              cypher: `MATCH (g:Game), (c:Company) WHERE g.id = $gameId AND c.id = $companyId CREATE (g)-[:DEVELOPED_BY]->(c) RETURN g`,
              parameters: {
                  gameId: id,
                  companyId: i
              }
          },{write: true}
      );
      }
    return result.records[0].toObject().game;
  }
}
