import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlayersService } from '../players.service';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { Player } from '../player';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, OnDestroy {
  constructor(
    private playersService: PlayersService
  ) { }

  players$: Observable<Player>;
  search$: Observable<any> | null;
  limit$ = new BehaviorSubject<any>(0);
  page$ = new BehaviorSubject<any>(0);
  searchedPlayers$: any;

  ngOnInit() {
    this.players$ = this.playersService.players$;
    this.search$ = this.playersService.search$;
    // this.limit$
    // this.page$ = this.playersService.page$;

    this.searchedPlayers$ = combineLatest(this.players$, this.search$, this.limit$, this.page$)
    .pipe(
      map(([players, search]) => {
        if (search) {
          return this.searchPlayers(players, search);
        } else {
          return players;
        }
      })
    );
  }

  doSearch(term) {
    this.playersService.setSearch(term);
  }

  searchPlayers(player, search) {
    return player.filter(item => {
      const firstName = item.FirstName.toLowerCase();
      const lastName = item.LastName.toLowerCase();

      if (firstName.startsWith(search.toLowerCase()) || lastName.startsWith(search.toLowerCase())) {
        return item;
      }
    });
  }

  ngOnDestroy() {
    this.playersService.clearSearch();
  }
}
