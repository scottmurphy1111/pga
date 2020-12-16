import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from 'src/app/models/player';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {
  constructor(
    private playersService: PlayersService
  ) { }

  limits = [10, 25, 100];

  players$: Observable<Player[]>;
  search$: Observable<any> | null;
  limit$ = new BehaviorSubject<any>(10);
  page$ = new BehaviorSubject<any>(0);
  displayPage$ = this.page$.pipe(map(page => page + 1));
  searchedPlayers$: Observable<any>;
  total$ = new BehaviorSubject<any>(0);
  totalPages$ = combineLatest(this.total$, this.limit$).pipe(
    map(([pages, limit]) => Math.ceil(pages/limit))
  );
  lastPage$ = this.totalPages$.pipe(map(page => page - 1));

  ngOnInit() {
    this.players$ = this.playersService.players$;
    this.search$ = this.playersService.search$;

    this.searchedPlayers$ = combineLatest(this.players$, this.search$, this.limit$, this.page$)
    .pipe(
      map(([players, search, limit, page]) => {
        let computedPlayers = [];

        if (search) {
          computedPlayers = this.searchPlayers(players, search);
        } else {
          computedPlayers = players;
        }

        this.total$.next(computedPlayers.length);
        return this.displayPlayers(computedPlayers, limit, page);
      })
    );
  }

  searchPlayers(players, search) {
    return players.filter(item => {
      const firstName = item.FirstName.toLowerCase();
      const lastName = item.LastName.toLowerCase();

      if (firstName.startsWith(search.toLowerCase()) || lastName.startsWith(search.toLowerCase())) {
        return item;
      }
    });
  }

  displayPlayers(players, limit, page) {
    return players.slice(page * limit, (page * limit) + limit);
  }

  doSearch(term) {
    this.playersService.setSearch(term);
    this.page$.next(0);
  }

  setLimit(limit) {
    this.limit$.next(limit);
    this.page$.next(0);
  }

  setPage(num) {
    const currentPage = this.page$.value;
    this.page$.next(currentPage + num);
  }

  clearSearch() {
    this.playersService.clearSearch();
  }

  ngOnDestroy() {
    this.playersService.clearSearch();
  }
}
