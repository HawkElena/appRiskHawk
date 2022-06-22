import { Component, OnInit } from '@angular/core';
import { EvaluatePlanRequest } from 'src/app/Models/Catalog4/PlanModelRequest';
import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoHijoModel } from 'src/app/Models/ObjetoHijoModel';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';
import { CatalogService } from 'src/app/services/Catalog/Catalog.service';
import { EvaluationService } from 'src/app/services/Evaluation.service';
import { GLOBAL } from 'src/app/services/global.service';
import { GetParamGlobalService } from 'src/app/services/utilis.service';

import { ReportService } from 'src/app/services/Report/report.service';
import { faChartBar, faPager } from '@fortawesome/free-solid-svg-icons';


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
  selector: 'app-report-evaluation-plan',
  templateUrl: './report-evaluation-plan.component.html',
  styleUrls: ['./report-evaluation-plan.component.css']
})

export class ReportEvaluationPlanComponent implements OnInit {

  public ctrlFiltersBusqueda      : ObjetoModel[]       = [];
  public camposHeaderTabla        : ObjCamposHeaderTablaHTML[] = [];
  public responseDataGrid:any;
  public tmpCampos?: ObjetoModel;
  public busqueda_titulo: String = "Busqueda dinamica de Plan de Evaluacion"
  public titulo:String = "Plan de Evaluacion" ;
  public editando: number =0 ;
  public active = 1;

  faReport = faChartBar;

  constructor(public planService: EvaluationService,
    public catalogService: CatalogService,
    public transformarFecha: GetParamGlobalService,
    public globalParam: GetParamGlobalService,
    public reportService: ReportService

    ) { 
      
      this.onSearch("algo");

  }

  ngOnInit(): void {
  }

  async onSearch(event: any) {

    // // xxx = Object.assign({}, event);
    // //para limpiar el objeto table del control de busqueda.
    // this.responseDataPlan = [];

    // var tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    // let tmpfilterOp: any[];
    this.responseDataGrid = [];

    var tmpOpciones = 
    new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    let tmpfilterOp: any[];
    tmpfilterOp = [];
    this.ctrlFiltersBusqueda = [];
    this.camposHeaderTabla = [];
    this.busqueda_titulo = "Busqueda ..."
    
    this.busqueda_titulo = "Busqueda de Planes de evaluación";
    //opciones de los items por cual buscar
    tmpfilterOp = [];
    tmpOpciones._indice = "0";
    tmpOpciones._valor = "FechaInicio";
    tmpOpciones._esBusqueda = true;
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = true;
    tmpOpciones._tipoDato = "date";
    tmpfilterOp.push(tmpOpciones);

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "1";
    tmpOpciones._valor = "FechaFin"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "date"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "2";
    tmpOpciones._valor = "Control Recomendado"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "3";
    tmpOpciones._valor = "Riesgo"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "4";
    tmpOpciones._valor = "Matriz riesgo"
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "text"
    tmpfilterOp.push(tmpOpciones)

    tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    tmpOpciones._indice = "5";
    tmpOpciones._valor = "Prioridad"
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
    this.tmpCampos._nombre = "Buscar por";
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
    this.tmpCampos._type = "date";
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
    this.tmpCampos._ngClassBtn ="form-control  btn btn-outline-primary btn-block"
    this.tmpCampos._faIconBtn = 1;
    this.ctrlFiltersBusqueda.push(this.tmpCampos);
    //finaliza para la seccion de filtros en el control de busqueda 


    //inicia para la seccion de detalle en el control de busqueda
    // this.camposHeaderTempo = ["Codigo","Nombre","Direccion","Telefono","Estado"];
    //para limpiar los header de la tabla sino se van acumulando los headers.
    this.camposHeaderTabla = [];
    //fin de la limpieza de los header de la tabla
    this.camposHeaderTabla.push(
      { _indice: "6", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "0", _valor: "Proridad", _nomCampo: "_priority_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "1", _valor: "FechaInicio", _nomCampo: "startdate", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "2", _valor: "FechaFin", _nomCampo: "enddate", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "3", _valor: "Matrix de evaluacion", _nomCampo: "_matrix", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "4", _valor: "Matrix Riesgo", _nomCampo: "_matrix_riesgo", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:"anchoColumna"},
      { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"1" ,_cssStyle:""},

    );
    //finaliza para la seccion de detalle en el control de busqueda
  }
  
  inicializarControles(){

  }
  async buscarPor(event:any){
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

    let planRequest = new EvaluatePlanRequest(GLOBAL.muni,"","","","",0,"",[],"",0);
    switch (valorCombo) {
      // case "codigo":
      //   planRequest._id = parseInt(valorTexto);
      //   break;

      case "FechaInicio":
        planRequest._startDate =  valorTexto ;
        break;

      case "fechaFin":
        planRequest._endDate =  valorTexto ;
        break;

      case "Control Recomendado":
        planRequest._controlRecomend = '%' + valorTexto + '%';
        break;
      case "Riesgo":
        planRequest._riesgo ='%' + valorTexto + '%';
        break;
      case "Matriz":
        planRequest._matrixa_id = parseInt(valorTexto);
        break;

      case "Prioridad":
        planRequest._priority_name = '%' + valorTexto + '%';
        break;

      default:
        break;
    }

    const xxResult = await this.planService.getPlanList(planRequest, true).toPromise();
    // const xxResultSuscribe = await this.hospitalServicio.getHospitalNoPromise(hospitalRegistro)
    //                   .subscribe(data =>{

    //                     this.responseDataHospital = data;
    //                     for (let intContador = 0; intContador < data.length; intContador++) {
    //                       const xxx = data[intContador];
    //                       // var obj = JSON.parse(xxx);
    //                       // var length = Object.keys(obj).length; //you get length json result 4
    //                         console.log(data[intContador].keys())

    //                     }
    //                   });

    // this.xxxResponseDataHawk = xxResult;
    // this.xxxResponseDataHawk = [
    //   {
    //     "id":0, 
    //     "name":"fffdsf"
    //     ,"address":"testtt"
    //     ,"phone":"543543"
    //     ,"status":"2"
    //   },
    //   {
    //     "id":0, 
    //     "name":"fffdsf"
    //     ,"address":"testtt"
    //     ,"phone":"543543"
    //     ,"status":"2"
    //   }
    //   ]; 
    // this.responseDataHospital = xxResult;
     this.responseDataGrid = xxResult;
  }

  rowSelected(event: any) {
    var dataRepo = [];
    dataRepo.push(event);
    this.ejecutarCtrlP("pdfOpen",dataRepo);
  }

  
  ejecutarCtrlP(Action: string,data:any) {

    var dataReport =[];

    dataReport = data;
    
    let arrHeaderConf = [
      { text: 'Riesgo', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Ref. Tipo Riesgo', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Nivel de Riesgo Residual', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Controles Recomendados', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Prioridad de Implementacion', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Controles para Implementacion', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Recursos Internos o Externos', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Puesto Responsable', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Fecha Inicio', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Fecha Fin', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      , { text: 'Comentarios', fillColor: '#555555', color: '#00FFFF', fontSize: '9' , alignment:"center"}
      
    ];

    let arrHeadRow = [];
    arrHeadRow[0] = 90;
    arrHeadRow[1] = 40;
    arrHeadRow[2] = 50;
    arrHeadRow[3] = 75;
    arrHeadRow[4] = 65;
    arrHeadRow[5] = 75;
    arrHeadRow[6] = "auto";
    arrHeadRow[7] = "auto";
    arrHeadRow[8] = "auto";
    arrHeadRow[9] = "auto";
    arrHeadRow[10] = 90;

    let arrColUseRep = [];
    arrColUseRep[0] = { text: '_matrix_riesgo', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[1] = { text: '_matrix', fontSize: 9, fontAllign: "center", condition: [{margin:[0,35,0,0]}] }
    arrColUseRep[2] = {
      text: '_riesgo_residual', fontSize: 9, fontAllign: "center",
      condition: [
        { color: 'white', rangOne: "0", rangeTwo: "10", fillColor: "green" , margin:[0,35,0,0] }
        , { color: 'gray', rangOne: "10.1", rangeTwo: "15", fillColor: "orange" , margin:[0,35,0,0] }
        , { color: 'white', rangOne: "15.1", rangeTwo: "30", fillColor: "red" , margin:[0,35,0,0] }
      ]
    }
    arrColUseRep[3] = { text: 'recomendations', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[4] = { text: '_priority_name', fontSize: 9, fontAllign: "center", condition: [{margin:[0,35,0,0] }] }
    arrColUseRep[5] = { text: 'implement_control', fontSize: 9, fontAllign: "left", condition: [] }
    arrColUseRep[6] = { text: 'yyyy', fontSize: 9, fontAllign: "center", condition: [] }
    arrColUseRep[7] = { text: 'yyyy', fontSize: 9, fontAllign: "right", condition: [] }
    arrColUseRep[8] = { text: 'startdate', fontSize: 9, fontAllign: "left", condition: [{margin:[0,35,0,0] }] }
    arrColUseRep[9] = { text: 'enddate', fontSize: 9, fontAllign: "left", condition: [{margin:[0,35,0,0] }] }
    arrColUseRep[10] = { text: 'remarks', fontSize: 9, fontAllign: "left", condition: [] }
    
    
    let arrContent = [{

      text: 'PLAN DE TRABAJO DE EVALUACIÓN DE RIESGOS',
      style: 'sectionHeader'

    }]

        this.reportService.generarPDF(  dataReport, arrHeadRow
                                      , arrColUseRep, arrHeaderConf
                                      , arrContent[0].text
                                      , pdfAction.Abrir
                                      , pdfOrientation.LansScape
                                      ,typeReport.Evaluation_Plan)

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

  generarReportPlan(){
    this.ejecutarCtrlP("pdfOpen",this.responseDataGrid);
  }
}
