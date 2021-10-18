export interface Race {
    id: string;
    name: string;
    ageAdolescent: number;
    ageAdulthood: number;
    ageLifespan: number;
    baseHeight: number;
    baseWeight: number;
    heightModifier: number[];
    weightModifier: number[];
    predisposedLaw: number;
    predisposedMoral: number;
    subRaces: SubRace[];
}

export interface SubRace {
    id: string;
    subName: string;
    subBaseHeight?: number;
    subBaseWeight?: number;
    subHeightModifier?: number[];
    subWeightModifier?: number[];
    subPredisposedLaw?: number;
    subPredisposedMoral?: number;
}