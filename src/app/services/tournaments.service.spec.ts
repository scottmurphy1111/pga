import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TournamentsService } from './tournaments.service';

describe('TournamentsService', () => {
  let tournamentsService: TournamentsService;
  let mockHttp: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule
      ]
    });
    tournamentsService = TestBed.get(TournamentsService);
    mockHttp = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(tournamentsService).toBeTruthy();
  });

  it('should get current tourneys data based on current year', done => {
    const tourneys = <any>[
      {
        StartDate: '2020-01-01'
      }
    ]

    mockHttp.get = jest.fn().mockReturnValue(tourneys);

    tournamentsService.getCurrentTourneys(tourneys);

    tournamentsService.tournaments$.subscribe(val => {
      console.log('val', val);
      expect(tournamentsService.tournaments$).toHaveBeenCalledWith(tourneys);
      done()
    });
  });
});
