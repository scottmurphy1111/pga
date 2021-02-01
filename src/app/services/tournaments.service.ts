import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment, params } from "src/environments/environment";
import { map, shareReplay, catchError, tap } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { Tournament } from "../models/tournament";

@Injectable({
  providedIn: "root",
})
export class TournamentsService {
  constructor(private http: HttpClient) {}

  getTourneys(): Observable<Tournament[]> {
    const url = `${environment.PGA_API}/Tournaments`;
    return this.http
      .get<Tournament[]>(url, { params })
      .pipe(
        shareReplay(1),
        map((tourneys) => this.getCurrentTourneys(tourneys)),
        tap((tourneys) => this.isUpcoming(tourneys)),
        catchError((err) => this.handleError(err))
      );
  }

  getCurrentTourneys(tourneys: Tournament[]) {
    return tourneys
      .filter((item) => {
        const currentYear = new Date().getFullYear();
        if (item.StartDate.slice(0, 4) >= currentYear.toString()) {
          return item;
        }
      })
      .sort((a, b) => {
        return (
          new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
        );
      });
  }

  isUpcoming(tourneys: Tournament[]) {
    return tourneys.filter((item) => {
      const currentDate = new Date();
      const weekFromNow = currentDate.getTime() + 4 * 24 * 60 * 60 * 1000;

      if (
        new Date(weekFromNow) > new Date(item.StartDate) &&
        new Date(weekFromNow) < new Date(item.EndDate)
      ) {
        return item.upcoming = true;
      }
    });
  }

  handleError(err: any) {
    let errorMessage: string;
    errorMessage = `An Error Occured ${err.message}`;

    return throwError(errorMessage);
  }
}
