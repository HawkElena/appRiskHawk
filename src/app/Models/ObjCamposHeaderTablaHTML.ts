export class ObjCamposHeaderTablaHTML{
    constructor(
        public _indice           :string,
        public _valor            :string,
        public _nomCampo         :string,
        public _esBotonera       :boolean,
        public _estilosCSS       :string,
        public _esSeleccionado   :boolean    =   false,
        public _esHeaderTable    :boolean    =   false,
        public _esVisible        :boolean    =   false,
        public _btnIconAccion    :string     =  "",
        public _cssStyle         :string     =  "",
    ){
        
    }
}
