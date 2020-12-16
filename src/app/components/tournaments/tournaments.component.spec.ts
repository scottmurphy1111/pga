import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TournamentsService } from 'src/app/services/tournaments.service';

import { TournamentsComponent } from './tournaments.component';

const mockTourneys = <any[]>[
  {
    data: 'foo'
  }
]
describe('TournamentsComponent', () => {
  let component: TournamentsComponent;
  let fixture: ComponentFixture<TournamentsComponent>;
  let tournamentsService: TournamentsService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule
      ],
      declarations: [ TournamentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsComponent);
    component = fixture.componentInstance;
    tournamentsService = TestBed.get(TournamentsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get Current Year', () => {
    const currentYear = new Date().getFullYear();

    component.getCurrentYear();

    expect(component.currentYear$.value).toEqual(currentYear)
  });

  it('should get tournaments from service', done => {
    jest.spyOn(tournamentsService, 'getCurrentTourneys').mockReturnValue(mockTourneys);

    fixture.detectChanges();

    component.tournaments$.subscribe(val => {
      expect(val).toEqual(mockTourneys);
      done();
    })
  });
});
