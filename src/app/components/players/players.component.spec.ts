import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayersService } from 'src/app/services/players.service';

import { PlayersComponent } from './players.component';

const mockPlayers = <any[]>[
  {
    data: 'foo'
  }
];

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;
  let playersService: PlayersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, FormsModule
      ],
      declarations: [ PlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    playersService = TestBed.get(PlayersService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search for players based on search term', () => {
    const players = <any>[
      {
        FirstName: 'Joe',
        LastName: 'Schmoo'
      },
      {
        FirstName: 'Tiger',
        LastName: 'Woods'
      }
    ];

    const term = 'jo';

    expect(component.searchPlayers(players, term)).toEqual([{
      FirstName: 'Joe',
      LastName: 'Schmoo'
    }]);
  });

  it('should get all players', done => {
    jest.spyOn(playersService, 'getPlayersWithImage').mockReturnValue(mockPlayers);

    fixture.detectChanges();

    component.players$.subscribe(val => {
      expect(val).toEqual(mockPlayers);
      done();
    })
  });

  it('should set search term', done => {
    playersService.setSearch = jest.fn();
    const term = 'foo';

    component.doSearch(term);
    fixture.detectChanges();

    component.search$.subscribe(() => {
      expect(playersService.setSearch).toHaveBeenCalledWith(term)
      done();
    })
  });

  it('should set limit', done => {
    component.limit$.next = jest.fn();
    const limit = 100;

    component.setLimit(limit);

    component.limit$.subscribe(() => {
      expect(component.limit$.next).toHaveBeenCalledWith(limit);
      done();
    });
  });

  it('should set page', done => {
    component.page$.next = jest.fn();
    const num = 1;

    component.setPage(num);

    component.page$.subscribe(() => {
      expect(component.page$.next).toHaveBeenCalledWith(num);
      done();
    })
  });

  it('should clear search', () => {
    playersService.clearSearch = jest.fn();

    component.clearSearch();

    expect(playersService.clearSearch).toHaveBeenCalled();
  });
});
