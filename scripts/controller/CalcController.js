class CalcController{
    
    // like CalcController(){}
    constructor(){
        // EL no final da variavel se refere a element 
        this._operation = [];
        this._locale = 'pt-BR';       
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');

        this._displayCalc = '0';
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        
        this.setDisplayDateTime();
        
        setInterval(() => {
        this.setDisplayDateTime();

        }, 1000);
        
    }

    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    // multiplos eventos
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event =>{
            
            element.addEventListener(event, fn , false);
        });
    }
    
    clearAll(){
        this._operation = [];
    }

    clearEntry(){
        this._operation.pop();
    }

    setLastOperation(value){
        this._operation[this._operation.length-1] = value ;

    }

    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    isOperator(value){
        return (['+','-','*','%','/'].indexOf(value)>-1);
    }

    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length>3){
            this.calc();
        }
    }

    calc(){

        let last = this._operation.pop();

        let result = eval(this._operation.join(''));

        this._operation = [result,last];
        this.setLastNumberToDisplay();

    }

    setLastNumberToDisplay(){
        let lastNunber;

        for(let i = this._operation.length-1;i>=0;i--){
            
            if(!this.isOperator(this._operation[i])){
                lastNunber = this._operation[i];
                break;
            }
        }
        this.displayCalc = lastNunber;
    }

    addOperatoration(value){

        if(isNaN(this.getLastOperation())){
            // string
            if(this.isOperator(value)){
                this.setLastOperation(value);
           
            }else if(isNaN(value)){
                console.log('deubom,');
            
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{

            if(this.isOperator(value)){
                this.pushOperation(value);
            
            } else {
                
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue))
                this.setLastNumberToDisplay();
            }
            
        }
    
    }

    setError(){
        this.displayCalc ='Error';
    }

    execBtn(value) {
        console.log('A'+value+ this.getLastOperation());
        switch (value) {
            case 'ac':
                this.clearAll();
            break;
            case 'ce':
                this.clearEntry();
            break;

            case 'soma':
                this.addOperatoration('+');       
            break;
            case 'subtracao':
                this.addOperatoration('-');
            break;
            case 'divisao':
                this.addOperatoration('/');
            break;
            case 'multiplicacao':
                this.addOperatoration('*');
            break;
        
            case 'porcento':
                this.addOperatoration('%');
            break;
            case 'igual':
                
            break;
            case 'ponto':
                this.addOperatoration('.');
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':   
                this.addOperatoration(parseInt(value));
            break;
            default:
                this.setError();
                break;
        }
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');
    
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn,'click drag', e => {
                
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
           
            });
         
            this.addEventListenerAll(btn,"mouseover mouseup mousedown", e =>{
                btn.style.cursor = "pointer";
            });
        });
    } 


    // -- Getters and Setters --
 
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
 
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        this._displayCalcEl.innerHTML  = value
    }

    get currentDate(){
        return new Date();
    }
    set dataAtual(value){
        this._dataAtual  = value;
    }
}