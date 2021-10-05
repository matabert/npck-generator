import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcDisplayComponent } from './npc-display.component';

describe('NpcDisplayComponent', () => {
  let component: NpcDisplayComponent;
  let fixture: ComponentFixture<NpcDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NpcDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
