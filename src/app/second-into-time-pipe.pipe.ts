import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondIntoTimePipe'
})
export class SecondIntoTimePipePipe implements PipeTransform {

  transform(value: number): string {
    try{
      let hours:number,minutes:number,seconds:number;
      hours = value/3600;
      minutes = (value % 3600) / 60;
      seconds = value % 60;
      return Math.floor(hours).toString().padStart(2,"0") + ":" + Math.floor(minutes).toString().padStart(2,"0") + ":" + Math.floor(seconds).toString().padStart(2,"0");
    }catch{
      return ""
    }
  }

}
