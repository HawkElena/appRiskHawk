import { faL } from "@fortawesome/free-solid-svg-icons";
import { ObjetoHijoModel } from "./ObjetoHijoModel";

export class ObjetoModel{
    constructor(

                public _type                :string,
                public _nombre              :string,
                public _placeholder         :string,
                public _maximolargo         :string = "50",
                public _estilosCSS          :string,
                public _tipoControlHTML     :string,
                public _idTipoControHTML    :string,
                public _ngModelarr          :string,
                public _optionListJson      :ObjetoHijoModel[],
                public _ngModelChangectr    :string,
                public _valTipoControlHTML  :string,
                public _esCampoBusqueda     :boolean = false,
                public _valorSeleccionado   :string  = "",
                public _esMultiSelect       :boolean = false,
                public _indice              :string  = "",
                public _controlBinding      :string  = "",
                public _nombrecampo         :string,
                public _ngDeshabilitar      :boolean = false,
                public _esRequerido         :boolean,
                public _esValido            :boolean,
                public _ngClassCol          :number  = 0,
                public _rowstxtarea         :number  = 0,   
                public _readonly            :boolean = false,    
                public _ngClass             :string  =  "",   
                public _requiereBtn         :boolean = false,
                public _ngClassBtn          :string  = "",
                public _faIconBtn           :number  = 0,
                public _SeleccionadoBtn    :boolean = false,  
                public _idBtnHTML           :string  = "btn_"+ _idTipoControHTML,      

                
    ){
    }
}
