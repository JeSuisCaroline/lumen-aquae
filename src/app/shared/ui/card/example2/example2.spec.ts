import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example2 } from './example2';

describe('Example2', () => {
  let component: Example2;
  let fixture: ComponentFixture<Example2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
