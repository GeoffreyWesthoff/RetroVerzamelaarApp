import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Console } from './console.schema';
import {WriteableConsole} from "./writeableConsole.schema";
import { Game } from '../game/game.schema';
import { environment } from 'frontend/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ConsoleService {
  private consoleUrl = (environment['API_URL'] || 'http://localhost:3000') + '/console';
  consoles: Console[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem("token")}` }),
  };

  constructor(private http: HttpClient) {}

  createConsole(newConsole: Console): Observable<Console> {
    return this.http.post<Console>(this.consoleUrl, newConsole, this.httpOptions).pipe(
      tap((addedConsole: Console) => console.log(`added console w/ name=${addedConsole.name}`)),
      catchError(this.handleError<Console>('addHero'))
    )
  }

  editConsole(consoleId: string, newConsole: Console): Observable<Console> {
    const url = `${this.consoleUrl}/${consoleId}`;
    return this.http.put<Console>(url, newConsole, this.httpOptions);
  }

  /** GET consoles from the server */
  getConsoles(): Observable<Console[]> {
    return this.http.get<Console[]>(this.consoleUrl, this.httpOptions);
  }

  getConsole(id: string): Observable<Console> {
    return this.http.get<Console>(this.consoleUrl + '/' + id, this.httpOptions);
  }

  deleteConsole(id: string): Observable<Console> {
    const url = `${this.consoleUrl}/${id}`;

    return this.http.delete<Console>(url, this.httpOptions);
  }

  getBest(id: string): Observable<Game[]> {
    const url = `${this.consoleUrl}/${id}/best`
    return this.http.get<Game[]>(url, this.httpOptions)
  }

  search(name: string): Observable<Console[]> {
    const url = `${this.consoleUrl}/search`
    return this.http.post<Console[]>(url, {input: name}, this.httpOptions)
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

  /** Log a HeroService message with the MessageService */
}
