import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Player } from './player';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  search$ = new BehaviorSubject('');
  limit$ = new BehaviorSubject(0);
  page$ = new BehaviorSubject(0);

  constructor(
    private http: HttpClient
  ) { }

  combined = combineLatest(this.search$, this.limit$, this.page$);

  players$ = this.combined
      .pipe(
        switchMap(([search, limit, page]) => {
          const params: any = {
            key: environment.API_KEY,
            limit: `${limit}`,
            page: `${page + limit}`
          };
          return this.http
          .get<Player>(`${environment.PGA_API}/Players`, {
            params
          });
        }),
      map(player => this.getGoodPlayers(player)),
      map(player => {
        return this.searchPlayers(player, this.search$.getValue());
      }),
      // tap(player => console.log('player', player))
    );

  getGoodPlayers(player) {
    return player.filter(item => {
      if (item.PhotoUrl !== 'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/0.png') {
        return item;
      }
    });
  }

  searchPlayers(player, search) {
    return player.filter(item => {
      if (item.FirstName.toLowerCase().startsWith(search.toLowerCase()) || item.LastName.toLowerCase().startsWith(search.toLowerCase())) {
        return item;
      }
    });
  }

  setSearch(term) {
    this.search$.next(term);
  }
}
