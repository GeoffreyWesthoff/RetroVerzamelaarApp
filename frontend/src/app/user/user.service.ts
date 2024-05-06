import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collectable, User, UserResponse } from './user.schema';
import { Game } from '../game/game.schema';
import { Console } from '../console/console.schema';
import { environment } from 'frontend/src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: UserResponse = {
    _id: '',
    user: {
    username: '',
    owned_consoles: [],
    owned_games: [],
    admin: false,
    },
    consoles: [],
    games: [],
    recommendations: []
  };

  private userUrl = (environment['API_URL'] || 'http://localhost:3000') + '/user';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem("token")}` }),
  };

  constructor(private readonly http: HttpClient, private authService: AuthenticationService) { }

  getUser(username: string | null): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.userUrl + '/' + username, this.httpOptions);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl, this.httpOptions);

  }

  collect(collectable: Game | Console, type: string, data: any): Observable<any> {
    if (type === 'console') {
      
      const consoleObject = {id: collectable.id, ...data}

      this.user.user.owned_consoles.push(consoleObject)
      //@ts-ignore
      this.user.consoles.push(collectable);
    } else if (type === 'game') {
      const gameObject = {id: collectable.id, ...data}
      //@ts-ignore
      this.user.user.owned_games.push(gameObject)
      //@ts-ignore
      this.user.games.push(collectable);
      this.user.recommendations = this.user.recommendations.filter(function(item) {
        return item !== collectable
       })
    }
    return this.http.put(this.userUrl + '/collect', {id: collectable.id,  type: type, ...data}, this.httpOptions);
  }

  uncollect(collectable: Collectable, type: string): void {
    if (type === 'console') {
      this.http.put(this.userUrl + '/uncollect', {type: type, ...collectable}, this.httpOptions).subscribe((response) => {})

      this.user.user.owned_consoles = this.user.user.owned_consoles.filter(function(item) {
        return item !== collectable
       })
      this.user.consoles = this.user.consoles.filter(function(item) {
        return item.id !== collectable.id
       })
    } else if (type === 'game') {
      this.http.put(this.userUrl + '/uncollect', {type: type, ...collectable}, this.httpOptions).subscribe((response) => {})
      this.user.user.owned_games = this.user.user.owned_games.filter(function(item) {
        return item !== collectable
       })
      this.user.games = this.user.games.filter(function(item) {
        return item.id !== collectable.id
       })
    }
  }

  deleteAccount(current_password: string): Observable<any> {
     return this.http.delete<any>(this.userUrl, {body: {current_password: current_password}, headers: this.httpOptions.headers});
  }

  deleteAccountAdmin(username: String): Observable<any> {
    return this.http.delete<any>(this.userUrl + '/' + username, this.httpOptions)
  }

  editAccount(user: User): Observable<any> {
    return this.http.put<any>(this.userUrl, user, this.httpOptions)
  }

  editAccountAdmin(oldUserName: string, user: User): Observable<any> {
    return this.http.put(this.userUrl + '/' + oldUserName, user, this.httpOptions)
  }
}
