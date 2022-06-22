import { Injectable } from '@angular/core';
import { faCrow } from '@fortawesome/free-solid-svg-icons';

const pdfMake = require('pdfmake/build/pdfmake.js');
import * as pdfFonts from "pdfmake/build/vfs_fonts";
//const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

enum pdfAction {
  Descargar = "pdfDownload",
  Imprimir = "dfPrint",
  Abrir = "pdfOpen"
}
enum pdfOrientation {
  LansScape = "landscape",
  Portrait = "portrait"
}


enum typeReport {
  Evaluation_Matrix = "Matrix",
  Evaluation_Plan = "Plan",
  other = ""
}


@Injectable({
  providedIn: 'root'
})


export class ReportService {

  
  constructor() { }


  private pintar_col_span(txt_line: any, numColspan: number, resaltado: boolean, color_letra: string, tamanyo_letra: number, alineado: string, fillColorCell: string,arrMargin:any) {

    return {
      columnajsn: {
        text: txt_line
        , bold: resaltado
        , color: color_letra
        , colSpan: numColspan
        , fontSize: tamanyo_letra
        , alignment: alineado
        , fillColor: fillColorCell
        , margin: arrMargin
      }
    }
  }


 private buildTableBody(data: any, columns: any, headerConfg: any, titleRep: any,tipoReporte : typeReport) {
    var body = [];
    // var tituloRep = data[0]._area_evaluate_name;
    var numSpanCols = columns.length;
    var numRegistros = data.length;
    var arrMargin:number[] = columns.margin;

    let jsonEnc = this.pintar_col_span(titleRep, numSpanCols, true, 'green', 18, 'center', "", arrMargin);

    if(tipoReporte == typeReport.Evaluation_Matrix){
      body.push([jsonEnc.columnajsn, {}, {}, {}, {}, {}, {}, {}, {},{}]);
    }else if(tipoReporte == typeReport.Evaluation_Plan){
      body.push([jsonEnc.columnajsn, {}, {}, {}, {}, {}, {}, {}, {},{},{}]);  
    }

    

    // let row :any= [];
    // let col : any = "";

    // for (let intContador = 0; intContador < numSpanCols; intContador++) {
    //   if(intContador==0){
    //     col =  JSON.stringify(jsonEnc.columnajsn);
    //   // }else if(intContador == numSpanCols-1 ){
    //   //   row.push(jsonTotal);
    // }else if (intContador == numSpanCols-1 ){
    //   col = col + ",{}";
    //   break;  
    // }else{
    //   col = col + ",{}";  
    //   }
      
    // }

    // body.push(col)

    body.push(headerConfg);

    data.forEach((row: { [x: string]: any; }) => {
      var dataRow: any[] = [];
      var fontColor: any;
      var fillColor: any;
      var margingCel:any;

      //read all the properties of column data
      columns.forEach((column:
                      { text: string | number; fontSize: number; condition: any; fontAllign: any }
                      ) => {
        if (column.condition.length != 0) {
          column.condition.forEach((element: any) => {
            if (row[column.text] > element.rangOne && row[column.text] < element.rangeTwo) {
              fontColor = element.color;
              fillColor = element.fillColor;
              margingCel = element.margin;
            }else{
              margingCel = element.margin;              
            }
          });
        }else{
          fontColor = "";
          fillColor = "";
          margingCel = 0;
        }
        

        var colFormated = this.pintar_col_span(row[column.text], 0, false, fontColor, column.fontSize, column.fontAllign, fillColor,margingCel);
        dataRow.push(colFormated.columnajsn);
      })

      body.push(dataRow);
    });

    var margin2:number[]= [0,0,0,0];
    
    let jsonFooter = this.pintar_col_span("Total Matrices", numSpanCols - 1, true, 'red', 12, 'left', "",margin2);
    let jsonTotal = this.pintar_col_span(numRegistros, 0, false, 'red', 12, 'right', "",margin2)


    if(tipoReporte == typeReport.Evaluation_Matrix){
      body.push([jsonFooter.columnajsn, {}, {}, {}, {}, {}, {}, {},{}, jsonTotal.columnajsn]);
    
    }else if(tipoReporte == typeReport.Evaluation_Plan){
      body.push([jsonFooter.columnajsn, {}, {}, {}, {}, {}, {}, {},{},{}, jsonTotal.columnajsn]);
    }

    


    return body;
  }

  private table_pdf(responseDataGrid: any, arrfanchocol: any, columns: any, headerConfg: any, titleRep: any, tipoReporte: typeReport) {


    return {
      table: {
        headerRows: 2,
        widths: arrfanchocol,
        body: this.buildTableBody(responseDataGrid, columns, headerConfg, titleRep,tipoReporte)

      }
    };
  }

  public generarPDF(dataReport: any       , arrfanchocol: any
                    , columns:  any       , headerConfg: any
                    , titleRep: any       ,Action: pdfAction 
                    , paginaOrientacion:pdfOrientation
                    , tipoReporte:typeReport){
    // var pageOrientation: String;

    let arrContent = [{

      text: titleRep,
      style: 'sectionHeader'

    }]


    let docDefinition = {
      // by default we use portrait, you can change it to landscape if you wish
      pageOrientation:paginaOrientacion,
      content: [
        arrContent,
        this.table_pdf (dataReport, arrfanchocol, columns, headerConfg, arrContent[0].text,tipoReporte)

      ],

    }

    if (Action === pdfAction.Descargar) {

      pdfMake.createPdf(docDefinition).download();
    } else if (Action === pdfAction.Imprimir) {
      pdfMake.createPdf(docDefinition).print();
    } else if (Action == pdfAction.Abrir) {
      pdfMake.createPdf(docDefinition).open();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
  

}
