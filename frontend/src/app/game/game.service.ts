import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Game } from './game.schema';
import { Observable, catchError, of, tap } from 'rxjs';
import { GameResponse } from './gameResponse.schema';
import { environment } from 'frontend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameUrl = (environment['API_URL']|| 'http://localhost:3000') + '/game';
  games: Game[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` }),
  };

  constructor(private http: HttpClient) {}

  createGame(newGame: Game): Observable<Game> {
    return this.http.post<Game>(this.gameUrl, newGame, this.httpOptions).pipe(
      tap((addedGame: Game) => console.log(`added game w/ name=${addedGame.name}`)),
      catchError(this.handleError<Game>('addHero'))
    )
  }

  editGame(gameId: string, newGame: Game): Observable<Game> {
    const url = `${this.gameUrl}/${gameId}`;
    return this.http.put<Game>(url, newGame, this.httpOptions);
  }

  /** GET games from the server */
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(this.gameUrl, this.httpOptions);
  }

  getGame(id: string): Observable<GameResponse> {
    return this.http.get<GameResponse>(this.gameUrl + '/' + id, this.httpOptions);
  }

  deleteGame(id: string): Observable<Game> {
    const url = `${this.gameUrl}/${id}`;

    return this.http.delete<Game>(url, this.httpOptions);
  }

  search(input: string): Observable<Game[]> {
    return this.http.post<Game[]>(this.gameUrl + '/search', {input: input}, this.httpOptions)
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
