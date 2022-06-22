import { Component, OnInit } from '@angular/core';
import { EvaluateMatrixRequest } from 'src/app/Models/Catalog4/MatrixRequest';
import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoHijoModel } from 'src/app/Models/ObjetoHijoModel';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';
import { CatalogService } from 'src/app/services/Catalog/Catalog.service';
import { EvaluationService } from 'src/app/services/Evaluation.service';
import { GLOBAL } from 'src/app/services/global.service';
import { GetParamGlobalService } from 'src/app/services/utilis.service';

import { ReportService } from 'src/app/services/Report/report.service';
import { faChartBar, faPager } from '@fortawesome/free-solid-svg-icons';
import { type } from 'os';


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

@Component({
  selector: 'app-report-evaluation-matrix',
  templateUrl: './report-evaluation-matrix.component.html',
  styleUrls: ['./report-evaluation-matrix.component.css']
})
export class ReportEvaluationMatrixComponent implements OnInit {

  public ctrlFiltersBusqueda: ObjetoModel[] = [];
  public camposHeaderTabla: ObjCamposHeaderTablaHTML[] = [];
  public responseDataGrid: any = [];
  public tmpCampos?: ObjetoModel;
  public busqueda_titulo: String = "Busqueda dinamica de Matrices"
  public titulo: String = "Reporte de matriz";
  public editando: number = 0;
  public active = 1;

  faReport = faChartBar;

  constructor(public matrixServicio: EvaluationService,
    public catalogService: CatalogService,
    public globalParam: GetParamGlobalService,
    public reportService: ReportService
    ,) {

    this.onSearch(25);

  }

  ngOnInit(): void {
  }

  async onSearch(event: any) {

    var tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    let tmpfilterOp: any[];

    //opciones de los items por cual buscar
    tmpfilterOp = [];
    tmpOpciones._indice = "0";
    tmpOpciones._valor = "Seleccione una opcion";
    tmpOpciones._esBusqueda = true;
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "number";
    tmpOpciones._esInactivo= true;
    tmpfilterOp.push(tmpOpciones);

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "1";
    tmpOpciones._valor = "Grupo"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "2";
    tmpOpciones._valor = "Area"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "3";
    tmpOpciones._valor = "Evento"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "4";
    tmpOpciones._valor = "Probabilidad puntaje"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "number"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "5";
    tmpOpciones._valor = "Severidad puntaje"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "number"
    tmpfilterOp.push(tmpOpciones)

    this.ctrlFiltersBusqueda = [];
    //termina opciones de los items por cual buscar

    //inicia para la seccion de filtros en el control de busqueda
    //combo del control de busqueda
    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Codigo";
    this.tmpCampos._placeholder = "Ingrese Codigo";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "seltcodigo";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._optionListJson = tmpfilterOp;
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._valTipoControlHTML = "";
    this.tmpCampos._esCampoBusqueda = true;
    this.tmpCampos._valorSeleccionado = "";
    this.tmpCampos._esMultiSelect = false;
    this.tmpCampos._indice = "0";
    this.tmpCampos._controlBinding = "seltcodigo";
    this.tmpCampos._nombrecampo = "_id";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._rowstxtarea = 2;
    this.ctrlFiltersBusqueda.push(this.tmpCampos);
    //control text del control de busqueda

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Criterio_a_buscar";
    this.tmpCampos._placeholder = "Ingrese valor a buscar";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inpcod";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._optionListJson = [];
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._valTipoControlHTML = "";
    this.tmpCampos._esCampoBusqueda = true;
    this.tmpCampos._valorSeleccionado = "";
    this.tmpCampos._esMultiSelect = false;
    this.tmpCampos._indice = "1";
    this.tmpCampos._controlBinding = "seltcodigo";
    this.tmpCampos._nombrecampo = "_id";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._rowstxtarea = 2;
    this.ctrlFiltersBusqueda.push(this.tmpCampos);
    //boton del control de busqueda
    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "button";
    this.tmpCampos._nombre = "Buscar";
    this.tmpCampos._placeholder = "";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control  btn btn-outline-primary btn-block";
    this.tmpCampos._tipoControlHTML = "Button_";
    this.tmpCampos._idTipoControHTML = "btnSearch";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._optionListJson = [];
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._valTipoControlHTML = "";
    this.tmpCampos._esCampoBusqueda = true;
    this.tmpCampos._valorSeleccionado = "";
    this.tmpCampos._esMultiSelect = false;
    this.tmpCampos._indice = "2";
    this.tmpCampos._nombrecampo = "_id";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._rowstxtarea = 2;

    this.tmpCampos._idBtnHTML = "btnAgregarPosition";
    this.tmpCampos._requiereBtn = true;
    this.tmpCampos._ngClassBtn = "form-control  btn btn-outline-primary btn-block"
    this.tmpCampos._faIconBtn = 1;
    this.ctrlFiltersBusqueda.push(this.tmpCampos);
    //finaliza para la seccion de filtros en el control de busqueda 


    //inicia para la seccion de detalle en el control de busqueda
    // this.camposHeaderTempo = ["Codigo","Nombre","Direccion","Telefono","Estado"];
    //para limpiar los header de la tabla sino se van acumulando los headers.
    this.camposHeaderTabla = [];
    //fin de la limpieza de los header de la tabla
    this.camposHeaderTabla.push(
      { _indice: "6", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "7", _valor: "Grupo", _nomCampo: "_group_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "1", _valor: "Area", _nomCampo: "_area_evaluate_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "2", _valor: "Evento", _nomCampo: "_event_description", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "3", _valor: "Probabilidad", _nomCampo: "_probabilidad", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "4", _valor: "Severidad", _nomCampo: "_severity", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
      { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "1" ,_cssStyle:""},

    );

    //finaliza para la seccion de detalle en el control de busqueda
  }

  inicializarControles() {

  }
  async buscarPor(event: any) {
    let valorTexto: string = "";
    let valorCombo: string = "";

    //obtenemos los arreglos ya configurados segun la seleccion del control devuelto por el 
    //control search
    this.ctrlFiltersBusqueda = event;
    this.ctrlFiltersBusqueda.forEach(Element => {
      if (Element._tipoControlHTML == "Input_") {
        valorTexto = Element._valorSeleccionado;
      } else if (Element._tipoControlHTML == "Select_") {
        Element._optionListJson.forEach(element => {
          if (element._esSeleccionado == true) {
            valorCombo = element._valor;
          };//fin del if interno
        });//fin del segundo foreach
      };//fin del if
    });//fin del primer foreach

    // alert("El campo seleccionado =" + valorCombo + ' y el valor a buscar es = ' + valorTexto);

    let matrixRequest = new EvaluateMatrixRequest(GLOBAL.muni, 0, 0, 0, "", "", "", 0, 0);
    switch (valorCombo) {
      case "codigo":
        matrixRequest._id = parseInt(valorTexto);
        break;

      case "Grupo":
        matrixRequest._group_name = '%' + valorTexto + '%';
        break;

      case "Area":
        matrixRequest._area_name = '%' + valorTexto + '%';
        break;

      case "Evento":
        matrixRequest._event_desc = '%' + valorTexto + '%';
        break;
      case "Probabilidad puntaje":
        matrixRequest._prob_puntaje = parseInt(valorTexto);
        break;
      case "Severidad puntaje":
        matrixRequest._sever_puntaje = parseInt(valorTexto);
        break;

      default:
        break;
    }
    const xxResult = await this.matrixServicio.getMatrixList(matrixRequest, true).toPromise();

    this.responseDataGrid = xxResult;
  }

  rowSelected(event: any) {
    var dataRepo = [];
    dataRepo.push(event);
    this.ejecutarCtrlP("pdfOpen",dataRepo);
  }

  // public pintar_col_span(txt_line: any, numColspan: number, resaltado: boolean, color_letra: string, tamanyo_letra: number, alineado: string, fillColorCell: string) {

  //   return {
  //     columnajsn: {
  //       text: txt_line
  //       , bold: resaltado
  //       , color: color_letra
  //       , colSpan: numColspan
  //       , fontSize: tamanyo_letra
  //       , alignment: alineado
  //       , fillColor: fillColorCell
  //     }
  //   }
  // }


  // buildTableBody(data: any, columns: any, headerConfg: any, titleRep: any) {
  //   var body = [];
  //   // var tituloRep = data[0]._area_evaluate_name;
  //   var numSpanCols = columns.length;
  //   var numRegistros = data.length;

  //   let jsonEnc = this.pintar_col_span(titleRep, numSpanCols, true, 'green', 18, 'center', "");
  //   body.push([jsonEnc.columnajsn, {}, {}, {}, {}, {}, {}, {}, {},{}])

  //   body.push(headerConfg);

  //   data.forEach((row: { [x: string]: any; }) => {
  //     var dataRow: any[] = [];
  //     var fontColor: any;
  //     var fillColor: any;


  //     columns.forEach((column:
  //                     { text: string | number; fontSize: number; condition: any; fontAllign: any }
  //                     ) => {
  //       if (column.condition.length != 0) {
  //         column.condition.forEach((element: any) => {
  //           if (row[column.text] > element.rangOne && row[column.text] < element.rangeTwo) {
  //             fontColor = element.color;
  //             fillColor = element.fillColor;
  //           }
  //         });
  //       }else{
  //         fontColor = "";
  //         fillColor = "";
      
  //       }

  //       var colFormated = this.pintar_col_span(row[column.text], 0, false, fontColor, column.fontSize, column.fontAllign, fillColor);
  //       dataRow.push(colFormated.columnajsn);
  //     })

  //     body.push(dataRow);
  //   });


  //   let jsonFooter = this.pintar_col_span("Total Matrices", numSpanCols - 1, true, 'red', 12, 'left', "");
  //   let jsonTotal = this.pintar_col_span(numRegistros, 0, false, 'red', 12, 'right', "")
  //   body.push([jsonFooter.columnajsn, {}, {}, {}, {}, {}, {}, {},{}, jsonTotal.columnajsn])

  //   return body;
  // }

  // public table_pdf(responseDataGrid: any, arrfanchocol: any, columns: any, headerConfg: any, titleRep: any) {
  //   return {
  //     table: {
  //       headerRows: 2,
  //       widths: arrfanchocol,
  //       body: this.buildTableBody(responseDataGrid, columns, headerConfg, titleRep)

  //     }
  //   };
  // }


  ejecutarCtrlP(Action: string,data:any) {

    var dataReport =[];

    dataReport = data;
    
    let arrHeaderConf = [
      { text: 'Grupo', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Area', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Evento ', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Descripcion', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Probabilidad', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Severidad.', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'valor mitigador', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Riesgo residual', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Control Interno para mitigar', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Obsevaciones', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      
    ];

    let arrfAnchoCol = [];
    arrfAnchoCol[0] = "auto";
    arrfAnchoCol[1] = "auto";
    arrfAnchoCol[2] = "auto";
    arrfAnchoCol[3] = "auto";
    arrfAnchoCol[4] = "auto";
    arrfAnchoCol[5] = "auto";
    arrfAnchoCol[6] = "auto";
    arrfAnchoCol[7] = "auto";
    arrfAnchoCol[8] = "auto";
    arrfAnchoCol[9] = "auto";

    let arrColUseRep = [];
    arrColUseRep[0] = { text: '_group_name', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[1] = { text: '_area_evaluate_name', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[2] = { text: '_event_description', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[3] = { text: 'descriptionRisk', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[4] = { text: '_probabilidad', fontSize: 9, fontAllign: "right", condition: [{margin:[0,15,0,0]}] }
    arrColUseRep[5] = { text: '_severity', fontSize: 9, fontAllign: "right", condition: [{margin:[0,15,0,0]}] }
    arrColUseRep[6] = { text: 'calcResidualRisk', fontSize: 9, fontAllign: "right", condition: [{margin:[0,15,0,0]}] }
    arrColUseRep[7] = {
      text: '_riesgo_residual', fontSize: 9, fontAllign: "center",
      condition: [
        { color: 'white', rangOne: "0", rangeTwo: "10", fillColor: "green" , margin:[0,15,0,0] }
        , { color: 'gray', rangOne: "10.1", rangeTwo: "15", fillColor: "orange" , margin:[0,15,0,0]}
        , { color: 'white', rangOne: "15.1", rangeTwo: "30", fillColor: "red"  , margin:[0,15,0,0]}
      ]
    }
    arrColUseRep[8] = { text: 'internalContollMitigate', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[9] = { text: 'riskRemarks', fontSize: 9, fontAllign: "left", condition: [] }
    
    let arrContent = [{

      text: 'MATRIZ DE EVALUACIÓN DE RIESGOS',
      style: 'sectionHeader'

    }]

        this.reportService.generarPDF(  dataReport, arrfAnchoCol
                                      , arrColUseRep, arrHeaderConf
                                      , arrContent[0].text
                                      , pdfAction.Abrir
                                      , pdfOrientation.LansScape
                                      ,typeReport.Evaluation_Matrix)

    // var pageOrientation: String = 'landscape';

    // let docDefinition = {
    //   // by default we use portrait, you can change it to landscape if you wish
    //   pageOrientation,
    //   content: [
    //     arrContent,
    //     this.table_pdf(dataReport, arrfAnchoCol, arrColUseRep, arrHeaderConf, arrContent[0].text)
    
    //   ],

    // }
    // if (Action === 'pdfDownload') {

    //   pdfMake.createPdf(docDefinition).download();
    // } else if (Action === 'dfPrint') {
    //   pdfMake.createPdf(docDefinition).print();
    // } else if (Action == 'pdfOpen') {
    //   pdfMake.createPdf(docDefinition).open();
    // } else {
    //   pdfMake.createPdf(docDefinition).open();
    // }
  }

  generarReportMatrix(){
    this.ejecutarCtrlP("pdfOpen",this.responseDataGrid);
  }
}
