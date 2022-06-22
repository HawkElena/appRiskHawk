import { Component, OnInit } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { async } from 'rxjs/internal/scheduler/async';
import { AreaModel } from 'src/app/Models/Catalog2/AreaModel';
import { EventModel } from 'src/app/Models/Catalog3/EventModel';
import { GroupModel } from 'src/app/Models/Catalog1/GroupModel';
import { ProbabilityModel } from 'src/app/Models/Catalog2/ProbabilityModel';
import { MatrixModel } from 'src/app/Models/Catalog4/MatrixModel';
import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoHijoModel } from 'src/app/Models/ObjetoHijoModel';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';
import { CatalogService } from 'src/app/services/Catalog/Catalog.service';
import { GLOBAL } from 'src/app/services/global.service';
import { EvaluationService } from 'src/app/services/Evaluation.service';
import { UserControlFormComponent } from '../../Control-de-usuario/user-control-form/user-control-form.component';
import { SeverityModel } from 'src/app/Models/Catalog2/SeverityModel';
import { EvaluateMatrixRequest } from 'src/app/Models/Catalog4/MatrixRequest';
import { RiskToleranceModel } from 'src/app/Models/Catalog2/RiskToleranceModel';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})

export class MatrixComponent implements OnInit {
  // aqui se hace una instancia del control para poder levantar el evento refreshEvent para 
  // limpiar los controles sino no se puede ejecutar el limpiar controles
  public usercontrolFormComponent = new UserControlFormComponent();

  public titulo: String = "Matriz de evaluacion";
  public busqueda_titulo: String = "Busqueda dinamica de Matrices"

  // para cargar los valores de los items temporal
  public tmpCampos: ObjetoModel;
  // para cargar los items del combo temporal
  public tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");   //para los items del combogrupo
  //para cargar el control del formulario
  public MatrixControls: ObjetoModel[] = [];
  //para cargar los diferentes items en el combo
  public CamposCombo: ObjetoHijoModel[] = [];  //para el objeto grupo

  // public responseDataHospital     : MatrixModel[]       = [];
  public responseDataGroup: GroupModel[] = [];
  public responseDataArea: AreaModel[] = [];
  public responseDataEvent: EventModel[] = [];
  public responseDataProbability: ProbabilityModel[] = [];
  public responseDataSeverity: SeverityModel[] = [];
  public responseDataMatrix: MatrixModel[] = [];
  public responseDataRiskTolerance: RiskToleranceModel[] = [];


  public closeResult: string = "";
  //parametros para enviar al control de busqueda
  public camposHeaderTabla: ObjCamposHeaderTablaHTML[] = [];
  // public camposHeaderTempo        = ["Grupo", "Area", "Evento", "Probabilidad", "Severidad"];
  public ctrlFiltersBusqueda: ObjetoModel[] = [];
  //variable que almacena el calculo para ingresarlo al calculo riesgo inherente
  public intValorInherente: number = 0;
  public intValorProbabilidad: number = 0;
  public intValorSeveridad: number = 0;
  public tmpIntValorCalcResidual: number = 0;
  // public tmpBorrarValor           : string ="";

  //cuando se realiza la busqueda se asigna el valor de estos campos temporales 
  // ya que por ultimo se ejecuta las cargas de area, y evento para pasarle estos valore
  public tmpSelectGrupo_id: number = 0;
  public tmpSelectIdArea_id: number = 0;
  public tmpSelectIdEvent_id: number = 0;
  public tmpRiskTolerance_id: number = 0;


  constructor(
    public modalService: NgbModal
    , public matrixServicio: EvaluationService
    , public catalogService: CatalogService
  ) {


    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);

    // begin reorder hawk
    this.inicializarControles();

    // // carga de los distintos items para cada combo
    // this.LoadComboGroup();
    // this.loadComboProbability();
    // this.loadComboSeverity();
    // this.loadDataResponseRiskTolerance();
    // //begin reorder hawk
  }

  ngOnInit(
  ): void {
    // this.inicializarControles();

  }

  /**--------------------------------------INICIO PANTALLAS MODALES--------------------------------------- */
  open(content: any) {

    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**-----------------------------------FIN MODALES--------------------------------------------------- */


  async onSearch(event: any) {

    // xxx = Object.assign({}, event);
    //para limpiar el objeto table del control de busqueda.
    this.responseDataMatrix = [];

    var tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    let tmpfilterOp: any[];

    //opciones de los items por cual buscar
    tmpfilterOp = [];
    tmpOpciones._indice = "0";
    tmpOpciones._valor = "codigo";
    tmpOpciones._esBusqueda = true;
    tmpOpciones._estilosCSS = "";
    tmpOpciones._esSeleccionado = false;
    tmpOpciones._tipoDato = "number";
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
      { _indice: "6", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "",_cssStyle:""},
      { _indice: "1", _valor: "Area", _nomCampo: "_area_evaluate_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "",_cssStyle:""},
      { _indice: "2", _valor: "Evento", _nomCampo: "_event_description", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "",_cssStyle:""},
      { _indice: "3", _valor: "Probabilidad", _nomCampo: "_probabilidad", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "",_cssStyle:""},
      { _indice: "4", _valor: "Severidad", _nomCampo: "_severity", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "",_cssStyle:""},
      { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "1",_cssStyle:""},

    );
    //finaliza para la seccion de detalle en el control de busqueda
  }

  async buscarMatrix(event: any) {
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
    this.responseDataMatrix = xxResult;

  }

  inicializarControles() {

    ///begin reorder hawk
    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Codigo";
    this.tmpCampos._placeholder = "codigo auto-generado";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inpcod";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._optionListJson = [];
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = true;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "0";
    this.tmpCampos._nombrecampo = "id";
    this.MatrixControls.push(this.tmpCampos);

    // inicia el combo grupo
    // this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    // this.tmpItemsCombo._indice = "-1";
    // this.tmpItemsCombo._valor = "Seleccione un Grupo";
    // this.tmpItemsCombo._esSeleccionado = true;
    // this.tmpItemsCombo._esInactivo = true;
    // this.tmpItemsCombo._valorCampo = "-1"
    // this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Grupo";
    this.tmpCampos._placeholder = "Seleccione un grupo";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optGrupo";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "1";
    this.tmpCampos._nombrecampo = "_group_id";
    // this.tmpCampos._nombrecampo       = ""
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });

    this.MatrixControls.push(this.tmpCampos);
    // finaliza el combo grupo
    ///end reorder hawk

    // inicia el combo  de los area
    this.CamposCombo = [];
    this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    this.tmpItemsCombo._indice = "-1";
    this.tmpItemsCombo._valor = "Seleccione una area";
    this.tmpItemsCombo._esSeleccionado = true;
    this.tmpItemsCombo._esInactivo = true;
    this.tmpItemsCombo._valorCampo = "-1"
    this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Area";
    this.tmpCampos._placeholder = "Seleccione Area";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optArea";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "2"
    this.tmpCampos._nombrecampo = "_area_id";
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });

    this.MatrixControls.push(this.tmpCampos);

    // termina el combo  de los area

    // inicia para el combo Evento 
    this.CamposCombo = [];
    this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    this.tmpItemsCombo._indice = "-1";
    this.tmpItemsCombo._valor = "Seleccione un evento";
    this.tmpItemsCombo._esSeleccionado = true;
    this.tmpItemsCombo._esInactivo = true;
    this.tmpItemsCombo._valorCampo = "-1"
    this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Evento";
    this.tmpCampos._placeholder = "Seleccione un evento";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optEvento";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "3"
    this.tmpCampos._nombrecampo = "event_id"
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });

    this.MatrixControls.push(this.tmpCampos);

    // finaliza para el combo Evento 


    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "descripción";
    this.tmpCampos._placeholder = "Ingrese Descripción del Riesgo";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpdescriptionRisk";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "4";
    this.tmpCampos._nombrecampo = "descriptionRisk";
    this.MatrixControls.push(this.tmpCampos);

    // //begin reorder hawk
    // inicia para el combo probabilidad
    this.CamposCombo = [];
    this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    this.tmpItemsCombo._indice = "-1";
    this.tmpItemsCombo._valor = "Seleccione una probabilidad";
    this.tmpItemsCombo._esSeleccionado = true;
    this.tmpItemsCombo._esInactivo = true;
    this.tmpItemsCombo._valorCampo = "-1"
    this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Probabilidad";
    this.tmpCampos._placeholder = "Seleccione probabilidad";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optProbabilidad";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 2;
    this.tmpCampos._indice = "5";
    this.tmpCampos._nombrecampo = "probId";
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });
    this.MatrixControls.push(this.tmpCampos);
    // finaliza para el combo probabilidad

    // inicia para el combo severidad
    this.CamposCombo = [];
    this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    this.tmpItemsCombo._indice = "-1";
    this.tmpItemsCombo._valor = "Seleccione severidad";
    this.tmpItemsCombo._esSeleccionado = true;
    this.tmpItemsCombo._esInactivo = true;
    this.tmpItemsCombo._valorCampo = "-1"
    this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "severidad";
    this.tmpCampos._placeholder = "Seleccione severidad";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optSeveridad";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 2;
    this.tmpCampos._indice = "6";
    this.tmpCampos._nombrecampo = "severId";
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });
    this.MatrixControls.push(this.tmpCampos);
    // finaliza para el combo severidad

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Riesgo inherente";
    this.tmpCampos._placeholder = "";
    this.tmpCampos._maximolargo = "2";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inherentRisk";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._valorSeleccionado = this.intValorInherente.toString();
    this.tmpCampos._valTipoControlHTML = this.intValorInherente.toString();
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = true;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 2;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "7";
    this.tmpCampos._nombrecampo = "inherentRisk"
    this.MatrixControls.push(this.tmpCampos);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Valor Control Mitigador";
    this.tmpCampos._placeholder = "Ingrese Val. Control Mitigador";
    this.tmpCampos._maximolargo = "2";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "_valor_mitigador";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 2;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "8";
    this.tmpCampos._nombrecampo = "_valor_mitigador"
    this.tmpCampos._readonly = false;
    this.MatrixControls.push(this.tmpCampos);


    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "RiesgoResidual";
    this.tmpCampos._placeholder = "riesgoResidual";
    this.tmpCampos._maximolargo = "2";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp bg-light textWhite";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "riskResidual";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 4;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "20";
    this.tmpCampos._nombrecampo = "_riskResidual"
    this.tmpCampos._readonly = true;
    this.MatrixControls.push(this.tmpCampos);

    // label success

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Control interno para mitigar";
    this.tmpCampos._placeholder = "Ingrese control interno para mitigar el riesgo";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpinternalContollMitigate";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._valorSeleccionado = "love"
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "9";
    this.tmpCampos._nombrecampo = "internalContollMitigate";
    this.MatrixControls.push(this.tmpCampos);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Observaciones";
    this.tmpCampos._placeholder = "Ingrese Observaciones";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpriskRemarks";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "10";
    this.tmpCampos._nombrecampo = "riskRemarks";
    this.MatrixControls.push(this.tmpCampos);
    //end reorder hawk


    // carga de los distintos items para cada combo
    this.LoadComboGroup();
    this.loadComboProbability();
    this.loadComboSeverity();
    this.loadDataResponseRiskTolerance();
        //begin reorder hawk
  }

  reiniciarCombos() {
    this.MatrixControls.forEach(element => {
      if ((element._idTipoControHTML == "optArea" || element._idTipoControHTML == "optEvento") && element._tipoControlHTML == "Select_") {
        element._optionListJson.splice(1, element._optionListJson.length);
        // hacer que se seleccione el elemento de indice -1
        element._optionListJson.forEach(element => {
          element._esSeleccionado = true;
        });
      }
    })

  }

  CalcValorInherente(intValorCalcular: number, esProb: boolean = true) {
    switch (esProb) {
      case true:
        this.intValorProbabilidad = intValorCalcular
        this.intValorInherente = this.intValorProbabilidad * this.intValorSeveridad;
        this.MatrixControls.forEach(Element => {
          if (Element._idTipoControHTML == "inherentRisk" && Element._tipoControlHTML == "Input_") {
            Element._valorSeleccionado = this.intValorInherente.toString();
          };
        });

        break;
      case false:
        this.intValorSeveridad = intValorCalcular;
        this.intValorInherente = this.intValorSeveridad * this.intValorProbabilidad
        this.MatrixControls.forEach(Element => {
          if (Element._idTipoControHTML == "inherentRisk" && Element._tipoControlHTML == "Input_") {
            Element._valorSeleccionado = this.intValorInherente.toString();
          };
        });
        break;
      default:
        break;
    }
  }

  calcRiesgoResidual(intValMitigador: number) {
    var tmpValorResultado: number = 0;
    // aqui hay que llamar el id del calculo residual para que concuerde

    if (intValMitigador !== 0 && this.intValorInherente !== 0) {
      tmpValorResultado = this.intValorInherente / intValMitigador;
      this.responseDataRiskTolerance.forEach(item => {
        if (tmpValorResultado >= item.min && tmpValorResultado <= item.max) {
          //tmpValResDataRiskToleranceS = item.criteria; 
          this.tmpRiskTolerance_id = item.id;
          this.MatrixControls[9]._placeholder = item.criteria;
          this.MatrixControls[9]._valorSeleccionado = this.MatrixControls[9]._placeholder;
        };

      });
    }


    // this.MatrixControls[9]._readonly=false;
    if (tmpValorResultado < 0 || tmpValorResultado == 0) {
      this.MatrixControls[9]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite ";
      this.MatrixControls[9]._ngClass     = "bg-white";
      this.MatrixControls[9]._placeholder = "";
      this.MatrixControls[9]._valorSeleccionado = this.MatrixControls[9]._placeholder;


    } else if (tmpValorResultado > 0 && tmpValorResultado < 10.01) {
      this.MatrixControls[9]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite";
      this.MatrixControls[9]._ngClass     = "bg-success";


    } else if (tmpValorResultado > 10 && tmpValorResultado < 15.01) {
      this.MatrixControls[9]._estilosCSS  = "form-control tamanyo_letra_inputp textDark  ";
      this.MatrixControls[9]._ngClass     = "bg-warning";


    } else if (tmpValorResultado > 15 && tmpValorResultado < 30) {
      this.MatrixControls[9]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite";
      this.MatrixControls[9]._ngClass     = " bg-danger ";

    };
  }

  async LoadComboGroup(isFirstLoad: boolean = true) {

    var groupRegistro = new GroupModel(0, 0, "", 0, "");

    groupRegistro.muni_id = GLOBAL.muni;
    groupRegistro.id = 0;
    groupRegistro.name = "%%";
    groupRegistro._opcionDML = 4
    groupRegistro._message = "";

    this.catalogService.getListCatalog(groupRegistro, "GrupoServicio").subscribe(
      response => {
        this.CamposCombo = [];
        this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
        this.tmpItemsCombo._indice = "-1";
        this.tmpItemsCombo._valor = "Seleccione un Grupo";
        this.tmpItemsCombo._esSeleccionado = true;
        this.tmpItemsCombo._esInactivo = true;
        this.tmpItemsCombo._valorCampo = "-1"
        this.CamposCombo.push(this.tmpItemsCombo);

        this.responseDataGroup = response;
        this.responseDataGroup.forEach(element => {
          this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
          this.tmpItemsCombo._indice = element.id.toString();
          this.tmpItemsCombo._valor = element.name;
          this.tmpItemsCombo._esInactivo = false;
          this.tmpItemsCombo._valorCampo = element.id.toString();
          this.CamposCombo.push(this.tmpItemsCombo);
        })

        this.CamposCombo.forEach(element => {
          this.MatrixControls.forEach(elementA => {
            if (elementA._tipoControlHTML == "Select_" && elementA._idTipoControHTML == "optGrupo") {
              elementA._optionListJson.push(element);
            };//fin del compara si es un combo y si es el group
          });//fin del foreach que recorre todos los elementos del objeto que contiene los controles de la matrix
        });//fin del foreach del combo temporal que trae la data que se le asigno con el response del servicio.

        //this.MatrixControls.push(this.tmpCampos);
        if (isFirstLoad) {
          //this.inicializarControles();
        }

      },
      error => {
        alert('hubo error al cargar el servicio');
      }
    )

  }

  async LoadComboArea(valor_id_recibir: number) {

    var areaRegistro = new AreaModel(0, 0, "", 0, 0, "");

    areaRegistro.muni_id = GLOBAL.muni;
    areaRegistro.id = 0;
    areaRegistro.name = "%%";
    areaRegistro.group_area_id = valor_id_recibir;
    areaRegistro._opcionDML = 5
    areaRegistro._message = "";

    this.catalogService.getListCatalog(areaRegistro, "AreaServicio").subscribe(
      response => {

        this.responseDataArea = response;

        this.MatrixControls.forEach(element => {
          if (element._idTipoControHTML == "optArea" && element._tipoControlHTML == "Select_") {
            element._optionListJson.splice(1, element._optionListJson.length);
            // hacer que se seleccione el elemento de indice -1
            element._optionListJson.forEach(elements => {
              if (this.tmpSelectIdArea_id === 0) {
                elements._esSeleccionado = true;
              } else {
                elements._esSeleccionado = false;
              }
            });

            //recorrer el resultset que devolvio el servicio y asignarlos al objeto combo.
            this.responseDataArea.forEach(elements => {
              this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
              this.tmpItemsCombo._indice = elements.id.toString();
              this.tmpItemsCombo._valor = elements.name;
              this.tmpItemsCombo._esInactivo = false;
              if (this.tmpSelectIdArea_id === elements.id) {
                this.tmpItemsCombo._esSeleccionado = true;
              } else {
                this.tmpItemsCombo._esSeleccionado = false;
              }
              this.tmpItemsCombo._valorCampo = elements.id.toString();
              element._optionListJson.push(this.tmpItemsCombo);
            })


          }
        });

        this.tmpSelectIdArea_id = 0;

      },
      error => {
        alert('hubo error al cargar el servicio AreaServicio');
      });

  }

  async LoadComboEvent(valor_id_recibir: number) {
    var eventoRegistro = new EventModel(0, 0, "", 0, 0, "");

    eventoRegistro.muni_id = GLOBAL.muni;
    eventoRegistro.id = 0;
    eventoRegistro.name = "%%";
    eventoRegistro.evaluate_id = valor_id_recibir;
    eventoRegistro._opcionDML = 5;
    eventoRegistro._message = "";

    this.catalogService.getListCatalog(eventoRegistro, "EventoServicio").subscribe(
      response => {
        this.responseDataEvent = response;

        this.MatrixControls.forEach(element => {
          if (element._idTipoControHTML == "optEvento" && element._tipoControlHTML == "Select_") {
            element._optionListJson.splice(1, element._optionListJson.length);
            // hacer que se seleccione el elemento de indice -1
            element._optionListJson.forEach(elements => {
              if (this.tmpSelectIdEvent_id === 0) {
                elements._esSeleccionado = true;
              } else {
                elements._esSeleccionado = false;
              }

            });

            //recorrer el resultset que devolvio el servicio y asignarlos al objeto combo.
            this.responseDataEvent.forEach(elements => {
              this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
              this.tmpItemsCombo._indice = elements.id.toString();
              this.tmpItemsCombo._valor = elements.name;
              this.tmpItemsCombo._esInactivo = false;
              if (this.tmpSelectIdEvent_id === elements.id) {
                this.tmpItemsCombo._esSeleccionado = true;
              } else {
                this.tmpItemsCombo._esSeleccionado = false;
              }

              this.tmpItemsCombo._valorCampo = elements.id.toString();
              element._optionListJson.push(this.tmpItemsCombo);
            });

          }
        });


        this.tmpSelectIdEvent_id = 0;
      },
      error => {
        alert('hubo error al cargar el servicio AreaServicio');
      });


  }

  async loadComboProbability() {
    var probabilityRegistro = new ProbabilityModel(0, 0, "", 0, 0, 0, "");

    probabilityRegistro.muni_id = GLOBAL.muni;
    probabilityRegistro.id = 0;
    probabilityRegistro.name = "%%";

    probabilityRegistro._opcionDML = 4
    probabilityRegistro._message = "";

    this.catalogService.getListCatalog(probabilityRegistro, "ProbabilidadServicio").subscribe(
      response => {

        this.CamposCombo = [];

        this.responseDataProbability = response;
        this.responseDataProbability.forEach(element => {
          this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
          this.tmpItemsCombo._indice = element.id.toString();
          this.tmpItemsCombo._valor = element.prob_puntaje.toString();
          this.tmpItemsCombo._esInactivo = false;
          this.tmpItemsCombo._valorCampo = element.id.toString();
          this.CamposCombo.push(this.tmpItemsCombo);
        })

        this.CamposCombo.forEach(element => {
          this.MatrixControls.forEach(elementA => {
            if (elementA._tipoControlHTML == "Select_" && elementA._idTipoControHTML == "optProbabilidad") {
              elementA._optionListJson.push(element);
            };//fin del compara si es un combo y si es el group
          });//fin del foreach que recorre todos los elementos del objeto que contiene los controles de la matrix
        });//fin del foreach del combo temporal que trae la data que se le asigno con el response del servicio.



      }, error => {
        alert(error)
      }
    );

  }

  async loadComboSeverity() {
    var severityRegistro = new SeverityModel(0, 0, "", 0, 0, 0, "");

    severityRegistro.muni_id = GLOBAL.muni;
    severityRegistro.id = 0;
    severityRegistro.name = "%%";

    severityRegistro._opcionDML = 4
    severityRegistro._message = "";

    this.catalogService.getListCatalog(severityRegistro, "SeveridadServicio").subscribe(
      response => {
        this.CamposCombo = [];

        this.responseDataSeverity = response;
        this.responseDataSeverity.forEach(element => {
          this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
          this.tmpItemsCombo._indice = element.id.toString();
          this.tmpItemsCombo._valor = element.puntaje.toString();
          this.tmpItemsCombo._esInactivo = false;
          this.tmpItemsCombo._valorCampo = element.id.toString();
          this.CamposCombo.push(this.tmpItemsCombo);
        })


        this.CamposCombo.forEach(element => {
          this.MatrixControls.forEach(elementA => {
            if (elementA._tipoControlHTML == "Select_" && elementA._idTipoControHTML == "optSeveridad") {
              elementA._optionListJson.push(element);
            };//fin del compara si es un combo y si es el group
          });//fin del foreach que recorre todos los elementos del objeto que contiene los controles de la matrix
        });//fin del foreach del combo temporal que trae la data que se le asigno con el response del servicio.

      }, error => {
        alert(error);
      }
    );
  }

  async loadDataResponseRiskTolerance() {
    var RiskToleranceRegistro = new RiskToleranceModel(0, 0, "", 0, 0, "", 0, 0, "");

    RiskToleranceRegistro.muni_id = GLOBAL.muni;
    RiskToleranceRegistro.id = 0;
    RiskToleranceRegistro.description = "%%";
    RiskToleranceRegistro.min = 0;
    RiskToleranceRegistro.max = 0;
    RiskToleranceRegistro.priority_id = 1;
    RiskToleranceRegistro._message = "";
    RiskToleranceRegistro._opcionDML = 4;

    this.catalogService.getListCatalog(RiskToleranceRegistro, "RiskToleranceServicio").subscribe(
      response => {
        this.CamposCombo = [];
        this.responseDataRiskTolerance = response;
      }, error => {
        alert(error);
      }
    )
  }

  
  changeInputEvent(event: any) {
    var objPadre = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    //var inputResponse = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true,0,0);

    objPadre = event;
    //this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp bg-light";

    switch (objPadre._idTipoControHTML) {
      case "_valor_mitigador":
        // var tmpValorResultado: number = 0;

        this.calcRiesgoResidual(parseInt(objPadre._valorSeleccionado));
        break;

      default:
        break;
    }
  }

  selectItemEvent(event: any) {
    var objPadre = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    var objHijo = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");

    objPadre = event;
    //recorrer el objeto padre que devuelve 
    objPadre._optionListJson.forEach(element => {
      if (element._esSeleccionado) {
        objHijo = element;
      }
    });

    switch (objPadre._idTipoControHTML) {
      case "optGrupo":
        this.reiniciarCombos();
        this.LoadComboArea(parseInt(objHijo._valorCampo));
        break;
      case "optArea":
        this.LoadComboEvent(parseInt(objHijo._valorCampo));
        break;

      case "optEvento":
        //alert("entro ..." + objHijo._valor);
        break;
      case "optProbabilidad":
        this.CalcValorInherente(parseInt(objHijo._valor), true);

        break;
      case "optSeveridad":
        this.CalcValorInherente(parseInt(objHijo._valor), false);
      
        break;

      default:
        break;
    }

    if (objPadre._idTipoControHTML == "optProbabilidad" || objPadre._idTipoControHTML == "optSeveridad") {
      var valorCtrlMitigador = this.MatrixControls[8]._valorSeleccionado;

      if (this.MatrixControls[8]._valorSeleccionado.length != 0) {
        this.calcRiesgoResidual(parseInt(this.MatrixControls[8]._valorSeleccionado));
      }

    }

  }

  clearForm(event: any) {
    var objPadre: ObjetoModel[] = [];
    objPadre = event;

    this.intValorProbabilidad = 0;
    this.intValorSeveridad = 0;
    this.intValorInherente = 0;

    objPadre.forEach(element => {
      if (element._idTipoControHTML == "inherentRisk" && element._tipoControlHTML == "Input_") {
        element._valorSeleccionado = this.intValorInherente.toString();
      };
      if (element._tipoControlHTML == "TextArea_") {
        element._ngModelarr = "";
      };
    });

    this.MatrixControls[9]._estilosCSS = "form-control tamanyo_letra_inputp textWhite ";
    this.MatrixControls[9]._ngClass = "bg-white";
    this.MatrixControls[9]._placeholder = "";
    this.MatrixControls[9]._valorSeleccionado = this.MatrixControls[9]._placeholder;


  }

  guardarMatrix(event: any) {
    var objControlsave = event;

      var GuardarRegistro = new MatrixModel(0, 0, 0, "", 0, 0, 0, 0, 0, "", "", "", "", "", "", "", 0, 0, "", "", "", "", 0,0);
      
        if (this.MatrixControls[0]._valorSeleccionado > "0") {
          GuardarRegistro._opcionDML = 3;
        } else if (this.MatrixControls[0]._valorSeleccionado == "") {
          GuardarRegistro._opcionDML = 1;
        }

        //inicio llenar el arreglo para grabar
        GuardarRegistro.id = parseInt(this.MatrixControls[0]._valorSeleccionado);
        GuardarRegistro.muni_id = GLOBAL.muni;
        GuardarRegistro.descriptionRisk = this.MatrixControls[4]._ngModelarr;
        GuardarRegistro.riskRemarks = this.MatrixControls[11]._ngModelarr; //OBSERVACIONES
        GuardarRegistro.inherentRisk = parseInt(this.MatrixControls[7]._valorSeleccionado);
        
        //hawk-warning temporal para la presentacion
        GuardarRegistro.calcResidualRisk = parseInt(this.MatrixControls[8]._valorSeleccionado); //verificar si en verdad necesita este valor para relacionarlo
        //hawk-warning temporal para la presentacion
        
        GuardarRegistro.internalContollMitigate = this.MatrixControls[10]._ngModelarr;
        this.MatrixControls[3]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            GuardarRegistro.event_id = parseInt(item._valorCampo);
          }
        })
        this.MatrixControls[5]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            GuardarRegistro.probId = parseInt(item._valorCampo);
          }
        })
        this.MatrixControls[6]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            GuardarRegistro.severId = parseInt(item._valorCampo);
          }
        })

        GuardarRegistro.toleranceId = this.tmpRiskTolerance_id;
        if(confirm("¿Desea grabar este registro?")){
          this.matrixServicio.getMatrixList(GuardarRegistro, false).subscribe(
            response => {
              GuardarRegistro = response[0];
              this.MatrixControls[9]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite ";
              this.MatrixControls[9]._ngClass     = "bg-white";
              this.MatrixControls[9]._placeholder = "";
              this.MatrixControls[9]._valorSeleccionado = this.MatrixControls[9]._placeholder;
        
              alert(GuardarRegistro._message);
              this.MatrixControls = [];
              this.inicializarControles();
              this.clearForm(this.MatrixControls);
            }, error => {
              alert('hubo error al cargar el servicio');
            });
        }

        
      
  }

  MatrixSelected(event: any) {


    this.tmpSelectGrupo_id = event["_group_id"];
    this.tmpSelectIdArea_id = event["_area_id"];
    this.tmpSelectIdEvent_id = event["event_id"];
    this.tmpRiskTolerance_id = event["toleranceId"];

    this.LoadComboArea(this.tmpSelectGrupo_id);
    this.LoadComboEvent(this.tmpSelectIdArea_id);

    for (var keys in event) {
      this.MatrixControls.forEach(elementAt => {

        if (keys == elementAt._nombrecampo && elementAt._tipoControlHTML == "TextArea_") {
          elementAt._valorSeleccionado = event[keys];
          elementAt._ngModelarr = event[keys];
        } else if (keys == elementAt._nombrecampo && elementAt._tipoControlHTML == "Input_") {
          elementAt._valorSeleccionado = event[keys];
          if (elementAt._nombrecampo == "_valor_mitigador") {

            this.tmpIntValorCalcResidual = parseInt(elementAt._valorSeleccionado);
            //this.calcRiesgoResidual(parseInt(elementAt._valorSeleccionado));
          }

        } else if (keys == elementAt._nombrecampo && elementAt._tipoControlHTML == "Select_") {
          //pone todos los combos con sus items a false esSeleccionado
          elementAt._optionListJson.forEach(element => {
            element._esSeleccionado = false;
          });

          //hawk-warning temporal para la presentacion
          this.MatrixControls[8]._valorSeleccionado = event["calcResidualRisk"];
          this.tmpIntValorCalcResidual = parseInt(this.MatrixControls[8]._valorSeleccionado);
          //hawk-warning temporal para la presentacion
          
          elementAt._optionListJson.forEach(element => {
            if (element._valorCampo == event[keys] && elementAt._nombrecampo == keys) {
              if (elementAt._nombrecampo == "probId") {

                this.intValorProbabilidad = parseInt(element._valorCampo);
                this.CalcValorInherente(this.intValorProbabilidad, true);
                this.calcRiesgoResidual(this.tmpIntValorCalcResidual);

              } else if (elementAt._nombrecampo == "severId") {
                this.intValorSeveridad = parseInt(element._valorCampo);
                this.CalcValorInherente(this.intValorSeveridad, false);
                this.calcRiesgoResidual(this.tmpIntValorCalcResidual);
              };

              element._esSeleccionado = true;

            };

          });

        }; //fin del if que compara el key nombre con el nombre del elemento del imput
      }); //foreach de los controles del form
    }; //ciclo que recorre el event

  }

  deleteMatrix(event:any){
    if (this.MatrixControls[0]._valorSeleccionado > "0") {
      if (confirm("Desea eliminar este registro")) {
        var EliminarRegistro              = new MatrixModel(0, 0, 0, "", 0, 0, 0, 0, 0, "", "", "", "", "", "", "", 0, 0, "", "", "", "", 0,0);

        EliminarRegistro._opcionDML       = 2;

        //inicio llenar el arreglo para grabar
        EliminarRegistro.id                       = parseInt(this.MatrixControls[0]._valorSeleccionado);
        EliminarRegistro.muni_id                  = GLOBAL.muni;
        EliminarRegistro.descriptionRisk          = this.MatrixControls[4]._ngModelarr;
        EliminarRegistro.riskRemarks              = this.MatrixControls[11]._ngModelarr; //OBSERVACIONES
        EliminarRegistro.inherentRisk             = parseInt(this.MatrixControls[7]._valorSeleccionado);
        EliminarRegistro.calcResidualRisk         = 42; //verificar si en verdad necesita este valor para relacionarlo
        EliminarRegistro.internalContollMitigate  = this.MatrixControls[10]._ngModelarr;
        this.MatrixControls[3]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            EliminarRegistro.event_id = parseInt(item._valorCampo);
          }
        })
        this.MatrixControls[5]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            EliminarRegistro.probId   = parseInt(item._valorCampo);
          }
        })
        this.MatrixControls[6]._optionListJson.forEach(item => {
          if (item._esSeleccionado) {
            EliminarRegistro.severId  = parseInt(item._valorCampo);
          }
        })

        EliminarRegistro.toleranceId  = this.tmpRiskTolerance_id;

        this.matrixServicio.getMatrixList(EliminarRegistro, false).subscribe(
          response => {
            EliminarRegistro                          = response[0];
            this.MatrixControls[9]._estilosCSS        = "form-control tamanyo_letra_inputp textWhite ";
            this.MatrixControls[9]._ngClass           = "bg-white";
            this.MatrixControls[9]._placeholder       = "";
            this.MatrixControls[9]._valorSeleccionado = this.MatrixControls[9]._placeholder;

            alert(EliminarRegistro._message);
            this.MatrixControls = [];
            this.inicializarControles();
            this.clearForm(this.MatrixControls);
            
          }, error => {
            alert('hubo error al cargar el servicio');
          });

      }
    }

  }
}

