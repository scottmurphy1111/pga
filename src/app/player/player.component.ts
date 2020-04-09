import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../player';
import { PlayersService } from '../players.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  player$: Observable<Player>;
  id: string;

  constructor(
    private playersService: PlayersService,
    private activatedroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.player$ = this.activatedroute.queryParamMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.getPlayer(id);
      }
    ));
  }

  getPlayer(id: string) {
    return this.playersService.getSinglePlayer(id);
  }

}
