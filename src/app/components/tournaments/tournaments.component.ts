import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TournamentsService } from 'src/app/services/tournaments.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {
  tournaments$: Observable<any>;
  currentYear$ = new BehaviorSubject<any>(2020);

  constructor(
    private tournamentsService: TournamentsService
  ) { }

  ngOnInit() {
    this.tournaments$ = this.tournamentsService.tournaments$;
  }

  getCurrentYear() {
    const currentYear = new Date().getFullYear();
    this.currentYear$.next(currentYear);
  }
}
