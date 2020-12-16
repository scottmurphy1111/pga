import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, params } from 'src/environments/environment';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Tournament } from '../models/tournament';

@Injectable({
  providedIn: 'root'
})
export class TournamentsService {

  constructor(private http: HttpClient) {}

  tournaments$ = this.http
      .get<Tournament[]>(`${environment.PGA_API}/Tournaments`, {
        params
      })
      .pipe(
        shareReplay(1),
        map(tourneys => this.getCurrentTourneys(tourneys)),
        catchError(err => this.handleError(err))
      );

  getCurrentTourneys(tourneys: Tournament[]) {
    return tourneys.filter((item) => {
      console.log('item', item);
      const currentYear = new Date().getFullYear();
      if (item.StartDate.slice(0, 4) >= currentYear.toString()) {
        return item;
      }
    }).sort((a, b) => {
      return a.TournamentID - b.TournamentID;
    });
  }

  handleError(err: any) {
    let errorMessage: string;
    errorMessage = `An Error Occured ${err.message}`;

    console.error(err);
    return throwError(errorMessage);
  }
}
