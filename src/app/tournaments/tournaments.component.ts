import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TournamentsService } from '../tournaments.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {
  tournaments$: Observable<any>;

  constructor(
    private tournamentsService: TournamentsService
  ) { }

  ngOnInit() {
    this.tournaments$ = this.tournamentsService.tournaments$;
    console.log('tourns', this.tournaments$);
  }

}
