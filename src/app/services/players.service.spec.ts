import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { params } from 'src/environments/environment';

import { PlayersService } from './players.service';

const players = <any>[
  {
    PlayerID: '001',
    FirstName: 'Joe',
    LastName: 'Schmoo',
    PhotoUrl: 'https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/0.png'
  },
  {
    PlayerID: '002',
    FirstName: 'Tiger',
    LastName: 'Woods',
    PhotoUrl: 'TigerPic'
  }
];

describe('PlayersService', () => {
  let playersService: PlayersService;
  let mockHttp: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule
      ]
    });
    playersService = TestBed.get(PlayersService);
    mockHttp = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(playersService).toBeTruthy();
  });

  it('should get players data', done => {
    mockHttp.get = jest.fn().mockReturnValue(of(false));
    playersService.getPlayersWithImage = jest.fn().mockReturnValue(players);

    playersService.getPlayers();

    expect(mockHttp.get).toHaveBeenCalledWith(`https://api.sportsdata.io/golf/v2/json/Players`, {params: params}
    );

    playersService.getPlayers().subscribe(() => {
      expect(playersService.getPlayersWithImage).toHaveBeenCalled();
      done();
    })
  });

  it('should call api to get a single player', () => {
    mockHttp.get = jest.fn().mockReturnValue(of(false));
    const id = '001';

    playersService.getSinglePlayer(id);

    expect(mockHttp.get).toHaveBeenCalledWith(`https://api.sportsdata.io/golf/v2/json/Player/001`, {params: params});

  });

  it('should get single player based on id value', done => {
    mockHttp.get = jest.fn().mockReturnValue(of(players[0]))
    const id = '001';

    playersService.getSinglePlayer(id).subscribe(player => {
      expect(player).toEqual(players[0]);
      done();
    });
  });

  it('should get players with an image', () => {
    const result = playersService.getPlayersWithImage(players);

    expect(result).toEqual([players[1]]);
  });

  it('should set search term', done => {
    const term = 'tiger';
    playersService.setSearch(term);

    playersService.search$.subscribe(val => {
      expect(val).toEqual(term);
      done();
    })
  });

  it('should clear search term', done => {
    playersService.search$.next = jest.fn().mockReturnValue('tiger');
    playersService.clearSearch();

    playersService.search$.subscribe(val => {
      expect(val).toEqual('');
      done();
    })
  });

  it('should handle error', () => {
    const errorResult = playersService.handleError('foo');

    expect(errorResult).toBeDefined();
  });
});
