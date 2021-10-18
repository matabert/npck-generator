import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Race, SubRace } from 'src/app/models/race.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { RaceOption, Globals } from '../../common/globals';

@Component({
  selector: 'app-option-select',
  templateUrl: './option-select.component.html',
  styleUrls: ['./option-select.component.scss']
})
export class OptionSelectComponent implements OnInit {

  @Output() buildNewNpc: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  raceOptions: RaceOption[] = [...Globals.raceOptionsArray];
  sexOptions: string[] = Globals.sexSelectionArray;
  ageOptions: string[] = ['Random (All)', 'Random (Juvenile)', 'Random (Mature)', 'Child', 'Adolescent', 'Adult', 'Middle-aged', 'Senior'];
  
  optionsForm: FormGroup;
  
  // Default options for form fields
  raceControl: FormControl;
  sexControl: FormControl;
  ageControl: FormControl;

  constructor(private fb: FormBuilder) {
    this.raceOptions.unshift({name: 'Random', id: ''} as RaceOption);
    this.optionsForm = new FormGroup({
      race: this.raceControl = new FormControl(this.raceOptions[0].id),
      sex: this.sexControl = new FormControl(this.sexOptions[0]),
      age: this.ageControl = new FormControl(this.ageOptions[2]),
    });
  }
  

  ngOnInit(): void { }

  buildNewNpcEmitter(): void {
    this.buildNewNpc.emit(this.optionsForm);
  }

}
