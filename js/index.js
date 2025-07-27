const result = document.querySelector('.result-label')
const calculater = document.querySelector('.calculater')
const buttons = document.querySelectorAll('.calculater button')

const lastOperations = document.querySelector('.last-operations')
let list = document.querySelector('.operations-list')
let message = document.querySelector('.empty-history')

let numbers = ['1','2','3','4','5','6','7','8','9','0']
let operations = ['+', '-', '*' , '^', '/', '%', '.', '=', 'Backspace', 'Enter', 'Shift']

let map = {}

buttons.forEach(button => {
    button.addEventListener('click', (e)=>{
        e.preventDefault()
        list.style.display = 'none'
        message.style.display = 'none'
        if(button.className == 'equal-operation'){
            equal()
        }else if(button.className == 'clear-operation'){
            result.textContent = ''
        }else if(button.className == 'delete-operation'){
            result.textContent = result.textContent.slice(0, result.textContent.length-1)
        }else if(button.className == 'double'){
            result.textContent += "*" + result.textContent[result.textContent.length-1]
        }else if(button.className == 'power'){
            result.textContent += "^"
        }else{
            if(result.textContent[result.textContent.length-1] == '.' && button.textContent == '.') return
            else if(!numbers.includes(result.textContent[result.textContent.length-1]) && button.textContent == '.') return
            else if(button.className != 'number' && !numbers.includes(result.textContent[result.textContent.length-1])) return
            else result.textContent += button.textContent
        }
    })
})

function equal(){
    result.textContent = result.textContent.replaceAll("^", "**")
    if(Object.keys(map).length == 5){
        map = Object.keys(map).slice(1)
        list.removeChild(list.firstChild)
    }
    map[Object.keys(map).length] = result.textContent
    const li = document.createElement('li')
    li.textContent = result.textContent + "\n=" + eval(result.textContent)
    li.style.whiteSpace = 'pre-line'
    list.appendChild(li)
    result.textContent = eval(result.textContent)
    message.style.display = 'none'
}

lastOperations.addEventListener('click', (e)=>{
    e.preventDefault()
    list.style.display = list.style.display == "block" ? "none" : "block"
    message.style.display = message.style.display == "block" ? "none" : "block"
})

document.addEventListener('keydown', (e)=>{
    e.preventDefault()
    if(e.key == 'Backspace'){
        result.textContent = result.textContent.slice(0, result.textContent.length-1)
    }else if(e.key == '=' || e.key =='Enter'){
        equal()
    }else if(e.key == 'Shift'){ return
    }else if(numbers.includes(e.key) || operations.includes(e.key)){
        // ex --> ".." (not acceptable)
        if(result.textContent[result.textContent.length-1] == '.' && e.key == '.') return
        // ex --> ".+" (not acceptable)
        else if(!numbers.includes(result.textContent[result.textContent.length-1]) && e.key == '.') return
        // ex --> "++" (not acceptable)
        else if(!numbers.includes(e.key) && !numbers.includes(result.textContent[result.textContent.length-1])) return
        result.textContent += e.key
    }
    else alert('invalid key')
})