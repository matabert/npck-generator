export interface Race {
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
    subRaces?: SubRace[];

}

export interface SubRace {
    subName: string;
    subBaseHeight?: number;
    subBaseWeight?: number;
    subHeightModifier?: number[];
    subWeightModifier?: number[];
    subPredisposedLaw?: number;
    subPredisposedMoral?: number;
}