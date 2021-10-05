import { Race } from "./race.model";
import { Trait } from "./trait.model";

export interface NonPlayerCharacter {
    name: string;
    traits: Trait[];
    race: Race;
    alignment: string;
    sex: string;
    age: number;
    ageGroup: string;
    height: number;
    weight: number;
}

/** Age groups (for Humans):
 * > Child (0 - 10 years)
 * > Adolescent (10 - 18 years)
 * > Adult (18 - 40 years)
 * > Middle-aged (40 - 60 years)
 * > Elderly (60 - 100 years)
 */

/** Age group ratios (for All):
 * > Child (0 years-old to ageAdolescent)
 * > Adolescent (ageAdolescent to ageAdult)
 * > Adult (ageAdult to (ageLifespan * 0.4))
 * > Middle-aged ((ageLifespan * 0.4) to (ageLifespan * 0.6))
 * > Senior ((ageLifespan * 0.6) to ageLifespan)
 */