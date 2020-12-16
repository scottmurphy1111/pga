import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import { environment, params } from 'src/environments/environment';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  search$ = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  players$ = (() => {
    return this.http
      .get<Player[]>(`${environment.PGA_API}/Players`, {
        params
      })
      .pipe(
        shareReplay(1),
        map((player) => this.getPlayersWithImage(player))
      );
  })();

  getSinglePlayer(id: string) {
    return this.http.get<Player>(`${environment.PGA_API}/Player/${id}`, {
      params,
    }).pipe(
      map(item => item)
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
}
