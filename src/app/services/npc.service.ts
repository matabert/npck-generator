import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Race } from '../models/race.model';
import { NonPlayerCharacter } from '../models/npc.model';
import { Trait } from '../models/trait.model';

import traitList from '../../assets/traits/personality.json';
import raceList from '../../assets/races.json';

// Names for all races excluding Humans
import dragonbornNames from '../../assets/names/dragonborn.json';
import dwarfNames from '../../assets/names/dwarf.json';
import elfNames from '../../assets/names/elf.json';
import gnomeNames from '../../assets/names/gnome.json';
import halflingNames from '../../assets/names/halfling.json';
import orcNames from '../../assets/names/orc.json';
import tieflingNames from '../../assets/names/dragonborn.json';
// Names for Humans
import calishiteNames from '../../assets/names/human/calishite.json';
import chondathanNames from '../../assets/names/human/chondathan.json';
import damaranNames from '../../assets/names/human/damaran.json';
import illuskanNames from '../../assets/names/human/illuskan.json';
import mulanNames from '../../assets/names/human/mulan.json';
import rashemiNames from '../../assets/names/human/rashemi.json';
import shouNames from '../../assets/names/human/shou.json';
import turamiNames from '../../assets/names/human/turami.json';


@Injectable({
  providedIn: 'root'
})
export class NpcService {

  private generatedNPC: NonPlayerCharacter = <NonPlayerCharacter>{};
  private npc = new BehaviorSubject<NonPlayerCharacter>(this.generatedNPC);
  npcState = this.npc.asObservable();

  private _raceMasterList: Race[];
  private _traitMasterList: Trait[];
  private _numCharacterTraits: number = 3;

  constructor() {
    this._traitMasterList = traitList;
    this._raceMasterList = raceList;
  }

  //get traitMasterList(): Trait[] { return this.traitMasterList; }

  /**
   * Generate the NPC's personality from 3 traits personality traits.
   * Each individual trait has at least one trait that acts as its
   * opposite; a character cannot have a trait as well as its opposite.
   */
  chooseTraits(): Trait[] {
    const remainingTraits = [...this._traitMasterList];
    const traits: Trait[] = [];
    for(let i = 0; i < this._numCharacterTraits; i++) {
      const x = Math.floor(Math.random() * remainingTraits.length);
      const trait = remainingTraits.splice(x, 1).pop();
      /**
       * If the randomly-selected trait is the opposite of a trait the
       * character already has, do not add it to traitList and iterate
       * through the loop again.
       */
      let opposite = false;
      for(let j = 0; j < traits.length; j++) {
        if(trait && traits[j].oppositeTraits.includes(trait.name)) {
          console.log(`${traits[j].name} is incompatible with ${trait.name}.`);
          opposite = true;
          break;
        }
      }
      if(opposite) {
        i--;
        continue;
      }
      /**
       * If the randomly-selected trait does not have one of its
       * opposites in the traits array, add it to the array of traits.
       */
      else {
        traits.push(trait!);
      }
    }
    console.log(traits);
    return traits;
  }

  /**
   * Choose the NPC's race from the enabled list of races. The selected
   * race affects other properties of the NPC such as height and weight.
   */
  chooseRace(): Race {
    const enabledRaces = [...this._raceMasterList];
    
    /**
     * TODO: use a FormGroup from the settings-menu component to allow the
     * user to control which races can be randomly chosen.
     */
    const x = Math.floor(Math.random() * enabledRaces.length);
    const chosenRace = enabledRaces.splice(x, 1).pop();
    console.log(dragonbornNames);
    return chosenRace!;
  }

  /**
   * Using the passed Race, determine the NPC's age, height, and weight
   * using the given base values and the appropriate modifiers. Returns
   * an array of numbers where index 0 is age, index 1 is height, index
   * 2 is weight.
   */
  choosePhysicality(race: Race): number[] {
    let height = race.baseHeight;
    let weight = race.baseWeight;

    let heightModifier = 0;
    for(let i = 0; i < race.heightModifier[0]; i++) {
      heightModifier += (Math.floor(Math.random() * race.heightModifier[1]) + 1);
    }

    let weightModifier = 0;
    for(let j = 0; j < race.weightModifier[0]; j++) {
      weightModifier += (Math.floor(Math.random() * race.weightModifier[1]) + 1);
    }

    height += heightModifier;
    weight += (heightModifier * weightModifier);
    /**
     * TODO: using the FormGroup from the settings-menu component, place
     * the NPC's age according to the selected options.
     */
    let age = race.ageAdulthood;
    //Finish age code here

    return [age, height, weight];
  }

  /**
   * If the NPC's sex is not pre-selected, determine it randomly via
   * either a 0 or a 1.
   */
  chooseSex(): string {
    if(Math.round(Math.random()) === 0) {
      return 'Male';
    } else {
      return 'Female';
    }
  }

  /**
   * 
   * @param race
   * @param sex
   */
  chooseName(race: string, sex: string): string {
    let givenNames: string[] = [];
    let surnames: string[] = [];
    /**
     * Build the array of potential names for the NPC based off the NPC's
     * race and then gender.
     */
    switch(race) {
      case 'Dragonborn':
        console.log('Dragonborn name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, dragonbornNames.male) : givenNames.push.apply(givenNames, dragonbornNames.female);
        surnames.push.apply(surnames, dragonbornNames.surname);
        break;
      case 'Mountain Dwarf':
      case 'Hill Dwarf':
        console.log('Dwarf name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, dwarfNames.male) : givenNames.push.apply(givenNames, dwarfNames.female);
        surnames.push.apply(surnames, dwarfNames.surname);
        break;
      case 'Drow':
      case 'Wood Elf':
      case 'High Elf':
        console.log('Elf name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, elfNames.male) : givenNames.push.apply(givenNames, elfNames.female);
        surnames.push.apply(surnames, elfNames.surname);
        break;
      case 'Forest Gnome':
      case 'Rock Gnome':
        console.log('Gnome name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, gnomeNames.male) : givenNames.push.apply(givenNames, gnomeNames.female);
        surnames.push.apply(surnames, gnomeNames.surname);
        break;
      case 'Half-Elf':
        console.log('Half-Elf name!');
        break;
      case 'Half-Orc':
        console.log('Half-Orc name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, orcNames.male) : givenNames.push.apply(givenNames, orcNames.female);
        break;
      case 'Stout Halfling':
      case 'Lightfoot Halfling':
        console.log('Halfling name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, halflingNames.male) : givenNames.push.apply(givenNames, halflingNames.female);
        surnames.push.apply(surnames, halflingNames.surname);
        break;
      case 'Tiefling':
        console.log('Tiefling name!');
        sex === 'Male' ? givenNames.push.apply(givenNames, tieflingNames.male) : givenNames.push.apply(givenNames, tieflingNames.female);
        surnames.push.apply(surnames, tieflingNames.surname);
        break;
      // Apply Human names in the default case
      default:
        console.log('Human names!');
        if(sex === 'Male') {
          givenNames.push.apply(givenNames, calishiteNames.male);
          givenNames.push.apply(givenNames, chondathanNames.male);
          givenNames.push.apply(givenNames, damaranNames.male);
          givenNames.push.apply(givenNames, illuskanNames.male);
          givenNames.push.apply(givenNames, mulanNames.male);
          givenNames.push.apply(givenNames, rashemiNames.male)
          givenNames.push.apply(givenNames, shouNames.male)
          givenNames.push.apply(givenNames, turamiNames.male);
        } else {
          givenNames.push.apply(givenNames, calishiteNames.female);
          givenNames.push.apply(givenNames, chondathanNames.female);
          givenNames.push.apply(givenNames, damaranNames.female);
          givenNames.push.apply(givenNames, illuskanNames.female);
          givenNames.push.apply(givenNames, mulanNames.female);
          givenNames.push.apply(givenNames, rashemiNames.female)
          givenNames.push.apply(givenNames, shouNames.female)
          givenNames.push.apply(givenNames, turamiNames.female);
        }
        surnames.push.apply(surnames, calishiteNames.surname);
        surnames.push.apply(surnames, chondathanNames.surname);
        surnames.push.apply(surnames, damaranNames.surname);
        surnames.push.apply(surnames, illuskanNames.surname);
        surnames.push.apply(surnames, mulanNames.surname);
        surnames.push.apply(surnames, rashemiNames.surname);
        surnames.push.apply(surnames, shouNames.surname);
        surnames.push.apply(surnames, turamiNames.surname);
        break;
    }

    //Randomly select a name from the arrays
    return `${givenNames[Math.floor(Math.random() * givenNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  }


  /**
   * Getters for the NonPlayerCharacter instance generatedNPC.
   */
  getNpcName(): string { return this.generatedNPC.name; }
  getNpcTraits(): Trait[] { return this.generatedNPC.traits; }
  getNpcRace(): string { return this.generatedNPC.race.name; }
  getNpcHeight(): number { return this.generatedNPC.height; }
  getNpcWeight(): number { return this.generatedNPC.weight; }
  getNpcAge(): number { return this.generatedNPC.age; }
  getNpcAlignment(): string { return this.generatedNPC.alignment; }
  getNpcSex(): string { return this.generatedNPC.sex; }

  /**
   * Getters for other class properties
   */
  get raceMasterList(): Race[] { return this._raceMasterList; }


/**
 * Calls all relevant functions to determine generatedNPC's
 * properties.
 */
buildNpc(): void {
  console.log('new npc!');
  this.generatedNPC = {} as NonPlayerCharacter;
  this.generatedNPC.alignment = "Neutral";
  this.generatedNPC.race = this.chooseRace();
  const phys = this.choosePhysicality(this.generatedNPC.race);
  this.generatedNPC.age = phys[0];
  this.generatedNPC.height = phys[1];
  this.generatedNPC.weight = phys[2];
  this.generatedNPC.traits = this.chooseTraits();
  this.generatedNPC.sex = this.chooseSex();

  this.generatedNPC.name = this.chooseName(this.generatedNPC.race.name, this.generatedNPC.sex);
}

}