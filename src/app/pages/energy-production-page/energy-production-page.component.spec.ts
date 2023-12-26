import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyProductionPageComponent } from './energy-production-page.component';

describe('EnergyProductionPageComponent', () => {
  let component: EnergyProductionPageComponent;
  let fixture: ComponentFixture<EnergyProductionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnergyProductionPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnergyProductionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
