import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VVOneStepDownComponent } from './vv-one-step-down.component';

describe('VVOneStepDownComponent', () => {
  let component: VVOneStepDownComponent;
  let fixture: ComponentFixture<VVOneStepDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VVOneStepDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VVOneStepDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
