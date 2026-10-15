import { QuotationPartyComponent } from './../quotation-party/quotation-party.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { JointLifeHandlerComponent } from './joint-life.handler';

@Component({
  selector: 'sym-joint-life',
  templateUrl: './joint-life.component.html',
  styleUrls: ['./joint-life.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class JointLifeComponent extends JointLifeHandlerComponent {}
