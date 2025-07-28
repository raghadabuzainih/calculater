const result = document.querySelector('.result-label')
const calculater = document.querySelector('.calculater')
const buttons = document.querySelectorAll('.calculater button')

const lastOperations = document.querySelector('.last-operations')
let list = document.querySelector('.operations-list')
let message = document.querySelector('.empty-history')
const invalidKey = document.querySelector('.invalid-key')
const cancelButton = document.querySelector('.cancel-button')
const blurDiv = document.querySelector('.blur')

let numbers = ['1','2','3','4','5','6','7','8','9','0']
let operations = ['+', '-', '*' , '^', '/', '%', '.', '=', 'Backspace', 'Enter', 'Shift', '(', ')']
let bracketsArray = []

function storeArray(arr){
    localStorage.setItem('history-list', JSON.stringify(arr))
}

let array = JSON.parse(localStorage.getItem('history-list')) ? JSON.parse(localStorage.getItem('history-list')) : []
for(let i=0 ;i<array.length; i++){
    setList(array[i])
}

function setList(value){
    const li = document.createElement('li')
    li.textContent = value + "\n=" + math.evaluate(value)
    li.style.whiteSpace = 'pre-line'
    list.appendChild(li)
}

buttons.forEach(button => {
    button.addEventListener('click', (e)=>{
        e.preventDefault()
        list.style.display = 'none'
        message.style.display = 'none'
        switch(button.dataset.action){
            case 'equal' : equal()
            break
            case 'clear' : result.textContent = ''
            break
            case 'delete' : result.textContent = result.textContent.slice(0, result.textContent.length-1)
            break
            case 'double' : result.textContent += "*" + result.textContent[result.textContent.length-1]
            break
            case 'power' : result.textContent += "^"
            break
            default :
                switch(true){
                    case result.textContent[result.textContent.length-1] == '.' && button.textContent == '.' : break
                    case !numbers.includes(result.textContent[result.textContent.length-1]) && button.textContent == '.' : break
                    case button.textContent == '(' : 
                        if(result.textContent[result.textContent.length-1] != '('){
                            bracketsArray.push('(')
                            result.textContent += '('
                        }
                        break
                    case button.textContent == ')' : 
                        checkBracket()
                        break
                    case (result.textContent.slice(-1) == '(' || result.textContent.slice(-1) == ')') :
                        result.textContent += button.textContent
                        break
                    case !numbers.includes(button.textContent) && !numbers.includes(result.textContent[result.textContent.length-1]) : break
                    default : result.textContent += button.textContent

                }
        }
    })
})

function equal(){
    if(bracketsArray.length != 0) return
    if(array.length == 5){
        array = array.slice(1)
        storeArray(array)
        list.removeChild(list.firstChild)
    }
    array[array.length] = result.textContent
    storeArray(array)
    setList(result.textContent)
    result.textContent = math.evaluate(result.textContent)
    message.style.display = 'none'
}

lastOperations.addEventListener('click', (e)=>{
    e.preventDefault()
    if(array.length == 0) message.style.display = message.style.display == "block" ? "none" : "block"
    else list.style.display = list.style.display == "block" ? "none" : "block"
})

function checkBracket(){
    if(bracketsArray.length == 0 || result.textContent[result.textContent.length-1] == '(') return
    bracketsArray.pop()
    result.textContent += ')'
}

document.addEventListener('keydown', (e)=>{
    e.preventDefault()
    switch(e.key){
        case 'Backspace' : result.textContent = result.textContent.slice(0, result.textContent.length-1)
        break
        case '=' : case 'Enter' : equal()
        break
        case 'Shift' : break
        case '(' :
            if(result.textContent[result.textContent.length-1] != '('){
                bracketsArray.push('(')
                result.textContent += '('
            }
            break
        case ')' : checkBracket()
           break
        default :
            if(numbers.includes(e.key) || operations.includes(e.key)){
                if(result.textContent[result.textContent.length-1] == '.' && e.key == '.') break
                else if(!numbers.includes(result.textContent[result.textContent.length-1]) && e.key == '.') break
                else if((result.textContent.slice(-1) == '(' || result.textContent.slice(-1) == ')')){
                    result.textContent += e.key
                    return
                } 
                else if(!numbers.includes(e.key) && !numbers.includes(result.textContent[result.textContent.length-1])) break
                result.textContent += e.key
            }else{
                invalidKey.style.display = 'block'
                blurDiv.style.display = 'block'
            }
    }
})

cancelButton.addEventListener('click', (e)=>{
    e.preventDefault()
    invalidKey.style.display = 'none'
    blurDiv.style.display = 'none'
})