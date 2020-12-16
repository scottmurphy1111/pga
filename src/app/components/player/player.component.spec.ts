import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PlayersService } from 'src/app/services/players.service';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let playersService: PlayersService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule
      ],
      declarations: [ PlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    playersService = TestBed.get(PlayersService);
    activatedRoute = TestBed.get(ActivatedRoute);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get player based on id', () => {
    playersService.getSinglePlayer = jest.fn().mockReturnValue('foo');
    const id = 'ID';

    expect(component.getPlayer(id)).toEqual('foo');
  });

  it('should get player on init', done => {
    const mockPlayer = {PlayerId: '001'};
    playersService.getSinglePlayer = jest.fn().mockReturnValue(mockPlayer);
    activatedRoute.queryParams = of({params: {id: '001'}})

    component.getPlayer = jest.fn().mockReturnValue(of(mockPlayer));

    fixture.detectChanges();

    component.player$.subscribe(val => {
      expect(val).toEqual(mockPlayer);
      done();
    })

  });
});
