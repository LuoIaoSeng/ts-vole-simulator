export enum Flags {
    CONTINUE,
    JUMP,
    HALT
}

export default class VoleRuntime {

    registers: Array<number> = new Array(16)
    memories: Array<number> = new Array(256)
    counter: number = 0x00
    instructionRegister: Array<number> = Array(2)
    flag: Flags = Flags.CONTINUE
    consoleElement: HTMLDivElement

    execute = () => {
        //@ts-ignore
        while (this.flag !== Flags.HALT) {
            if (this.flag === Flags.JUMP) {
                this.print(`Jump to 0x${this.counter.toString(16)}\n`)
            }
            this.readInstrcution()
            this.encodeInstruction()
        }
    }

    private print(str: string) {
        this.consoleElement.append(str)
    }

    private printInstruction = (opCode: number, operand1: number, operand2: number, operand3: number) => {
        switch (opCode) {
            case 0x01:
                this.print(`Load register 0x${operand1.toString(16)} with memory cell 0x${operand2.toString(16)}${operand3.toString(16)}`)
                break
            case 0x02:
                this.print(`Load register 0x${operand1.toString(16)} with 0x${operand2.toString(16)}${operand3.toString(16)}`)
                break
            case 0x03:
                this.print(`Store register 0x${operand1.toString(16)} in memory cell 0x${operand2.toString(16)}${operand3.toString(16)}`)
                break
            case 0x04:
                this.print(`Move register 0x${operand2.toString(16)} to register 0x${operand3.toString(16)}`)
                break
            case 0x05:
            case 0x06:
                this.print(`Register 0x${operand1.toString(16)} equals to register 0x${operand2.toString(16)} add register 0x${operand3.toString(16)}`)
                break
            case 0x07:
                this.print(`Register 0x${operand1.toString(16)} equals to register 0x${operand2.toString(16)} or register 0x${operand3.toString(16)}`)
                break
            case 0x08:
                this.print(`Register 0x${operand1.toString(16)} equals to register 0x${operand2.toString(16)} and register 0x${operand3.toString(16)}`)
                break
            case 0x09:
                this.print(`Register 0x${operand1.toString(16)} equals to register 0x${operand2.toString(16)} xor register 0x${operand3.toString(16)}`)
                break
            case 0x0a:
                this.print(`Rotate register 0x${operand1.toString(16)} one bit to the right ${operand3.toString(16)} times`)
                break
            case 0x0b:
                this.print(`If register 0x00 equals to register 0x${operand1.toString(16)} then Jump to memory cell 0x${operand2.toString(16)}${operand3.toString(16)}`)
                break
            case 0x0c:
                this.print(`HALT`)
                break
        }
        this.print('\n')
    }

    private readInstrcution = () => {
        this.instructionRegister[0] = this.memories[this.counter]
        this.instructionRegister[1] = this.memories[this.counter + 1]
        this.counter += 2
    }

    private encodeInstruction = () => {
        let opCode = this.instructionRegister[0] >> 4
        let operand1 = this.instructionRegister[0] & 0x0F
        let operand2 = this.instructionRegister[1] >> 4
        let operand3 = this.instructionRegister[1] & 0x0F

        this.printInstruction(opCode, operand1, operand2, operand3)

        switch (opCode) {
            case 0x1:
                this.registers[operand1] = this.memories[(operand2 << 4) + operand3]
                this.flag = Flags.CONTINUE
                break
            case 0x2:
                this.registers[operand1] = (operand2 << 4) + operand3
                this.flag = Flags.CONTINUE
                break
            case 0x3:
                this.memories[(operand2 << 4) + operand3] = this.registers[operand1]
                this.flag = Flags.CONTINUE
                break
            case 0x4:
                this.registers[operand3] = this.registers[operand2]
                this.flag = Flags.CONTINUE
                break
            case 0x5:
            case 0x6:
                this.registers[operand1] = this.registers[operand2] + this.registers[operand3]
                this.flag = Flags.CONTINUE
                break
            case 0x7:
                this.registers[operand1] = this.registers[operand2] | this.registers[operand3]
                this.flag = Flags.CONTINUE
                break
            case 0x8:
                this.registers[operand1] = this.registers[operand2] & this.registers[operand3]
                this.flag = Flags.CONTINUE
                break
            case 0x9:
                this.registers[operand1] = this.registers[operand2] ^ this.registers[operand3]
                this.flag = Flags.CONTINUE
                break
            case 0xA:
                let temp = this.registers[operand1]
                this.registers[operand1] = (temp >> operand3) | (temp << (8 - operand3)) & 0xFF
                this.flag = Flags.CONTINUE
                break
            case 0xB:
                if (this.registers[operand1] === this.registers[0x00]) {
                    this.counter = (operand2 << 4) + operand3
                }
                this.flag = Flags.JUMP
                break
            case 0xC:
                if (operand1 | operand2 | operand3) {
                    this.print("HALT instruction is not completely correct\n")
                }
                this.flag = Flags.HALT
                break
        }
    }

    constructor(consoleElement: HTMLDivElement) {
        this.consoleElement = consoleElement
        this.registers.fill(0)
        this.memories.fill(0)
    }
}