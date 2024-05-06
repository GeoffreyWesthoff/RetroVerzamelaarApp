import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userUrl = environment['API_URL'] || 'http://localhost:3000';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) { }

  login(username: string | null | undefined, password: string | null | undefined): Observable<any> {
    return this.http.post<string>(this.userUrl + "/login", {username: username, password: password}, this.httpOptions)
  }

  signup(username: string | null, password: string | null, password_confirm: string): Observable<object> {
    return this.http.post<object>(this.userUrl + '/signup', {username: username, password: password, password_confirm: password_confirm}, this.httpOptions);
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem("token") != null;
  }

  getUsername(): string | null {
    
    const token = jwtDecode(localStorage.getItem('token') || '');
    //@ts-ignore
    if (token.iat + 86400 > Date.now()) {
      localStorage.removeItem('token');
    }

    //@ts-ignore
    return token.username;
  }

  isAdmin(): boolean {
    if (this.isUserLoggedIn()) {
      //@ts-ignore
      const token = jwtDecode(localStorage.getItem('token'));
      //@ts-ignore
      return token.admin;
    }
    return false;
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
