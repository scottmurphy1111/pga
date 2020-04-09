import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap, distinctUntilChanged, shareReplay } from 'rxjs/operators';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { environment, params } from 'src/environments/environment';
import { Player } from './player';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  search$ = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  players$ = (() => {
    return this.http
      .get<Player>(`${environment.PGA_API}/Players`, {
        params
      })
      .pipe(
        map((player) => this.getGoodPlayers(player)),
        tap(player => console.log('players', player)),
        shareReplay(1));
  })();

  getSinglePlayer(id: string) {
    return this.http.get<Player>(`${environment.PGA_API}/Player/${id}`, {
      params,
    }).pipe(
      map(item => {
        console.log('item', item);
        return item;
      })
    );
  }

  getGoodPlayers(player) {
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
