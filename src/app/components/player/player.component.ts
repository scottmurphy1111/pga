import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Player } from 'src/app/models/player';
import { PlayersService } from 'src/app/services/players.service';

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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.player$ = this.activatedRoute.queryParamMap.pipe(
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
