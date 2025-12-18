class Ksana {
}

class SabdaDhatu {
    constructor(public ksana: Ksana) {}
}

export class Teaching {
    constructor(public sabdaDhatus: SabdaDhatu[]) {
    }
}

export class Monk {
    constructor(public isMeditating: boolean) {}

    heard(o: Teaching | SabdaDhatu): boolean {
        if (o instanceof Teaching) {
            return o.sabdaDhatus.every((sd) => this.heard(sd))
        }

        return sparsaArisesFor(this, o) && earConsciousnessAriseFor(this, o)
    }
}

// TODO: ear consciousness is personal to the 
const sparsaArisesFor = (x: any, sd: SabdaDhatu): boolean => {
    return sparsaArroseAt(sd.ksana) && earConsciousnessAriseFor(x, sd)
}

const earConsciousnessAriseFor = (x: any, sd: SabdaDhatu): boolean => {
    return earConsciousnessAroseAt(sd.ksana) && x.hasEarFeaculty(sd.ksana)
}
