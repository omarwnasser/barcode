import { Component,ViewChild , ElementRef } from '@angular/core';
import readXlsxFile from 'read-excel-file';
import BwipJs  from 'bwip-js';
import { AppService } from './app.service';
import printd from 'printd'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'barcode';
  dataList : any[] = [];
  header: any[] = [];
  checker : any[]= [];
  @ViewChild('barcode_modal') bm: ElementRef = new ElementRef('') ;
  codetype: string = "code128"

  constructor(public appService: AppService){}


  onSubmit(event: InputEvent|any){
    this.dataList = [];
    this.header = [];
    readXlsxFile(event.target.files[0]).then((rows: any[]) => {
      this.header = rows.shift();
      rows.forEach(e=>{
        let d : any= {};
        this.header?.forEach((el:string,i:number)=>{
          d[this.header[i]] = e[i];
        })
        this.dataList.push(d);
      })
      console.log(this.dataList);

    })
  }

  onCheck(event: any){
    if(event.target.checked){
      this.checker.push(event.target.value);
      this.checker = [...new Set(this.checker)];
    }else{
      this.checker = this.checker.filter(e=> e != event.target.value)
    }
    console.log(this.checker);
  }

  showBarCode(d: any){

    if(this.checker.length){
      this.bm.nativeElement.innerText = '';
      let m = this.checker.map( e=> d[e] ).join(',')
      let canv: HTMLCanvasElement = document.createElement('canvas')
      let img = document.createElement('img');

     try {
      BwipJs.toCanvas(canv,{
        bcid: this.codetype,
        text: `${m}`,
        // includetext: true,
        // textxalign: 'center'
      })
      img.height = 56;
      if(this.codetype == 'qrcode'){
        img.width = 56;
      }else{
        img.width = 150;
      }
      img.src= canv.toDataURL('image/png');

      this.bm.nativeElement.append(img)
     } catch (error) {
       alert(error)
     }
    }else{
      this.bm.nativeElement.innerText = '';
      alert('اختر عامود لتوليد براكود')
    }
  }

  openModel(event: Event){
    this.checker.length ?  event.target?.addEventListener('show.bs.modal',()=>{}): null;
  }

  printBarcode(elem: HTMLElement){
    console.log(elem);

   new printd().print(elem,[
     `
     *{
       margin: auto;
     }
     `
   ],[],({launchPrint})=>{launchPrint()})
  }
}




