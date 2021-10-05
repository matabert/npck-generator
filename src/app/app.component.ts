import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Race, SubRace } from './models/race.model';
import { Trait } from './models/trait.model';
import { NonPlayerCharacter } from './models/npc.model';

import trait_list from '../assets/traits/personality.json';
import race_list from '../assets/races.json';

// Names for all races excluding Humans
import dragonborn_names from '../assets/names/dragonborn.json';
import dwarf_names from '../assets/names/dwarf.json';
import elf_names from '../assets/names/elf.json';
import gnome_names from '../assets/names/gnome.json';
import halfling_names from '../assets/names/halfling.json';
import orc_names from '../assets/names/orc.json';
import tiefling_names from '../assets/names/dragonborn.json';
// Names for Humans
import calishite_names from '../assets/names/human/calishite.json';
import chondathan_names from '../assets/names/human/chondathan.json';
import damaran_names from '../assets/names/human/damaran.json';
import illuskan_names from '../assets/names/human/illuskan.json';
import mulan_names from '../assets/names/human/mulan.json';
import rashemi_names from '../assets/names/human/rashemi.json';
import shou_names from '../assets/names/human/shou.json';
import turami_names from '../assets/names/human/turami.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'NPC(K) Generator';
  numNpcTraits = 3;

  activeNpc!: NonPlayerCharacter;
  
  constructor(private httpClient: HttpClient) {
    this.buildNpc();
  }

  selectNpcTraits(): Trait[] {
    const remainingTraits = [...trait_list];
    const traits: Trait[] = [];
    for(let i = 0; i < this.numNpcTraits; i++) {
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
    return traits;
  }

  selectNpcRace(preSelectedRace?: string): Race {
    const enabledRaces = [...race_list];
    let x, chosenRace;
    if(preSelectedRace && preSelectedRace != 'Random') {
      chosenRace = enabledRaces.filter(race => { return race.name === preSelectedRace }).pop();
    } else {
      x = Math.floor(Math.random() * enabledRaces.length);
      chosenRace = enabledRaces.splice(x, 1).pop();
    }
    let npcsRace = JSON.parse(JSON.stringify(chosenRace));
    /**If chosenRace has subraces, randomly select a subrace
    *  and overwrite any base racial values with the subrace's
    * values, should they exist.
    */
    if(npcsRace.subRaces) {
      x = Math.floor(Math.random() * npcsRace.subRaces.length);
      let npcsSubRace = npcsRace.subRaces[x];
      npcsRace.name = `${chosenRace.name} (${chosenRace.subRaces[x].subName})`;
      if(npcsSubRace.subBaseHeight) { npcsRace.baseHeight = npcsSubRace.subBaseHeight; }
      if(npcsSubRace.subBaseWeight) { npcsRace.baseWeight = npcsSubRace.subBaseWeight; }
      if(npcsSubRace.subHeightModifier) { npcsRace.heightModifier = npcsSubRace.subHeightModifier }
      if(npcsSubRace.subWeightModifier) { npcsRace.weightModifier = npcsSubRace.subWeightModifier; }
      if(npcsSubRace.subPredisposedLaw) { npcsRace.predisposedLaw = npcsSubRace.subPredisposedLaw; }
      if(npcsSubRace.subPredisposedMoral) { npcsRace.predisposedMoral = npcsSubRace.subPredisposedMoral; }
    }
    npcsRace.subRaces = undefined;
    return npcsRace;
  }

  selectNpcGender(preSelectedGender?: string): string {
    if(preSelectedGender && preSelectedGender != 'Random') { return preSelectedGender; }
    
    if(Math.round(Math.random()) === 0) { return 'Male'; }
    
    return 'Female';
  }

  selectNpcPhysicality(race: Race, preSelectedAgeGroup?: string): number[] {
    let height = race.baseHeight;
    let weight = race.baseWeight;
    // Determine Height and Weight
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
     * By default, assume the NPC's age is at adult or above
     */
    let age, ageMin, ageMax;
    //Switch statement for setting minAge based on preSelectedAgeGroup
    switch(preSelectedAgeGroup) {
      case 'Random (All)':
      case 'Random (Juvenile)':
      case 'Child':
        ageMin = 0;
        break;
      case 'Adolescent':
        ageMin = race.ageAdolescent;
        break;
      case 'Middle-aged':
        ageMin = (race.ageLifespan * 0.4);
        break;
      case 'Senior':
        ageMin = (race.ageLifespan * 0.6);
        break;
      case 'Random (Mature)':
      case 'Adult':
      default:
        ageMin = race.ageAdulthood;
        break;
    }
    //Switch statement for setting maxAge based on preSelectedAgeGroup
    switch(preSelectedAgeGroup) {
      case 'Child':
        ageMax = race.ageAdolescent;
        break;
      case 'Adolescent':
      case 'Random (Juvenile)':
        ageMax = race.ageAdulthood;
        break;
      case 'Adult':
        ageMax = race.ageLifespan * 0.4;
        break;
      case 'Middle-aged':
        ageMax = race.ageLifespan * 0.6;
        break;
      case 'Random (All)':
      case 'Random (Mature)':
      case 'Senior':
      default: 
        ageMax = race.ageLifespan;
        break;
    }
    age = Math.floor(Math.random() * (ageMax - ageMin) + ageMin);
    
    return [age, height, weight];
  }

  /** Age group ratios (for all races):
  * > Child (0 years-old to ageAdolescent)
  * > Adolescent (ageAdolescent to ageAdult)
  * > Adult (ageAdult to (ageLifespan * 0.4))
  * > Middle-aged ((ageLifespan * 0.4) to (ageLifespan * 0.6))
  * > Elderly ((ageLifespan * 0.6) to ageLifespan)
   * @param race 
   * @param age 
   * @returns 
   */
  selectNpcAgeGroup(race: Race, age: number): string {
    if(age < race.ageAdolescent) { return 'Child'; }
    if(age >= race.ageAdolescent && age < race.ageAdulthood) { return 'Adolescent'; }
    if(age >= race.ageAdulthood && age < (race.ageLifespan * 0.4)) { return 'Adult'; }
    if(age >= (race.ageLifespan * 0.4) && age < (race.ageLifespan * 0.6)) { return 'Middle-aged'; }
    return 'Elderly';
  }

  buildNameMatrix(race: string, gender: string): string[][] {
    const names = [];
    const givenNames: string[] = [];
    const surnames: string[] = [];
    const baseRace = race.split(" ")[0];
    switch(baseRace) {
      case 'Dragonborn':
        gender === 'Male' ? givenNames.push.apply(givenNames, dragonborn_names.male) : givenNames.push.apply(givenNames, dragonborn_names.female);
        surnames.push.apply(surnames, dragonborn_names.surname);
        break;
      case 'Dwarf':
        gender === 'Male' ? givenNames.push.apply(givenNames, dwarf_names.male) : givenNames.push.apply(givenNames, dwarf_names.female);
        surnames.push.apply(surnames, dwarf_names.surname);
        break;
      case 'Elf':
        gender === 'Male' ? givenNames.push.apply(givenNames, elf_names.male) : givenNames.push.apply(givenNames, elf_names.female);
        surnames.push.apply(surnames, elf_names.surname);
        break;
      case 'Gnome':
        gender === 'Male' ? givenNames.push.apply(givenNames, gnome_names.male) : givenNames.push.apply(givenNames, gnome_names.female);
        surnames.push.apply(surnames, gnome_names.surname);
        break;
      case 'Halfling':
        gender === 'Male' ? givenNames.push.apply(givenNames, halfling_names.male) : givenNames.push.apply(givenNames, halfling_names.female);
        surnames.push.apply(surnames, halfling_names.surname);
        break;
      case 'Tiefling':
        gender === 'Male' ? givenNames.push.apply(givenNames, tiefling_names.male) : givenNames.push.apply(givenNames, tiefling_names.female);
        surnames.push.apply(surnames, tiefling_names.surname);
        break;
      /**
       * The default case handles human names, as well as half-elf and half-orc
       * names, since those draw from human and elf/orc names, respectively.
       */
      default:
        if(baseRace === 'Half-Elf') {
          gender === 'Male' ? givenNames.push.apply(givenNames, elf_names.male) : givenNames.push.apply(givenNames, elf_names.female);
          surnames.push.apply(surnames, elf_names.surname);
        }
        if(baseRace === 'Half-Orc') {
          gender === 'Male' ? givenNames.push.apply(givenNames, orc_names.male) : givenNames.push.apply(givenNames, orc_names.female);
          //No listed orc surnames
        }
        //Add human names
        if(gender === 'Male') {
          givenNames.push.apply(givenNames, calishite_names.male);
          givenNames.push.apply(givenNames, chondathan_names.male);
          givenNames.push.apply(givenNames, damaran_names.male);
          givenNames.push.apply(givenNames, illuskan_names.male);
          givenNames.push.apply(givenNames, mulan_names.male);
          givenNames.push.apply(givenNames, rashemi_names.male)
          givenNames.push.apply(givenNames, shou_names.male)
          givenNames.push.apply(givenNames, turami_names.male);
        } else {
          givenNames.push.apply(givenNames, calishite_names.female);
          givenNames.push.apply(givenNames, chondathan_names.female);
          givenNames.push.apply(givenNames, damaran_names.female);
          givenNames.push.apply(givenNames, illuskan_names.female);
          givenNames.push.apply(givenNames, mulan_names.female);
          givenNames.push.apply(givenNames, rashemi_names.female)
          givenNames.push.apply(givenNames, shou_names.female)
          givenNames.push.apply(givenNames, turami_names.female);
        }
        surnames.push.apply(surnames, calishite_names.surname);
        surnames.push.apply(surnames, chondathan_names.surname);
        surnames.push.apply(surnames, damaran_names.surname);
        surnames.push.apply(surnames, illuskan_names.surname);
        surnames.push.apply(surnames, mulan_names.surname);
        surnames.push.apply(surnames, rashemi_names.surname);
        surnames.push.apply(surnames, shou_names.surname);
        surnames.push.apply(surnames, turami_names.surname);
        break;
    }
    names[0] = givenNames;
    names[1] = surnames;
    return names;
  }

  selectNpcName(race: string, gender: string): string {
    const nameOptions = this.buildNameMatrix(race, gender);
    return `${nameOptions[0][Math.floor(Math.random() * nameOptions[0].length)]} ${nameOptions[1][Math.floor(Math.random() * nameOptions[1].length)]}`;
  }

  /**
   * An NPC's alignment starts at their race's recommmended alignment as per 
   * their respective official sourcebook (e.g. "Elves...  lean strongly toward 
   * the gentler aspects of chaos." - PHB). Their traits will then alter their 
   * alignment from that base value.
   */
  selectNpcAlignment(race: Race, traits: Trait[]): string {
    let alignment;
    let lawValue = race.predisposedLaw;
    let moralValue = race.predisposedMoral;
    for(let i = 0; i < traits.length; i++) {
      lawValue += traits[i].lawAxisShift;
      moralValue += traits[i].moralAxisShift;
    }
    if(lawValue >= 1) { alignment = 'Lawful'; }
    else if(lawValue <= -1) { alignment = 'Chaotic'; }
    else { alignment = 'Neutral'; }

    if(moralValue >= 1) { alignment += ' Good'; }
    else if(moralValue <= -1) { alignment += ' Evil'; }
    else { alignment += ' Neutral'; }
    
    if(alignment === 'Neutral Neutral'){ alignment = 'Neutral'; }

    return alignment;
  }

  buildNpc(options?: FormGroup): void {
    const npc = {} as NonPlayerCharacter;
    npc.race = this.selectNpcRace(options?.get('race')?.value);
    npc.traits = this.selectNpcTraits();
    npc.sex = this.selectNpcGender(options?.get('sex')?.value);
    npc.name = this.selectNpcName(npc.race.name, npc.sex);
    const physicality = this.selectNpcPhysicality(npc.race, options?.get('age')?.value);
    npc.age = physicality[0];
    npc.height = physicality[1];
    npc.weight = physicality[2];
    npc.ageGroup = this.selectNpcAgeGroup(npc.race, npc.age);
    npc.alignment = this.selectNpcAlignment(npc.race, npc.traits);
    this.activeNpc = npc;
  }
}

enum MoralAxis {
  G = 1,  //Good
  N = 0,  //Neutral
  E = -1  //Evil
}
enum LawAxis {
  L = 1,  //Lawful
  N = 0,  //Neutral
  C = -1  //Chaotic
}

enum Alignment {
  LG = LawAxis.L + MoralAxis.G,
  NG = LawAxis.N + MoralAxis.G,
  CG = LawAxis.C + MoralAxis.G,
  LN = LawAxis.L + MoralAxis.N,
  N = LawAxis.N + MoralAxis.N,
  CN = LawAxis.C + MoralAxis.N,
  LE = LawAxis.L + MoralAxis.E,
  NE = LawAxis.N + MoralAxis.E,
  CE = LawAxis.C + MoralAxis.E
}