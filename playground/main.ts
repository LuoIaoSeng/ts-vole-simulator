import VoleRuntime, { Flags } from "./runtime"

let executeButton = document.querySelector('#executeButton') as HTMLDivElement
let programInputElement = document.querySelector('#programInput') as HTMLInputElement
let counterInputElement = document.querySelector('#counterInput') as HTMLInputElement
let memoryListElement = document.querySelector('#memoryList') as HTMLDivElement
let registerListElement = document.querySelector('#registerList') as HTMLDivElement
let consoleListElement = document.querySelector('#console') as HTMLDivElement

let runtime = new VoleRuntime(consoleListElement)

for (let i = 0; i < 16; i++) {
    let tempElement = document.createElement('div')
    tempElement.className = "w-full flex p-4 justify-between md:px-16"
    tempElement.setAttribute("data-id", `register-address-${i}`)
    tempElement.innerHTML = `
        <div>Address: 0x0${i.toString(16).toUpperCase()}</div>
        <div>Value: 0x00</div>
    `
    registerListElement.append(tempElement)
}

for (let i = 0; i < 256; i++) {
    let tempElement = document.createElement('div')
    tempElement.className = "w-full flex p-4 justify-between md:px-16"
    tempElement.setAttribute("data-id", `memory-address-${i}`)
    tempElement.innerHTML = `
        <div>Address: 0x${i < 0x10 ? '0' : ''}${i.toString(16).toUpperCase()}</div>
        <div>Value: 0x00</div>
    `
    memoryListElement.append(tempElement)
}

function updateProgram() {
    runtime.registers.forEach((v, i) => {
        (document.querySelector(`[data-id=register-address-${i}] > div:nth-child(2)`) as HTMLDivElement).innerHTML = `Value: 0x${v < 0x10 ? '0' : ''}${v.toString(16)}`
    })
    runtime.memories.forEach((v, i) => {
        (document.querySelector(`[data-id=memory-address-${i}] > div:nth-child(2)`) as HTMLDivElement).innerHTML = `Value: 0x${v < 0x10 ? '0' : ''}${v.toString(16)}`
    })
}

executeButton.addEventListener('click', () => {
    let programString = programInputElement.value
    let program = programString.split(' ').filter((v) => { return v !== '' })
    let counterString = counterInputElement.value
    runtime.memories.fill(0)
    runtime.registers.fill(0)
    runtime.counter = parseInt(counterString === '' ? program[0] : counterString)
    runtime.flag = Flags.CONTINUE
    for (let i = 0; i < program.length; i += 2) {
        runtime.memories[parseInt(program[i])] = parseInt(program[i + 1])
    }
    runtime.execute()
    updateProgram()
})
