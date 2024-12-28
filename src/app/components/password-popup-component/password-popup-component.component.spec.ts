import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPopupComponentComponent } from './password-popup-component.component';

describe('PasswordPopupComponentComponent', () => {
  let component: PasswordPopupComponentComponent;
  let fixture: ComponentFixture<PasswordPopupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordPopupComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordPopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
