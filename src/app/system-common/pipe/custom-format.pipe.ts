import { CurrencyPipe, UpperCasePipe, LowerCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFormat',
  standalone: false,
})
export class CustomFormatPipe implements PipeTransform {
  constructor(
    private currencyPipe: CurrencyPipe,
    private uppercasePipe: UpperCasePipe,
    private lowerCasePipe: LowerCasePipe
  ) {}

  transform(value: any, metadata: any): string {
    let formatedValue = value;
    let mask: any = metadata.MASK;
    let caseValue: any = metadata.CASEVALUE;

    if (mask != undefined) {
      let datataype: any = metadata.DATATYPE;
      let maskType: string = undefined;
      let param1: string = undefined;
      let param2: string = undefined;
      let param3: string = undefined;
      let param4: string = undefined;

      let maskarr: string[] = mask.split(':');
      if (maskarr != undefined) {
        maskType = maskarr[0];
        param1 = maskarr.length > 1 ? (maskarr[1] == 'null' ? undefined : maskarr[1]) : undefined;
        param2 = maskarr.length > 2 ? (maskarr[2] == 'null' ? undefined : maskarr[2]) : undefined;
        param3 = maskarr.length > 3 ? (maskarr[3] == 'null' ? undefined : maskarr[3]) : undefined;
        param4 = maskarr.length > 4 ? (maskarr[4] == 'null' ? undefined : maskarr[4]) : undefined;
      }

      // console.log('maskType:' + maskType);
      if (value != '' && value != undefined && value != null) {
        if ((datataype == 'DOUBLE' || datataype == 'BIGDECIMAL') && maskType === 'CURRENCY') {
          //formatedValue = this.numberPipe.transform(value, '1.0-0');
          //strip the value of the formatting and then transform
          let unmaskedValue = typeof value === 'number' ? value : value.replace(/[^\d.-]/g, '');
          if (typeof value === 'number' || (!isNaN(parseFloat(unmaskedValue)) && isFinite(unmaskedValue))) {
            formatedValue = this.currencyPipe.transform(unmaskedValue, param1, param2, param3, param4);
          }
          //console.log('Original value: ' + value + ' , Formatted value: ' + formatedValue);
        }
        //TODO implement for other mask types other pipes
      }
    } else if (caseValue != undefined) {
      if (caseValue === 'UPPER') {
        formatedValue = this.uppercasePipe.transform(value);
      } else if (caseValue === 'LOWER') {
        formatedValue = this.lowerCasePipe.transform(value);
      }
    }
    //field.model[field.fieldCd + '_mk'] = formatedValue;
    //  this.changeDetectorRef.detectChanges();
    return formatedValue;
  }
}
