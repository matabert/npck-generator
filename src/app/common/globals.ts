// Models
import { Race, SubRace } from '../models/race.model';
import { Trait } from '../models/trait.model';

// Data
import trait_list from 'src/assets/traits/personality.json';
import race_list from 'src/assets/races.json';

// Chracter names...
// ... for all races excluding Humans
import dragonborn_names from 'src/assets/names/dragonborn.json';
import dwarf_names from 'src/assets/names/dwarf.json';
import elf_names from 'src/assets/names/elf.json';
import gnome_names from 'src/assets/names/gnome.json';
import halfling_names from 'src/assets/names/halfling.json';
import orc_names from 'src/assets/names/orc.json';
import tiefling_names from 'src/assets/names/dragonborn.json';
// .. for Humans
import calishite_names from 'src/assets/names/human/calishite.json';
import chondathan_names from 'src/assets/names/human/chondathan.json';
import damaran_names from 'src/assets/names/human/damaran.json';
import illuskan_names from 'src/assets/names/human/illuskan.json';
import mulan_names from 'src/assets/names/human/mulan.json';
import rashemi_names from 'src/assets/names/human/rashemi.json';
import shou_names from 'src/assets/names/human/shou.json';
import turami_names from 'src/assets/names/human/turami.json';

export interface RaceOption {
    name: string;
    id: string;
}

export class Globals {
    
    public static NUM_TRAITS = 3;

    public static races: Race[] = [...race_list];

    public static fullRacesArray: Race[] = Globals.initFullRacesArray(Globals.races);

    public static raceOptionsArray: RaceOption[] = Globals.initRaceOptionsArray(Globals.fullRacesArray);

    public static sexSelectionArray: string[] = ['Random', 'Male', 'Female'];

    public static traits: Trait[] = [...trait_list];

    public static alignments: string[] = [
        'Lawful Good', 
        'Neutral Good', 
        'Chaotic Good',
        'Lawful Neutral',
        'Neutral',
        'Chaotic Neutral',
        'Lawful Evil',
        'Neutral Evil',
        'Chaotic Evil'
    ];
    
    static initFullRacesArray(races: Race[]): Race[] {
        const allRaces: Race[] = [];
        //push each race into allRaces, including making each subrace into a seperate race object
        for(let i = 0; i < races.length; i++) {
            if(races[i].subRaces.length > 0){
                for(let j = 0; j < races[i].subRaces.length; j++) {
                    allRaces.push(Globals.buildSubrace(races[i], races[i].subRaces[j]));
                }
            } else {
                allRaces.push(races[i]);
            }
        }
        return allRaces;
    }

    static buildSubrace(baseRace: Race, subrace: SubRace): Race {
        let fullSubrace = {...baseRace};
        fullSubrace.name = `${baseRace.name} (${subrace.subName})`;
        fullSubrace.id = subrace.id;
        //For any values that the subrace has, overwrite the values of the base race
        if(subrace.subBaseHeight) { fullSubrace.baseHeight = subrace.subBaseHeight; }
        if(subrace.subBaseWeight) { fullSubrace.baseWeight = subrace.subBaseWeight; }
        if(subrace.subHeightModifier) { fullSubrace.heightModifier = subrace.subHeightModifier }
        if(subrace.subWeightModifier) { fullSubrace.weightModifier = subrace.subWeightModifier; }
        if(subrace.subPredisposedLaw) { fullSubrace.predisposedLaw = subrace.subPredisposedLaw; }
        if(subrace.subPredisposedMoral) { fullSubrace.predisposedMoral = subrace.subPredisposedMoral; }
        fullSubrace.subRaces = [];
        return fullSubrace;
    }

    static initRaceOptionsArray(allRaces: Race[]): RaceOption[] {
        const raceOptions: RaceOption[] = [];
        for(let i = 0; i < allRaces.length; i++) {
            raceOptions.push({name: allRaces[i].name, id: allRaces[i].id} as RaceOption);
        }
        return raceOptions;
    }
}