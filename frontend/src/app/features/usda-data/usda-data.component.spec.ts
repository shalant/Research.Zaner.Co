import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsdaDataComponent } from './usda-data.component';

describe('UsdaDataComponent', () => {
  let component: UsdaDataComponent;
  let fixture: ComponentFixture<UsdaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsdaDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsdaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
