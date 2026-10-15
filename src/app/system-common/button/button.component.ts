import { SettingService } from 'src/app/system-common/services/setting.service';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
declare const initTooltip: any;
declare const removeTooltip: any;

@Component({
  selector: 'sym-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ButtonComponent implements OnInit {
  /**
   * It is used to apply on class attribute of button that is to be dispalyed.
   * e.g: 'btn_secondary'. Default value is 'btn btn_primary ml-2'
   */
  @Input() class: string;

  /**
   * It is used to set id attribute of button that is to be displayed.
   * e.g: 'btn_Add'. Default value is 'btn_Demo'
   */
  @Input() id: any;

  /**
   * It is used to display the text on the button that is to be displayed.
   * e.g: 'Add'. If no data is passed it will be empty value.
   */
  @Input() text: any;

  /**
   * It is used to display loader inside the button when there is any transactional calls is happening.
   * e.g: true. Defalut value is false.
   */
  @Input() isLoaderRequired: boolean;

  /**
   * It is used to display icon in button.
   * e.g: 'fa fa-sort-down' If no data is passed it will be empty value.
   */
  @Input() iconClass: string;

  /**
   * It is used to display tooltip text on hover of the button.
   * e.g: 'advancedSearch'. If no data is passed it will be empty.
   */
  @Input() tooltip: string;

  /**
   * It is used to disable and enable the button.
   * Defualt value is false. Provided true then it will disable the button
   */
  @Input() isDisabled: boolean;

  /**
   * set to true to autofocus on this button when the page loads
   */
  @Input() autoFocus: boolean;

  /**\
   * This is to determine the position of icon. It could be before text or after text.
   * Default value is 'right'
   * 'left' and 'right' are the values used to position the icon.
   * e.g: [iconPosition]="'left'"
   */
  @Input() iconPosition: string;

  /**\
   * It is used to show text on button in Mobile view.
   * Default value is false
   * e.g: [showTextAlways]="true"
   */

  @Input() showTextAlways: Boolean;

  /**
   * It is triggered when there is a event to emitt on button click.
   * @any EventEmitter<any> parameter will send buttonid from the called component
   *
   */
  @Output() onClick = new EventEmitter<any>();

  constructor(public settingService: SettingService) {
    this.iconPosition = 'right';
    this.showTextAlways = false;
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['tooltip'] && changes['tooltip'].currentValue) {
      if (this.tooltip) {
        this.refreshTooltip();
      }
    }
  }

  ngOnInit() {}
  onButtonClick() {
    if (this.tooltip) {
      this.refreshTooltip();
    }
    if (this.isLoaderRequired) {
      this.settingService.buttonid = this.id;
    }
    this.onClick.emit(this.settingService.buttonid);
  }

  /**
   * @ignore
   */
  refreshTooltip() {
    removeTooltip();

    setTimeout(() => {
      initTooltip();
    }, 5);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isLoaderRequired = false;
    // this.settingService.buttonid = undefined;
  }
}
