import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment, params } from 'src/environments/environment';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  search$ = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    const url = `${environment.PGA_API}/Players`;
    return this.http
      .get<Player[]>(url, { params })
      .pipe(
        shareReplay(1),
        map((player) => this.getPlayersWithImage(player)),
        catchError(err => this.handleError(err))
      );
  }

  getSinglePlayer(id: string) {
    const url = `${environment.PGA_API}/Player/${id}`;
    return this.http.get<Player>(url, { params }).pipe(
      shareReplay(1),
      map(item => item),
      catchError(err => this.handleError(err))
    );
  }

  getPlayersWithImage(player: Player[]) {
    return player.filter((item) => {
      if (
        item.PhotoUrl !==
        'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/0.png'
      ) {
        return item;
      }
    });
  }

  setSearch(term) {
    this.search$.next(term);
  }

  clearSearch() {
    this.search$.next('');
  }

  handleError(err: any) {
    let errorMessage: string;
    errorMessage = `An Error Occured ${err.message}`;

    console.error(err);
    return throwError(errorMessage);
  }
}
