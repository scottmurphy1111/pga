import { Component, OnInit } from '@angular/core';
import { PlayersService } from '../players.service';
import { Observable } from 'rxjs';
import { Player } from '../player';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
  players$: Observable<Player>;
  search$: Observable<any>;
  limit$: Observable<any>;
  page$: Observable<any>;

  constructor(
    private playersService: PlayersService
  ) { }

  ngOnInit() {
    this.players$ = this.playersService.players$;
    this.search$ = this.playersService.search$;
    this.limit$ = this.playersService.limit$;
    this.page$ = this.playersService.page$;
  }

  doSearch(term) {
    this.playersService.setSearch(term);
  }



}
