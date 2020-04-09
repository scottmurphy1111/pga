import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, params } from 'src/environments/environment';
import { map, shareReplay, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Tournament } from './tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  constructor(private http: HttpClient) {}

  tournaments$ = this.http
      .get<any>(`${environment.PGA_API}/Tournaments`, {
        params
      })
      .pipe(
        map(tourneys => {
          return tourneys.filter((item) => {
            if (item.StartDate.slice(0, 4) === '2020') {
              return item;
            }
          }).sort((a, b) => {
            return a.TournamentID - b.TournamentID;
          });
        }),
        tap(t => console.log('ts', t)),
        catchError(this.handleError),
        shareReplay(1)
      );

  handleError(err: any) {
    let errorMessage: string;
    errorMessage = `An Error Occured ${err.message}`;

    console.error(err);
    return throwError(errorMessage);
  }
}
