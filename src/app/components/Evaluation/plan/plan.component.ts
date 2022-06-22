import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { elementAt } from 'rxjs';
import { PositionModal } from 'src/app/Models/Catalog1/PositionModal';
import { PriorityModel } from 'src/app/Models/Catalog1/PriorityModel';
import { RiskToleranceModel } from 'src/app/Models/Catalog2/RiskToleranceModel';
import { MatrixModel } from 'src/app/Models/Catalog4/MatrixModel';
import { EvaluateMatrixRequest } from 'src/app/Models/Catalog4/MatrixRequest';
import { PlanModel } from 'src/app/Models/Catalog4/PlanModel';
import { PlanPositionModel } from 'src/app/Models/Catalog4/PlanPositionModel';
import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoHijoModel } from 'src/app/Models/ObjetoHijoModel';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';
import { CatalogService } from 'src/app/services/Catalog/Catalog.service';
import { GLOBAL } from 'src/app/services/global.service';
import { EvaluationService } from 'src/app/services/Evaluation.service';
import { UserControlFormComponent } from '../../Control-de-usuario/user-control-form/user-control-form.component';
import { GetParamGlobalService } from 'src/app/services/utilis.service';
import { EvaluatePlanRequest } from 'src/app/Models/Catalog4/PlanModelRequest';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
// aqui se hace una instancia del control para poder levantar el evento refreshEvent para 
  // limpiar los controles sino no se puede ejecutar el limpiar controles
  //grupo 1
  public usercontrolFormComponent = new UserControlFormComponent();
  public titulo: String = "Plan de evaluacion";
  public busqueda_titulo: String = "..."

  //grupo 2
  public closeResult: string = "";
  //parametros para enviar al control de busqueda
  public camposHeaderTabla: ObjCamposHeaderTablaHTML[] = [];
  // public camposHeaderTempo        = ["Grupo", "Area", "Evento", "Probabilidad", "Severidad"];
  public ctrlFiltersBusqueda: ObjetoModel[] = [];
  
  // grupo 4
  public responseDataPlan: PlanModel[] = [];
  
  //grupo 5
    // para cargar los valores de los items temporal
    public tmpCampos: ObjetoModel;
    // para cargar los items del combo temporal
    public tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");   //para los items del combogrupo
    //para cargar el control del formulario
    public PlanControls: ObjetoModel[] = [];
    //para cargar los diferentes items en el combo
    public CamposCombo: ObjetoHijoModel[] = [];  //para el objeto grupo

  // grupo 6
  // public responseDataGrid: MatrixModel[] = [];
  public responseDataGrid:any;

  public responseDataRiskTolerance: RiskToleranceModel[] = [];
  public responseDataPriority     : PriorityModel[] = [];
  public responseDataPositions    : PositionModal[]=[];
  public responseDAtaPositionPlan : PlanPositionModel[] = [];

  public esBusqueda: boolean= true;
  public isValidDate: boolean= false;

  public error?: { isError: boolean; errorMessage: string; };

  constructor(
    public modalService: NgbModal,
    public planService: EvaluationService,
    public catalogService: CatalogService,
    public transformarFecha: GetParamGlobalService
    ) {

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);

        // begin reorder hawk
        this.inicializarControles();
        // this.loadDataResponseRiskTolerance();
        // this.loadImplementPriority();
        // this.loadResponsabile();
   }

  ngOnInit(): void {
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

    // // xxx = Object.assign({}, event);
    // //para limpiar el objeto table del control de busqueda.
    // this.responseDataPlan = [];

    // var tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    // let tmpfilterOp: any[];
    this.PlanControls[1]._SeleccionadoBtn= false;
    this.PlanControls[7]._SeleccionadoBtn= false;
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
      { _indice: "3", _valor: "Matix", _nomCampo: "_matrix", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
      { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"1" ,_cssStyle:""},

    );
    //finaliza para la seccion de detalle en el control de busqueda
  }
  
  //metodos propios de la forma
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
      this.PlanControls.push(this.tmpCampos);




    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Matriz";
    this.tmpCampos._placeholder = "Busque una matriz";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "input-group form-control tamanyo_letra_inputp ";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inpMatrizId";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._optionListJson = [];
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = true;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "1";
    this.tmpCampos._nombrecampo = "matrizid";
    this.tmpCampos._ngClass     = "bg-white";
    this.tmpCampos._requiereBtn = true;
    this.tmpCampos._ngClassBtn ="tamanyo_letra_buttonp btn btn-outline-primary btn-block"
    this.tmpCampos._faIconBtn = 1;
    this.tmpCampos._idBtnHTML = "btnMatriz"
    this.PlanControls.push(this.tmpCampos);

    // this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    // this.tmpCampos._type = "button";
    // this.tmpCampos._nombre = ".";
    // this.tmpCampos._placeholder = "";
    // this.tmpCampos._valorSeleccionado = "Buscar";
    // this.tmpCampos._maximolargo = "20";
    // this.tmpCampos._estilosCSS = "tamanyo_letra_inputp btn btn-outline-primary";
    // this.tmpCampos._tipoControlHTML = "InputButton_";
    // this.tmpCampos._idTipoControHTML = "xxxxxxxxxxxxx";
    // this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._ngClassCol = 1;
    // this.tmpCampos._indice = "2";
    // this.tmpCampos._nombrecampo = "xxxxxxxxxxxxx";
    // this.tmpCampos._readonly =false
    // // this.tmpCampos._nombrecampo       = ""
    // this.CamposCombo.forEach(element => {
    //   this.tmpCampos._optionListJson.push(element);
    // });
    // this.PlanControls.push(this.tmpCampos);


    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Nivel riesgo Residual";
    this.tmpCampos._placeholder = "riesgo residual";
    this.tmpCampos._valorSeleccionado = "0.0";
    this.tmpCampos._maximolargo = "10";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp textWhite";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inprisResidual";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._valorSeleccionado = this.intValorInherente.toString();
    // this.tmpCampos._valTipoControlHTML = this.intValorInherente.toString();
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = true;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._rowstxtarea = 1;
    this.tmpCampos._indice = "2";
    this.tmpCampos._nombrecampo = "riskResidual"
    this.tmpCampos._ngClass     = "bg-white";
    this.PlanControls.push(this.tmpCampos);

    

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Controles Recomendados";
    this.tmpCampos._placeholder = "Ingrese Controles Recomendados";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpRecomends";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "3";
    this.tmpCampos._nombrecampo = "Recomends";
    this.PlanControls.push(this.tmpCampos);


    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Controles para implementacion";
    this.tmpCampos._placeholder = "Ingrese Controles para implementacion";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpcontrolesimplementacion";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "4";
    this.tmpCampos._nombrecampo = "controlesimplementacion";
    this.PlanControls.push(this.tmpCampos);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Recursos internos o externos";
    this.tmpCampos._placeholder = "Ingrese recursos internos o externos";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inprecursosInternosExternos";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "5";
    this.tmpCampos._nombrecampo = "recursosInternosExternos";
    this.PlanControls.push(this.tmpCampos);


    this.CamposCombo = [];
    this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    this.tmpItemsCombo._indice = "-1";
    this.tmpItemsCombo._valor = "Seleccione una Prioridad";
    this.tmpItemsCombo._esSeleccionado = true;
    this.tmpItemsCombo._esInactivo = true;
    this.tmpItemsCombo._valorCampo = "-1"
    this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Prioridad de Implementación";
    this.tmpCampos._placeholder = "Seleccione Prioridad de Implementación";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "Select_";
    this.tmpCampos._idTipoControHTML = "optPrioridad";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "6";
    this.tmpCampos._nombrecampo = "xdf";
    this.CamposCombo.forEach(element => {
      this.tmpCampos._optionListJson.push(element);
    });
    this.PlanControls.push(this.tmpCampos);

    // this.CamposCombo = [];
    // this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
    // this.tmpItemsCombo._indice = "-1";
    // this.tmpItemsCombo._valor = "Seleccione Puesto Responsable";
    // this.tmpItemsCombo._esSeleccionado = true;
    // this.tmpItemsCombo._esInactivo = true;
    // this.tmpItemsCombo._valorCampo = "-1"
    // this.CamposCombo.push(this.tmpItemsCombo);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "number";
    this.tmpCampos._nombre = "Responsable";
    this.tmpCampos._placeholder = "Agregue Responsable";
    this.tmpCampos._maximolargo = "20";
    this.tmpCampos._estilosCSS = "input-group form-control tamanyo_letra_inputp ";
    this.tmpCampos._tipoControlHTML = "Input_";
    this.tmpCampos._idTipoControHTML = "inpPuestoResponsable";
    this.tmpCampos._ngDeshabilitar = true;
    this.tmpCampos._ngClass ="bg-white";
    this.tmpCampos._ngModelarr = "";
    this.tmpCampos._ngClassCol = 3;
    this.tmpCampos._indice = "7";
    this.tmpCampos._nombrecampo = "inpPuestoResponsable";
    this.tmpCampos._optionListJson= [];
    // this.CamposCombo.forEach(element => {
    //   this.tmpCampos._optionListJson.push(element);
    // });
    this.tmpCampos._requiereBtn = true;
    this.tmpCampos._ngClassBtn ="tamanyo_letra_buttonp btn btn-outline-primary btn-block"
    this.tmpCampos._faIconBtn = 6;
    this.tmpCampos._idBtnHTML = "btnResponsable";
    this.PlanControls.push(this.tmpCampos);

    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
      this.tmpCampos._type = "date";
      this.tmpCampos._nombre = "FechaInicio";
      this.tmpCampos._placeholder = "Fecha Inicio";
      this.tmpCampos._maximolargo = "20";
      this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
      this.tmpCampos._tipoControlHTML = "Input_";
      this.tmpCampos._idTipoControHTML = "inpFechaInicio";
      this.tmpCampos._ngModelarr = "";
      this.tmpCampos._optionListJson = [];
      this.tmpCampos._ngModelChangectr = "myFunction";
      this.tmpCampos._ngDeshabilitar = false;
      this.tmpCampos._esRequerido = false;
      this.tmpCampos._esValido = false;
      this.tmpCampos._ngClassCol = 3;
      this.tmpCampos._indice = "8";
      this.tmpCampos._nombrecampo = "xxxxxxxxxxxxx";
      this.PlanControls.push(this.tmpCampos);


      this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
      this.tmpCampos._type = "date";
      this.tmpCampos._nombre = "FechaFin";
      this.tmpCampos._placeholder = "Fecha Fin";
      this.tmpCampos._maximolargo = "20";
      this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
      this.tmpCampos._tipoControlHTML = "Input_";
      this.tmpCampos._idTipoControHTML = "inpFechaFin";
      this.tmpCampos._ngModelarr = "";
      this.tmpCampos._optionListJson = [];
      this.tmpCampos._ngModelChangectr = "myFunction";
      this.tmpCampos._ngDeshabilitar = false;
      this.tmpCampos._esRequerido = false;
      this.tmpCampos._esValido = false;
      this.tmpCampos._ngClassCol = 3;
      this.tmpCampos._indice = "9";
      this.tmpCampos._nombrecampo = "xxxxxxxxxxxxx";
      this.PlanControls.push(this.tmpCampos);


      
    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.tmpCampos._type = "text";
    this.tmpCampos._nombre = "Comentarios";
    this.tmpCampos._placeholder = "Ingrese Comentarios";
    this.tmpCampos._maximolargo = "200";
    this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
    this.tmpCampos._tipoControlHTML = "TextArea_";
    this.tmpCampos._idTipoControHTML = "inpcomentarios";
    this.tmpCampos._ngModelarr = "";
    // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
    this.tmpCampos._ngModelChangectr = "myFunction";
    this.tmpCampos._ngDeshabilitar = false;
    this.tmpCampos._esRequerido = false;
    this.tmpCampos._esValido = false;
    this.tmpCampos._ngClassCol = 12;
    this.tmpCampos._rowstxtarea = 2;
    this.tmpCampos._indice = "10";
    this.tmpCampos._nombrecampo = "xxxxxxxxxxxxx";
    this.PlanControls.push(this.tmpCampos);


    this.loadImplementPriority();
    this.loadResponsabile();
    this.responseDAtaPositionPlan = [];
    this.responseDataGrid= [];
  }

  reiniciarCombos() {}
  
  loadImplementPriority(){
    
    var priorityRegistro = new PriorityModel(0, 0, "",0,0,"");

    priorityRegistro.muni_id    = GLOBAL.muni;
    priorityRegistro.id         = 0;
    priorityRegistro.name       = "%%";
    priorityRegistro._opcionDML = 4
    priorityRegistro.tabla_id   = 2
    priorityRegistro._message   = "";

    this.catalogService.getListCatalog(priorityRegistro, "PriorityServicio").subscribe(
      response => {
        this.CamposCombo = [];
        // this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
        // this.tmpItemsCombo._indice = "-1";
        // this.tmpItemsCombo._valor = "Seleccione Prioridad";
        // this.tmpItemsCombo._esSeleccionado = true;
        // this.tmpItemsCombo._esInactivo = true;
        // this.tmpItemsCombo._valorCampo = "-1"
        // this.CamposCombo.push(this.tmpItemsCombo);

        this.responseDataPriority = response;
        this.responseDataPriority.forEach(element => {
          this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
          this.tmpItemsCombo._indice = element.id.toString();
          this.tmpItemsCombo._valor = element.name;
          this.tmpItemsCombo._esInactivo = false;
          this.tmpItemsCombo._valorCampo = element.id.toString();
          this.CamposCombo.push(this.tmpItemsCombo);
        })

        
        
        this.CamposCombo.forEach(element => {
          // hawkindex-control
          this.PlanControls[6]._optionListJson.push(element);

          // this.MatrixControls.forEach(elementA => {
          //   if (elementA._tipoControlHTML == "Select_" && elementA._idTipoControHTML == "optGrupo") {
          //     elementA._optionListJson.push(element);
          //   };//fin del compara si es un combo y si es el group
          // });//fin del foreach que recorre todos los elementos del objeto que contiene los controles de la matrix
        });//fin del foreach del combo temporal que trae la data que se le asigno con el response del servicio.



      },
      error => {
        alert('hubo error al cargar el servicio');
      }
    )
  }

  loadResponsabile(){
    var priorityRegistro = new PositionModal(0, 0, "",0,"");

    priorityRegistro.muni_id    = GLOBAL.muni;
    priorityRegistro.id         = 0;
    priorityRegistro.name       = "%%";
    priorityRegistro._opcionDML = 4
    priorityRegistro._message   = "";

    this.catalogService.getListCatalog(priorityRegistro, "PositionServicio").subscribe(
      response => {
        this.CamposCombo = [];
        
        this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
        this.tmpItemsCombo._indice = "-1";
        this.tmpItemsCombo._valor = "Seleccione responsable";
        this.tmpItemsCombo._esSeleccionado = true;
        this.tmpItemsCombo._esInactivo = true;
        this.tmpItemsCombo._valorCampo = "-1"
        this.CamposCombo.push(this.tmpItemsCombo);

        this.responseDataPositions = response;
        this.responseDataPositions.forEach(element => {
          this.tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");
          this.tmpItemsCombo._indice = element.id.toString();
          this.tmpItemsCombo._valor = element.name;
          this.tmpItemsCombo._esInactivo = false;
          this.tmpItemsCombo._valorCampo = element.id.toString();
          this.CamposCombo.push(this.tmpItemsCombo);
        })

        
        
        this.CamposCombo.forEach(element => {
          // hawkIndex-control
          this.PlanControls[7]._optionListJson.push(element);

        });//fin del foreach del combo temporal que trae la data que se le asigno con el response del servicio.



      },
      error => {
        alert('hubo error al cargar el servicio');
      }
    )
  }

  validateDates(sDate: string, eDate: string){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'Start date and end date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  // termina metodos propios de la forma

  // eventos para el objeto controles del form  
 
  selectItemEvent(event: any) {}

  clearForm(event: any) {
    this.PlanControls=[];
    this.inicializarControles();
  }

  guardarPlan(event:any){

    var objControlsave = event;

    var GuardarRegistro = new PlanModel(0,0,"","",0,"","","",[ { muni_id:GLOBAL.muni,resp_position_id:0,evaluation_plan_id:0}],0,"","",0,"",0);
    if(confirm("¿Desea grabar este registro?")){
      
      if (this.PlanControls[0]._valorSeleccionado > "0") {
        GuardarRegistro._opcionDML = 3;
      } else if (this.PlanControls[0]._valorSeleccionado == "") {
        GuardarRegistro._opcionDML = 1;
      }

      let dtFechaInicio: any = this.transformarFecha.getFechaFormateada(this.PlanControls[8]._valorSeleccionado);
      let dtFechaFin: any = this.transformarFecha.getFechaFormateada(this.PlanControls[9]._valorSeleccionado);
      this.isValidDate = this.validateDates(dtFechaInicio, dtFechaFin);
      if (!this.isValidDate) {
        this.PlanControls[9]._ngModelarr = dtFechaInicio;
        this.PlanControls[9]._valorSeleccionado = dtFechaInicio;
        this.PlanControls[9]._valTipoControlHTML = dtFechaInicio;
        alert("la fecha inicio no puede ser mayor a la fecha fin");
        
      } else {
          
        //inicio llenar el arreglo para grabar
        GuardarRegistro.muni_id           = GLOBAL.muni;
        GuardarRegistro.id                = parseInt(this.PlanControls[0]._valorSeleccionado);
        GuardarRegistro.recomendations    = this.PlanControls[3]._valorSeleccionado;
        GuardarRegistro.implement_control = this.PlanControls[4]._valorSeleccionado;
        // GuardarRegistro.implement_control = this.PlanControls[5]._ngModelarr;
        
        //para guardar si es prioridad media alta ...
        this.PlanControls[6]._optionListJson.forEach(elementAt => {
          if(elementAt._esSeleccionado){
            GuardarRegistro.priority_id   = parseInt(elementAt._valorCampo);
          }
        });

        //borramos todos los registros que tenga el campo
        GuardarRegistro.positions.splice(0);
        //lo volvemos a llenar segun lo seleccionado en el grid.
        this.responseDataGrid.forEach((element: { id: string; }) => {

          var tmpResponsible = {
            muni_id: GLOBAL.muni,
            resp_position_id: parseInt(element.id),
            evaluation_plan_id: GuardarRegistro.id
          };

          GuardarRegistro.positions.push(tmpResponsible);

        })

        GuardarRegistro.startdate = this.PlanControls[8]._valorSeleccionado;
        GuardarRegistro.enddate   = this.PlanControls[9]._valorSeleccionado;
        GuardarRegistro.remarks   = this.PlanControls[10]._valorSeleccionado;
        GuardarRegistro.matrix_id = parseInt(this.PlanControls[1]._valorSeleccionado.split("-")[1]);

        this.planService.getPlanList(GuardarRegistro, false).subscribe(
          response => {
            GuardarRegistro = response[0];
            
            alert(GuardarRegistro._message);
            this.clearForm(this.PlanControls);

          }, error => {
            alert('hubo error al cargar el servicio');
          });
        
      }

    }
  }

  changeInputEvent(event: any) {
    
    // // hawkIndex-control
    // let dtFechaInicio:any =  this.transformarFecha.getFechaFormateada( this.PlanControls[8]._valorSeleccionado );    
    // let dtFechaFin:any =  this.transformarFecha.getFechaFormateada( this.PlanControls[9]._valorSeleccionado );

    // if(event._indice == 8 || event._indice == 9){
    //     alert("la fecha inicio no puede ser mayor a la fecha fin");
    //     // hawkIndex-control
    //     this.PlanControls[9]._ngModelarr = dtFechaInicio;
    //     this.PlanControls[9]._valorSeleccionado = this.PlanControls[9]._ngModelarr
    //     this.PlanControls[9]._valTipoControlHTML = this.PlanControls[9]._ngModelarr
     
    // }
    
  }

  deletePlan(event:any){
    if (this.PlanControls[0]._valorSeleccionado > "0") {
      if (confirm("Desea eliminar este registro")) {
        var EliminarRegistro              =  new PlanModel(0,0,"","",0,"","","",[ { muni_id:GLOBAL.muni,resp_position_id:0,evaluation_plan_id:0}],0,"","",0,"",0);

        EliminarRegistro._opcionDML       = 2;

        // inicio llenar el arreglo para grabar
        EliminarRegistro.id                       = parseInt(this.PlanControls[0]._valorSeleccionado);
        EliminarRegistro.muni_id                  = GLOBAL.muni;
        
        
        this.planService.getMatrixList(EliminarRegistro, false).subscribe(
          response => {
            EliminarRegistro                          = response[0];
            this.PlanControls[2]._estilosCSS        = "form-control tamanyo_letra_inputp textWhite ";
            this.PlanControls[2]._ngClass           = "bg-white";
            this.PlanControls[2]._placeholder       = "";
            this.PlanControls[2]._valorSeleccionado = this.PlanControls[2]._placeholder;

            alert(EliminarRegistro._message);
            this.clearForm(this.PlanControls);
          }, error => {
            alert('hubo error al cargar el servicio');
          });
      }
    }
  }

  SearchandAdd(event:any){
    
    // xxx = Object.assign({}, event);
    //para limpiar el objeto table del control de busqueda.
    var btnBusqueda = Object.assign({}, event);

    this.responseDataGrid = [];

    var tmpOpciones = new ObjetoHijoModel("", "", "", false, "", false, "", false, "");
    let tmpfilterOp: any[];
    tmpfilterOp = [];
    this.ctrlFiltersBusqueda = [];
    this.camposHeaderTabla = [];
    this.busqueda_titulo = "Busqueda ..."

    if (btnBusqueda[1]._SeleccionadoBtn) {
      this.esBusqueda= true;
      this.busqueda_titulo = "Busqueda Plan de evaluacion";

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
        { _indice: "6", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "0", _valor: "Grupo", _nomCampo: "_group_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "1", _valor: "Area", _nomCampo: "_area_evaluate_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "2", _valor: "Evento", _nomCampo: "_event_description", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "3", _valor: "Probabilidad", _nomCampo: "_probabilidad", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "4", _valor: "Severidad", _nomCampo: "_severity", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" ,_cssStyle:""},
        { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"1" ,_cssStyle:""},

      );
      //finaliza para la seccion de detalle en el control de busqueda
    }else if(btnBusqueda[7]._SeleccionadoBtn){
      // hawkIndex-control
      this.busqueda_titulo = "Puesto Responsable"
      this.esBusqueda= true;
      this.responseDataGrid  = this.responseDAtaPositionPlan;
        
      //inicia para la seccion de filtros en el control de busqueda
      //combo del control de busqueda

      this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
      this.tmpCampos._type = "text";
      this.tmpCampos._nombre = "Responsable";
      this.tmpCampos._placeholder = "Seleccione Responsable";
      this.tmpCampos._maximolargo = "20";
      this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
      this.tmpCampos._tipoControlHTML = "Select_";
      this.tmpCampos._idTipoControHTML = "seltcodigo";
      this.tmpCampos._ngModelarr = "";
      // hawkIndex-control
      this.tmpCampos._optionListJson = this.PlanControls[7]._optionListJson;
      this.tmpCampos._ngModelChangectr = "myFunction";
      this.tmpCampos._valTipoControlHTML = "";
      this.tmpCampos._esCampoBusqueda = true;
      this.tmpCampos._valorSeleccionado = "";
      this.tmpCampos._esMultiSelect = false;
      this.tmpCampos._indice = "0";
      this.tmpCampos._controlBinding = "seltcodigo";
      this.tmpCampos._nombrecampo = "_id";
      this.tmpCampos._ngDeshabilitar = false;
      this.tmpCampos._ngClassCol = 6;
      this.tmpCampos._rowstxtarea = 2;
      
      // this.tmpCampos._idBtnHTML = "btnAgregarPosition";
      // this.tmpCampos._requiereBtn = false;
      // this.tmpCampos._ngClassBtn ="tamanyo_letra_buttonp btn btn-outline-primary btn-block"
      // this.tmpCampos._faIconBtn = 6;

      this.ctrlFiltersBusqueda.push(this.tmpCampos);

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
      this.tmpCampos._faIconBtn = 6;
      
      this.ctrlFiltersBusqueda.push(this.tmpCampos);

      this.camposHeaderTabla.push(
        { _indice: "0", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" , _cssStyle:""},
        { _indice: "1", _valor: "Puesto", _nomCampo: "name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"" , _cssStyle:""},
        { _indice: "5", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true ,_btnIconAccion:"2" , _cssStyle:""},

      );
      
    }
  }
  // termina los eventos para el objeto del form

  // eventos para el objeto filtro
  async buscarMatriz(event: any) {
    
      if(this.PlanControls[1]._SeleccionadoBtn){

        let valorTexto: string = "";
        let valorCombo: string = "";
    
        this.PlanControls[7]._SeleccionadoBtn = false;
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
  
        const xxResult = await this.planService.getMatrixList(matrixRequest, true).toPromise();
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
      }else if(this.PlanControls[7]._SeleccionadoBtn){
        
        // hawkIndex-control
        var regPosition= Object.assign({}, event);
        var positionModel =  new PositionModal(0,0,"",0,"");

        this.PlanControls[1]._SeleccionadoBtn = false;
        regPosition[0]._optionListJson.forEach((element: { _esSeleccionado: any; _valorCampo:any; _valor: any}) => {
          if(element._esSeleccionado){
            // alert(element._valorCampo + ' - ' + element._valor);
            positionModel.muni_id = GLOBAL.muni;
            positionModel.id = element._valorCampo;
            positionModel.name = element._valor;
            positionModel._message = "";
            positionModel._opcionDML = 4;
            
          }
          
        });

        let blnNoAdd:boolean= false;

        this.responseDAtaPositionPlan.forEach(elementAt =>{
          if(elementAt.id == positionModel.id){
            blnNoAdd= true;
          }
        });

        if(!blnNoAdd){
          if(positionModel.id > 0){
            this.responseDataGrid.push( positionModel);
            this.responseDAtaPositionPlan =this.responseDataGrid;
          }else{
            alert("Opcion seleccionada es invalida..");
          }
          
        }else{
          alert("La posicion (" + positionModel.name + ") ya esta agregada")
        };

        //  this.PlanControls[7]._SeleccionadoBtn = false;        
          // this.PlanControls[5]._valorSeleccionado = item._recursos;          
        
      }else{
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
     
  
    }
  
  matrixSelected(event: any) {

    if(this.PlanControls[1]._SeleccionadoBtn){
      var editarRegistroMatrix = new MatrixModel(0, 0, 0, "", 0, 0, 0, 0, 0, "", "", "", "", "", "", "", 0, 0, "", "", "", "", 0,0);
      editarRegistroMatrix = event;
      this.responseDataGrid.forEach((item:any) =>{
        if(editarRegistroMatrix.id == item.id){
          item._selected = 1;
          // hawkIndex-Cotroll
          this.PlanControls[1]._valorSeleccionado =item._group_name.substring(0,1).toString() + '-' + item.id  ;
          this.PlanControls[2]._valorSeleccionado = item._riesgo_residual;   
          
          this.ponerColorRiesgoResidual(item._riesgo_residual);
          
        }

            // this.PlanControls[2]._readonly=false;
    
      })
      
    } //fin del primer if 
    else {

    // var editarRegistroMatrix = new MatrixModel(0, 0, 0, "", 0, 0, 0, 0, 0, "", "", "", "", "", "", "", 0, 0, "", "", "", "", 0,0);
      var editarRegistroPlan = new PlanModel(0,0,"","",0,"","","",[ { muni_id:GLOBAL.muni,resp_position_id:0,evaluation_plan_id:0}],0,"","",0,"",0);
      editarRegistroPlan = event;
      this.responseDataGrid.forEach((item:any) =>{
        if(editarRegistroPlan.id == item.id){
          
          // hawkIndex-Cotroll

          this.PlanControls[0]._valorSeleccionado = item.id;
          this.PlanControls[1]._valorSeleccionado =item._matrix ;
          this.PlanControls[2]._valorSeleccionado = item._riesgo_residual;   
          this.ponerColorRiesgoResidual(item._riesgo_residual);
          
          this.PlanControls[3]._valorSeleccionado = item.recomendations;   
          this.PlanControls[4]._valorSeleccionado = item.implement_control;
          // this.PlanControls[5]._valorSeleccionado = item._recursos;
          
          this.PlanControls[6]._optionListJson.forEach(elementAt =>{
            if(elementAt._valorCampo == item.priority_id){
              elementAt._esSeleccionado = true;
            }
          }) 
          //hawk responsable puesto hacer el proceso para llenar la tabla.
          this.PlanControls[8]._valorSeleccionado = item.startdate;
          this.PlanControls[9]._valorSeleccionado = item.enddate;
          this.PlanControls[10]._valorSeleccionado = item.remarks;
          
          
        }

            // this.PlanControls[2]._readonly=false;

      })
    }
    //hay que inicializar los botones para que no aparezcan seleccionados = true en la propiedad de cada control
    this.PlanControls[1]._SeleccionadoBtn= false;
    this.PlanControls[7]._SeleccionadoBtn = false;
    //cargar los diferentes responsables del proyecto.
    this.cargarResponsabileFor( parseInt(this.PlanControls[0]._valorSeleccionado));

  }
  
  cargarResponsabileFor(intIdPlan : number){

    
  }
  ponerColorRiesgoResidual(_riesgo_residual :number){
  
    if (_riesgo_residual < 0 || _riesgo_residual == 0) {
      this.PlanControls[2]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite ";
      this.PlanControls[2]._ngClass     = "bg-white";
      this.PlanControls[2]._placeholder = "";
      this.PlanControls[2]._valorSeleccionado = this.PlanControls[2]._placeholder;


    } else if (_riesgo_residual > 0 && _riesgo_residual < 10.01) {
      this.PlanControls[2]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite";
      this.PlanControls[2]._ngClass     = "bg-success";


    } else if (_riesgo_residual > 10 && _riesgo_residual < 15.01) {
      this.PlanControls[2]._estilosCSS  = "form-control tamanyo_letra_inputp textDark  ";
      this.PlanControls[2]._ngClass     = "bg-warning";


    } else if (_riesgo_residual > 15 && _riesgo_residual < 30) {
      this.PlanControls[2]._estilosCSS  = "form-control tamanyo_letra_inputp textWhite";
      this.PlanControls[2]._ngClass     = " bg-danger ";

    };
  }

  deleteItem(event:any){
    let rowDelete = Object.assign({},event);
    let intIndice :number= -1;
    if( confirm("¿Desea borrar el puesto?")){
      for (let index = 0; index < this.responseDAtaPositionPlan.length; index++) {
        if(this.responseDAtaPositionPlan[index].id == rowDelete.id){
          intIndice = index;
        }
      }
      this.responseDAtaPositionPlan.splice(intIndice,1);   
    }
    
  }
  // termina los eventos para el objeto filro
  
}
