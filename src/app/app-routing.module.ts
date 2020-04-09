import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { PlayersComponent } from './players/players.component';
import { TournamentsComponent } from './tournaments/tournaments.component';


const routes: Routes = [
  {
    path: 'players',
    component: PlayersComponent
  },
  {
    path: 'player/:name',
    component: PlayerComponent
  },
  {
    path: 'tournaments',
    component: TournamentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
