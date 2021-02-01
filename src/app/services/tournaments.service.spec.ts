import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { params } from 'src/environments/environment';

import { TournamentsService } from './tournaments.service';

const tourneys = <any>[
  {
    StartDate: '2021-11-16T00:00:00',
    TournamentID: 2
  },
  {
    StartDate: '2021-11-09T00:00:00',
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
        StartDate: '2021-11-09T00:00:00',
        TournamentID: 1
      },
      {
        StartDate: '2021-11-16T00:00:00',
        TournamentID: 2
      }
    ]);
  });

  it('should add upcoming to this week\'s tourney', () => {
    const currentDate = new Date();
    const startDate = currentDate.getTime() + 1 * 24 * 60 * 60 * 1000;
    const endDate = currentDate.getTime() + 5 * 24 * 60 * 60 * 1000;

    const currentTourneys = <any>[
      {
        StartDate: startDate,
        EndDate: endDate,
        TournamentID: 1
      },
      {
        StartDate: '2021-11-09T00:00:00',
        EndDate: '2021-11-13T00:00:00',
        TournamentID: 2
      }
    ];

    const isUpcoming = tournamentsService.isUpcoming(currentTourneys);

    expect(isUpcoming).toEqual([
      {
        StartDate: startDate,
        EndDate: endDate,
        TournamentID: 1,
        upcoming: true
      }
    ])
  });

  it('should handle error', () => {
    const errorResult = tournamentsService.handleError('foo');

    expect(errorResult).toBeDefined();
  });
});
