import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsdaDataByYearComponent } from './usda-data-by-year.component';

describe('UsdaDataByYearComponent', () => {
  let component: UsdaDataByYearComponent;
  let fixture: ComponentFixture<UsdaDataByYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsdaDataByYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsdaDataByYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
