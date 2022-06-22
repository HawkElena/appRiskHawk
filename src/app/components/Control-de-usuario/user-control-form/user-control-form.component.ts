import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEdit, faEye, faMinusCircle, faPlus, faPlusCircle, faRecycle, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ObjetoModel } from 'src/app/Models/ObjetoModels';

@Component({
  selector: 'app-user-control-form',
  templateUrl: './user-control-form.component.html',
  styleUrls: ['./user-control-form.component.css']
})
export class UserControlFormComponent implements OnInit {
  faSearch  = faEye;
  faSave    = faSave;
  faDelete  = faTrash;
  faEdit    = faEdit;
  faRefresh = faRecycle;
  faPlus    = faPlusCircle;
  faMinus  = faMinusCircle;
  
  // public  esDeshabilitado : boolean = true;
  public  objetoVacio!    : ObjetoModel;

  // input varibles used and setted form relative
  @Input() titulo:String="";
  //public titulo:String = "Ingreso de empleados"
  @Input() controlesForm!: ObjetoModel[];

  // output variables used to relative
  @Output() eventSearch         = new EventEmitter<ObjetoModel[]>();
  @Output() eventSave           = new EventEmitter<ObjetoModel[]>();
  @Output() eventRefresh        = new EventEmitter<ObjetoModel[]>();
  @Output() eventDelete         = new EventEmitter<ObjetoModel[]>();
  @Output() eventOnSelect       = new EventEmitter<ObjetoModel>();
  @Output() eventOnChangeInput  = new EventEmitter<ObjetoModel>();
  @Output() eventSearchInputBtn = new EventEmitter<ObjetoModel[]>();

  public editando: number =0 ;

  
  public active = 1;
  // array that configure the container div for all dinamyc control
    public arrDivData = [{
      'firstDivClass': 'row firstMargen'
      , 'secondDivClass': 'col-md-12'
      , 'thirdDivClass': 'row'
      , 'fourthDivClass': 'form-group col-md-3'
      , 'fifthDivClass': []
    }];
    control: any;
  constructor() {

  }

  ngOnInit(
    
  ): void {
  }

  // event for work in a select and option
  public handleSelect(event: any) {

    // let optionText = event.source;
    var idSelectPadre = (event.target as HTMLSelectElement).id;
    var idOptHijo = (event.target as HTMLOptionElement).id;
    var indiceOptHijo = (event.target as HTMLOptionElement).value;
    var objPadre = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0,false );

    this.controlesForm.forEach(element => {
      if (element._idTipoControHTML == idOptHijo && element._tipoControlHTML == "Select_") {
        objPadre = element;        
        element._optionListJson[0]._esInactivo=true;
        
        element._optionListJson.forEach(elementAt =>{
          //este proceso hace activo al que trae 
          // y deselecciona los demas items
          if(elementAt._indice== indiceOptHijo){
            elementAt._esSeleccionado=true;            
          }else if( elementAt._indice != indiceOptHijo){
            elementAt._esSeleccionado =false;
          };          
        });
        //envia el objeto control al evento
        this.onSelectEvent(objPadre);
      };
    });

  }

  // event for work a input control
  handleInput(event: any) {
    var value = (event.target as HTMLInputElement).value;
    var idInput = (event.target as HTMLInputElement).id;
    var inputResponse = new ObjetoModel("", "", "", "", "", "", "", "", [], "", "", false, "", false, "", "", "", false, false, true, 0, 0,false );

    this.controlesForm.forEach(element => {
      if (element._idTipoControHTML == idInput && element._tipoControlHTML == "Input_") {
        // element._valTipoControlHTML = value;
        // element._ngModelarr = value;
        element._valTipoControlHTML = value;
        element._valorSeleccionado  = value;
        inputResponse = element;        
      }else if (element._idTipoControHTML == idInput && element._tipoControlHTML == "TextArea_") {
        // element._valTipoControlHTML = value;
        // element._ngModelarr = value;
        element._valTipoControlHTML = value;
        element._valorSeleccionado  = value;
        inputResponse = element;        
      }
      

    });
    this.onChangeEvent(inputResponse);
    
  }

  limpiarControles(regDataOutput: ObjetoModel[]){
    regDataOutput.forEach(element => {
      switch (element._tipoControlHTML) {
        case "Input_":
          element._valTipoControlHTML = "";
          element._valorSeleccionado = "";
          break;
        case "Select_":
          element._optionListJson[0]._esInactivo = false;
          element._optionListJson.forEach(elementAt => {
            elementAt._esSeleccionado = false;
          });
          element._optionListJson[0]._esSeleccionado = true;
          //element._optionListJson[0]._esInactivo= true;
          break;
        case "TextArea_":
          element._valTipoControlHTML = "";
          element._valorSeleccionado  = "";
          element._ngModelarr = "";
          break;

        default:
          break;
      }
      //this.refreshEvent(regDataOutput);
    });
  }

  searchEvent(regDataOutput: ObjetoModel[]) {    
    this.eventSearch.emit(regDataOutput);    
  }

  saveEvent(regDataOutput: ObjetoModel[]) {    
    this.eventSave.emit(regDataOutput);
    //this.limpiarControles(regDataOutput);    
  }
  
  refreshEvent(regDataOutput: ObjetoModel[]) {   
    this.limpiarControles(regDataOutput); 
    this.eventRefresh.emit(regDataOutput);
    
  }
  
  deleteEvent(regDataOutput: ObjetoModel[]) {    
    this.eventDelete.emit(regDataOutput);
    
  }
  
  onSelectEvent(regDataOutput: ObjetoModel){
    this.eventOnSelect.emit(regDataOutput);     
  }

  onChangeEvent(regDataOutput: ObjetoModel){
    this.eventOnChangeInput.emit(regDataOutput);
  }

  // searchEventInputBtn(regDataOutput: ObjetoModel[]) {
  //   this.eventSearchInputBtn.emit(regDataOutput); 

  // }

  
  changBtnSelectd(tmpHtmlElement: HTMLElement){
    var yyy:any;
    tmpHtmlElement?.childNodes.forEach(elementx => {
      if (elementx.nodeName == "INPUT") {
        yyy = (elementx as HTMLElement);
        this.controlesForm.forEach(elementy => {
          if (yyy.id == elementy._idTipoControHTML) {
            elementy._SeleccionadoBtn = true;
          }else{
            elementy._SeleccionadoBtn = false;
          }
        })
        // alert(yyy.id);
      }
    })

  }

  handleBtn(event:any){
    var elementHTML = (event.target as HTMLElement);
    var htmlControlParent: any;
    switch (elementHTML.nodeName) {
      case "path":
        htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode?.parentNode?.parentNode;
        break;

      case "svg":
        htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode?.parentNode;
        break;

      case "FA-ICON":
        htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode;
        break;

      case "SPAN":
        htmlControlParent = elementHTML.parentNode;
        break;

      case "BUTTON":
        htmlControlParent = elementHTML.parentNode?.parentNode;
        break;

      default:
        alert("Entro en validar div del control form button attached at input");
        break;

    }
  
    this.changBtnSelectd(htmlControlParent);
      this.eventSearchInputBtn.emit(this.controlesForm); 

    // if (elementHTML.nodeName == "path") {
    //   htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode?.parentNode?.parentNode;
    //   this.changBtnSelectd(htmlControlParent);

    // } else if (elementHTML.nodeName == "svg") {
    //   htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode?.parentNode;
    //   this.changBtnSelectd(htmlControlParent);

    // } else if (elementHTML.nodeName == "FA-ICON") {
    //   htmlControlParent = elementHTML.parentNode?.parentNode?.parentNode;
    //   this.changBtnSelectd(htmlControlParent);
    // } else if (elementHTML.nodeName == "SPAN") {
    //   htmlControlParent = elementHTML.parentNode;
    //   this.changBtnSelectd(htmlControlParent);

    // } else if (elementHTML.nodeName == "DIV") {
    //   alert("Entro en validar div del control form button attached at input");
    // } else if (elementHTML.nodeName == "BUTTON") {
    //   //alert('Entro al button: ' +  idBtn)
    //   htmlControlParent = elementHTML.parentNode?.parentNode;
    //   this.changBtnSelectd(htmlControlParent);

    // }


    
  }
}
