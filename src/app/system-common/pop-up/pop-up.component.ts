import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from '../services/setting.service';

@Component({
  selector: 'sym-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PopUpComponent implements OnInit {
  /**
   * This sets the header text of the pop-up.
   * e.g: 'searchOccupation'
   */
  @Input() headerText: string;

  /**
   * This sets pop-up's id attribute.
   * e.g: 'OccupationIndustryDutySearch'
   */
  @Input() popupID: any;

  /**
   * This is optional input which hides close button if boolean value true is passed. by default the button will be displayed.
   */
  @Input() hideCloseButton: boolean;

  /**
   * This is a optional input which will pop the modal on top instead of centralized.
   * e.g: quotation submissions pop-up
   */
  @Input() displayPopupAtTop: boolean;

  /**
   * This is a optional input which decides size of the pop-up to small, medium or large.
   *  Default it will display 'large' pop-up values expected are 'large','medium','small'
   */
  @Input() popupSize: string;

  /**
   * It expects % value 0-100, min is 40%
   */
  @Input() width: number;
  @Input() height: number;

  @Input() popUpClass: string;
  @Input() headerIcon: string;

  @Input() hidePopLayout: boolean;

  /**
   * It expects % value 0-100, with maxWidth we can set the size of the popup as per requirements
   */
  @Input() maxWidth: number;
  /**
   * It expects % value 0-100, with maxHeight we can set the size of the popup as per requirements
   */
  @Input() maxHeight: number;
  /**
   * Triggered when pop is closed.
   */
  @Output() popupClosed = new EventEmitter<boolean>();

  /**
   * @ignore
   */
  isModalSmallDisplayed: boolean;
  constructor(public settingService: SettingService) {
    this.isModalSmallDisplayed = false;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  onPopUpClose() {
    this.popupClosed.emit(true);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }
}
