import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGameTypeComponent } from './select-game-type.component';

describe('SelectGameTypeComponent', () => {
  let component: SelectGameTypeComponent;
  let fixture: ComponentFixture<SelectGameTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGameTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGameTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
