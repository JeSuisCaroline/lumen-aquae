import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { TitleComponent } from './title.component';

describe('TitleComponent', () => {
  let component: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render h1 by default', () => {
    component.text = 'Test Title';
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toBe('Test Title');
  });

  it('should render different heading levels', () => {
    component.text = 'Test Title';
    component.level = 'h3';
    fixture.detectChanges();
    const h3 = fixture.nativeElement.querySelector('h3');
    expect(h3).toBeTruthy();
  });

  it('should render description when provided', () => {
    component.text = 'Title';
    component.description = 'Test description';
    fixture.detectChanges();
    const description = fixture.nativeElement.querySelector('.description');
    expect(description).toBeTruthy();
    expect(description.textContent).toBe('Test description');
  });

  it('should not render description when not provided', () => {
    component.text = 'Title';
    fixture.detectChanges();
    const description = fixture.nativeElement.querySelector('.description');
    expect(description).toBeFalsy();
  });
});
