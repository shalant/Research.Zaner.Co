import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkToggleComponent } from './dark-toggle.component';

describe('DarkToggleComponent', () => {
  let component: DarkToggleComponent;
  let fixture: ComponentFixture<DarkToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DarkToggleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DarkToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
