import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Trait } from 'src/app/models/trait.model';
import { NonPlayerCharacter } from 'src/app/models/npc.model';
import { Globals } from 'src/app/common/globals';


@Component({
  selector: 'app-npc-display',
  templateUrl: './npc-display.component.html',
  styleUrls: ['./npc-display.component.scss']
})
export class NpcDisplayComponent implements OnInit {

  @Input() displayedNpc: NonPlayerCharacter;
  @Input() enableEditing: boolean;

  @Output() flipChangesFlag: EventEmitter<null> = new EventEmitter<null>();
  @Output() saveChanges: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  
  changesForm: FormGroup;
  nameControl: FormControl;
  raceControl: FormControl;
  alignmentControl: FormControl;
  sexControl: FormControl;
  ageControl: FormControl;
  heightControl: FormControl;
  weightControl: FormControl;
  firstTraitControl: FormControl;
  secondTraitControl: FormControl;
  thirdTraitControl: FormControl;

  sexSelection = Globals.sexSelectionArray;
  traitSelection = Globals.traits;
  raceSelection = Globals.fullRacesArray;
  alignmentSelection = Globals.alignments;

  readableHeight(num: number): string { return (`${Math.floor(num/12)}' ${num%12}"`); }

  readableWeight(num: number): string { return (`${num} lbs.`); }

  /**
   * Determines whether or not a trait is selectable in the select
   * lists while editing a generated NPC.
   * @param trait 
   * @param index: represents whether the first, second, or third 
   * @returns true if passed trait is selectable because the trait
   * does not exist in any other trait slots and is not opposite to
   * any of the already-possessed traits.
   */
  unselectableTrait(trait: string, index: number): boolean {
    //False if trait would be a duplicate
    if(index === 1 &&
      (this.secondTraitControl.value.name === trait || this.thirdTraitControl.value.name === trait)) {
        return true;
    }
    if(index === 2 &&
      (this.firstTraitControl.value.name === trait || this.thirdTraitControl.value.name === trait)) {
        return true;
    }
    if(index === 3 && 
      (this.firstTraitControl.value.name === trait || this.secondTraitControl.value.name === trait)) {
        return true;
    }
    //
    if(index != 1 && this.firstTraitControl.value.oppositeTraits.includes(trait)) {
      return true;
    }
    if(index != 2 && this.secondTraitControl.value.oppositeTraits.includes(trait)) {
      return true;
    }
    if(index != 3 && this.thirdTraitControl.value.oppositeTraits.includes(trait)) {
      return true;
    }
    return false;
  }


  constructor(private fb: FormBuilder) {
    this.displayedNpc = {} as NonPlayerCharacter;
    this.enableEditing = false;
    this.changesForm = new FormGroup({
      npcName: this.nameControl = new FormControl(null),
      npcRace: this.raceControl = new FormControl(null),
      npcAlignment: this.alignmentControl = new FormControl(null),
      npcSex: this.sexControl = new FormControl(null),
      npcAge: this.ageControl = new FormControl(null),
      npcHeight: this.heightControl = new FormControl(null),
      npcWeight: this.weightControl = new FormControl(null),
      npcTraitA: this.firstTraitControl = new FormControl(null),
      npcTraitB: this.secondTraitControl = new FormControl(null),
      npcTraitC: this.thirdTraitControl = new FormControl(null)
    });
  }

  ngOnInit(): void { this.changesForm = this.resetChangesForm(); }

  enableChangesEmitter(): void { this.flipChangesFlag.emit(); }

  resetChangesForm(): FormGroup {
    return new FormGroup({
      npcName: this.nameControl = new FormControl(this.displayedNpc.name),
      npcRace: this.raceControl = new FormControl(this.displayedNpc.race.id),
      npcAlignment: this.alignmentControl = new FormControl(this.displayedNpc.alignment),
      npcSex: this.sexControl = new FormControl(this.displayedNpc.sex),
      npcAge: this.ageControl = new FormControl(this.displayedNpc.age),
      npcHeight: this.heightControl = new FormControl(this.displayedNpc.height),
      npcWeight: this.weightControl = new FormControl(this.displayedNpc.weight),
      npcTraitA: this.firstTraitControl = new FormControl(this.displayedNpc.traits[0]),
      npcTraitB: this.secondTraitControl = new FormControl(this.displayedNpc.traits[1]),
      npcTraitC: this.thirdTraitControl = new FormControl(this.displayedNpc.traits[2])
    });
  }

  discardChangesEmitter(): void {
    this.resetChangesForm();
    this.flipChangesFlag.emit(); 
  }

  saveChangesEmitter(): void {
    this.saveChanges.emit(this.changesForm);
  }

}
