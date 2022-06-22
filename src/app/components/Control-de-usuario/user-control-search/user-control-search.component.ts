import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { faClose, faEdit, faEye, faMinusCircle, faPlusCircle, faRecycle, faSave, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ObjCamposHeaderTablaHTML } from 'src/app/Models/ObjCamposHeaderTablaHTML';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';

//import { PageScrollService } from 'ngx-page-scroll-core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-control-search',
  templateUrl: './user-control-search.component.html',
  styleUrls: ['./user-control-search.component.css']
})
export class UserControlSearchComponent implements OnInit {
  // faSearch = faSearch;
  
  public page = 1;
  public pageSize = 10;
  
  public faEdit = faEdit;
  // public faBorrar = faTrash;

  public faSearch  = faSearch;
  public faSave    = faSave;
  public faDelete  = faTrash;
  public faRefresh = faRecycle;
  public faPlus    = faPlusCircle;
  public faMinus  =   faMinusCircle;
  public faClose  = faClose;
  
  public tituloModal!:String;
  // parametros de entrada del control de busqueda
  @Input() ControlsFilter : ObjetoModel[] = []
  @Input() headerInput    : ObjCamposHeaderTablaHTML[]=[];
  @Input() resultSetData! : any[];
 
  
  // parametros de salida del control de busqueda
  @Output() eventSearch = new EventEmitter<ObjetoModel[]>();
  @Output() eventEdit   = new EventEmitter<ObjetoModel[]>();
  @Output() eventDelete = new EventEmitter<ObjetoModel[]>();
  
  //configuracion de los divs contenederoes del filtro
  public arrDivData = [{
    'firstDivClass': 'row firstMargen'
    , 'secondDivClass': 'col-md-12'
    , 'thirdDivClass': 'row'
    , 'fourthDivClass': 'form-group col-md-3'
    , 'fifthDivClass': []
  }];

  constructor( 
     @Inject(DOCUMENT) private document: any
    ) {
    
  }

  ngOnInit(): void {
  }


  // event for work a input control
  handleInput(event: any) {
    var value = (event.target as HTMLInputElement).value;
    var idInput = (event.target as HTMLInputElement).id;
    this.ControlsFilter.forEach(element => {
      if (element._idTipoControHTML == idInput && element._tipoControlHTML == "Input_") {
        element._valTipoControlHTML = value;
        element._valorSeleccionado  = value;
        //element._ngModelarr = value;
      }
    });
  }
  // event for work in a select and option
  handleSelect(event: any) {

    let optionText = event.source;
    // var idSelectPadre = (event.target as HTMLSelectElement).id;
    var idOptHijo = (event.target as HTMLOptionElement).id;
    var valOptHijo = (event.target as HTMLOptionElement).value;
    //variables que se utilizan para ver si hay algun control que este relacionado(binding) y que tipo de dato tiene 
    var tipoDato:string = "";
    var controlBinding:string = "";

    // para configurar que option fue seleccionada
    this.ControlsFilter.forEach(element => {
      if (element._tipoControlHTML == "Select_") {
        controlBinding = element._controlBinding;
        element._optionListJson.forEach(element2 => {
          element2._esSeleccionado = false
          if (element2._indice == valOptHijo) {
            element2._esSeleccionado = true;
            tipoDato=element2._tipoDato;
            
            // para cambiar el valor del type=text segun el option seleccionado que esta realcionado(binding) y su tipo de dato
            this.ControlsFilter.forEach(elementAt =>{
              if(elementAt._tipoControlHTML== "Input_" && elementAt._controlBinding== controlBinding){
                elementAt._valorSeleccionado= "";
                elementAt._valTipoControlHTML= "";        
                elementAt._type = tipoDato;
                tipoDato= "";
                controlBinding="";
              };//if para ver que input esta binding con otro control input
            });//foreach para buscar si tiene un texto realacionado

          };//fin del if
        });//fin del segundo foreach 
      };//fin del if
    });//fin del primer foreach

  }

  searchEvent(event: any) {
   
    this.eventSearch.emit(this.ControlsFilter);
    
  }

  showForEdit(rowEdit:any){
    
    this.eventEdit.emit(rowEdit);
    
  }
  showForDelete(rowDelete:any){
    this.eventDelete.emit(rowDelete);
  }
}
