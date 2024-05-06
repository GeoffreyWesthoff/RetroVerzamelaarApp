import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { Company } from './company.schema';
import { Game } from '../game/game.schema';
import { environment } from 'frontend/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companyUrl = (environment['API_URL'] || 'http://localhost:3000') + '/company';
  companies: Company[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': `Bearer ${localStorage.getItem("token")}` }),
  };

  constructor(private http: HttpClient) {}

  createCompany(newCompany: Company): Observable<Company> {
    return this.http.post<Company>(this.companyUrl, newCompany, this.httpOptions).pipe(
      tap((addedCompany: Company) => console.log(`added company w/ name=${addedCompany.name}`)),
      catchError(this.handleError<Company>('addHero'))
    )
  }

  editCompany(companyId: string, newConsole: Company): Observable<Company> {
    const url = `${this.companyUrl}/${companyId}`;
    return this.http.put<Company>(url, newConsole, this.httpOptions);
  }

  /** GET consoles from the server */
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.companyUrl, this.httpOptions);
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(this.companyUrl + '/' + id, this.httpOptions);
  }

  deleteCompany(id: string): Observable<Company> {
    const url = `${this.companyUrl}/${id}`;

    return this.http.delete<Company>(url, this.httpOptions);
  }

  getBest(id: string): Observable<Game[]> {
    const url = `${this.companyUrl}/${id}/best`
    return this.http.get<Game[]>(url, this.httpOptions)
  }

  search(name: string): Observable<Company[]> {
    const url = `${this.companyUrl}/search`
    return this.http.post<Company[]>(url, {input: name}, this.httpOptions)
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
