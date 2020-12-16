import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { params } from 'src/environments/environment';

import { TournamentsService } from './tournaments.service';

const tourneys = <any>[
  {
    StartDate: '2020-02-01',
    TournamentID: 2
  },
  {
    StartDate: '2020-01-01',
    TournamentID: 1
  }
];

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

  it('should get tourneys data', done => {
    mockHttp.get = jest.fn().mockReturnValue(of(false));
    tournamentsService.getCurrentTourneys = jest.fn().mockReturnValue(tourneys);

    tournamentsService.getTourneys();

    expect(mockHttp.get).toHaveBeenCalledWith(`https://api.sportsdata.io/golf/v2/json/Tournaments`, {params: params}
    );

    tournamentsService.getTourneys().subscribe(() => {
      expect(tournamentsService.getCurrentTourneys).toHaveBeenCalled();
      done();
    })
  });

  it('should get current tourneys based on date', () => {
    const getTourneys = tournamentsService.getCurrentTourneys(tourneys);

    expect(getTourneys).toEqual([
      {
        StartDate: '2020-01-01',
        TournamentID: 1
      },
      {
        StartDate: '2020-02-01',
        TournamentID: 2
      }
    ]);
  });

  it('should handle error', () => {
    const errorResult = tournamentsService.handleError('foo');

    expect(errorResult).toBeDefined();
  });
});
