import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupModel } from 'src/app/Models/Catalog1/GroupModel';
import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoHijoModel } from 'src/app/Models/ObjetoHijoModel';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';
import { UserControlFormComponent } from '../../Control-de-usuario/user-control-form/user-control-form.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  public usercontrolFormComponent = new UserControlFormComponent();
  public titulo: String = "Catalogo Grupo";
  public busqueda_titulo: String = "Busqueda de grupos"

  public closeResult: string = "";
  //parametros para enviar al control de busqueda
  public camposHeaderTabla: ObjCamposHeaderTablaHTML[] = [];
  // public camposHeaderTempo        = ["Grupo", "Area", "Evento", "Probabilidad", "Severidad"];
  public ctrlFiltersBusqueda: ObjetoModel[] = [];
  
  // public responseDataPlan: GroupModel[] = [];
  public responseDataGrid: any = [];

    // para cargar los valores de los items temporal
    public tmpCampos: ObjetoModel;
    // para cargar los items del combo temporal
    public tmpItemsCombo = new ObjetoHijoModel("", "", "", false, "", false, "", true, "");   //para los items del combogrupo
    //para cargar el control del formulario
    public ControlsCatalog: ObjetoModel[] = [];
    //para cargar los diferentes items en el combo
    public CamposCombo: ObjetoHijoModel[] = [];  //para el objeto grupo



  constructor(
    public modalService: NgbModal
    

  ) {
    this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
    this.inicializarControles();
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
         this.ControlsCatalog.push(this.tmpCampos);
     
     
         this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
         this.tmpCampos._type = "text";
         this.tmpCampos._nombre = "Grupo";
         this.tmpCampos._placeholder = "Ingrese el nombre del grupo";
         this.tmpCampos._maximolargo = "50";
         this.tmpCampos._estilosCSS = "form-control tamanyo_letra_inputp";
         this.tmpCampos._tipoControlHTML = "Input_";
         this.tmpCampos._idTipoControHTML = "inpnombre";
         this.tmpCampos._ngModelarr = "";
         // this.tmpCampos._optionListJson.push(this.tmpMatrixEstado)
         this.tmpCampos._ngModelChangectr = "myFunction";
         this.tmpCampos._ngDeshabilitar = false;
         this.tmpCampos._esRequerido = false;
         this.tmpCampos._esValido = false;
         this.tmpCampos._ngClassCol = 4;
         this.tmpCampos._rowstxtarea = 2;
         this.tmpCampos._indice = "8";
         this.tmpCampos._nombrecampo = "nombre"
         this.tmpCampos._readonly = false;
         this.ControlsCatalog.push(this.tmpCampos);
     
     }

    async onSearch(event: any) {

      // xxx = Object.assign({}, event);
      //para limpiar el objeto table del control de busqueda.
      this.responseDataGrid = [];
  
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
      tmpOpciones._valor = "Nombre"
      tmpOpciones._estilosCSS = "";
      tmpOpciones._esSeleccionado = false;
      tmpOpciones._tipoDato = "text"
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
      this.tmpCampos._nombre = "Criterio a buscar";
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
      this.tmpCampos._ngClassCol = 6;
      this.tmpCampos._rowstxtarea = 2;
      this.ctrlFiltersBusqueda.push(this.tmpCampos);
      //boton del control de busqueda

      // this.tmpCampos = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0, false);
      // this.tmpCampos._type = "button";
      // this.tmpCampos._nombre = "Buscar";
      // this.tmpCampos._placeholder = "";
      // this.tmpCampos._maximolargo = "20";
      // this.tmpCampos._estilosCSS = "form-control  btn btn-outline-primary btn-block";
      // this.tmpCampos._tipoControlHTML = "Button_";
      // this.tmpCampos._idTipoControHTML = "btnSearch";
      // this.tmpCampos._ngModelarr = "";
      // this.tmpCampos._optionListJson = [];
      // this.tmpCampos._ngModelChangectr = "myFunction";
      // this.tmpCampos._valTipoControlHTML = "";
      // this.tmpCampos._esCampoBusqueda = true;
      // this.tmpCampos._valorSeleccionado = "";
      // this.tmpCampos._esMultiSelect = false;
      // this.tmpCampos._indice = "2";
      // this.tmpCampos._nombrecampo = "_id";
      // this.tmpCampos._ngDeshabilitar = false;
      // this.tmpCampos._ngClassCol = 3;
      // this.tmpCampos._rowstxtarea = 2;
      // this.ctrlFiltersBusqueda.push(this.tmpCampos);
      // //finaliza para la seccion de filtros en el control de busqueda 
  
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
      /// esto es lo ultimo que hay que agregar para que funcione
      // el boton de busqueda dentro del modal 
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
        { _indice: "0", _valor: "Codigo", _nomCampo: "id", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true, _btnIconAccion: "" ,_cssStyle:""},
        { _indice: "1", _valor: "Grupo", _nomCampo: "_group_name", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true , _btnIconAccion: "" ,_cssStyle:""},
        { _indice: "2", _valor: "Accion", _nomCampo: "_accion", _esBotonera: true, _estilosCSS: "", _esSeleccionado: false, _esHeaderTable: true, _esVisible: true , _btnIconAccion: "1" ,_cssStyle:""},
  
      );
      //finaliza para la seccion de detalle en el control de busqueda
    }
    
    
    reiniciarCombos() {}
      
    // eventos para el objeto controles del form
    selectItemEvent(event: any) {}
    clearForm(event: any) {}
    guardarCatalogo(event:any){}
    guardarRow(event:any){}
    changeInputEvent(event: any) {}
    deleteRow(event:any){}
    // termina los eventos para el objeto del form
  
    // eventos para el objeto filtro
    async buscarRegistros(event: any) {}
    rowSelected(event: any) {}
    // termina los eventos para el objeto filro

    
}
