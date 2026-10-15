import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sym-payment-response-email',
  templateUrl: './payment-response-email.component.html',
  styleUrls: ['./payment-response-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PaymentResponseEmailComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
