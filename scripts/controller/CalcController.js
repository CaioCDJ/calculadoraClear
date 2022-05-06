class CalcController{
    
    // like CalcController(){}
    constructor(){
        // EL no final da variavel se refere a element 
        this._audio = new Audio('click.mp3');
        this._audioOnOff= false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';       
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');

        this._displayCalc = '0';
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.setLastNumberToDisplay();
        this.initKeyboard();
        
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
    }
    pasteFromClipboard(){
        document.addEventListener("paste", e=>{
            let text = e.clipboardData.getData('Text');
            
            this.displayCalc = parseFloat(text);
        });
    }

    initialize(){
        
        this.setDisplayDateTime();
        this.pasteFromClipboard();
        setInterval(() => {
        this.setDisplayDateTime();

        }, 1000);
        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick',e=>
            {
                this.toggleAudio();
            })
        });
    }

    toggleAudio(){
        this._audioOnOff =!this._audioOnOff;
    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime =0;
            this._audio.play();
        }
    }   

    initKeyboard(){
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                break;
                case 'Backspace':
                    this.clearEntry();
                break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperatoration(e.key);
                break;
                case 'Enter':
                case '=':
                    this.calc();
                break;
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperatoration(parseInt(e.key));
                break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }

        })
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
        this._lastNumber ='';
        this._lastOperator= '';
        this._operation = [];
        this.setLastNumberToDisplay();

    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();

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
    
    getResult(){

        try {
            return eval(this._operation.join(''));
            
        } catch (e) {
            setTimeout(()=>{
                this.setError();
            },1)
        }
    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){ 

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length >3){
            
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        
        } else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);
        }

        console.log(this._lastNumber );
        console.log(this._lastOperator );

        let result = this.getResult();

        if(last == '%'){

            result /=100;
            this._operation =[result];
        
        } else {
        
            this._operation = [result];
            if(last) this._operation.push(last);
        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){
        
        let lastItem;

        for(let i = this._operation.length -1 ; i >=0 ; i--){

            if(this.isOperator(this._operation[i])==isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }
    // adiciona o ponto
    addDot(){
    
    
        let lastOperation = this.getLastOperation();
    
        if(typeof lastOperation === 'string' && lastOperation && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            
            this.pushOperation('0.');
        } else{
            this.setLastOperation(lastOperation.toString() + '.');  
        }
        this.setLastNumberToDisplay();
    }

    addOperatoration(value){

        if(isNaN(this.getLastOperation())){
            // string
            if(this.isOperator(value)){
                this.setLastOperation(value);
           
            } else { 
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        }else{

            if(this.isOperator(value)){
                this.pushOperation(value);
            
            } else {
                
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue)
                this.setLastNumberToDisplay();
            }
            
        }
    
    }

    setError(){
        this.displayCalc ='Error';
    }

    execBtn(value) {

        this.playAudio();
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
                this.calc();
            break;
            case 'ponto':
                this.addDot();
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
 
    get lastOperator(){
        return this._lastOperator;
    }
    set lastOperator(value){
        this._lastOperator = value;
    }
 
    get lastNumber(){
        return this._lastNumber.innerHTML;
    }
    set lastNumber(value){
        this._lastNumber= value;
    }
 
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
        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML  = value
    }

    get currentDate(){
        return new Date();
    }
    set dataAtual(value){
        this._dataAtual  = value;
    }
}