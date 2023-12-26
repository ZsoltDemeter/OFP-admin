import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyForecastingPageComponent } from './energy-forecasting-page.component';

describe('EnergyForecastingPageComponent', () => {
  let component: EnergyForecastingPageComponent;
  let fixture: ComponentFixture<EnergyForecastingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyForecastingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyForecastingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
