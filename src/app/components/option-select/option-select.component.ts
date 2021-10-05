import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Race } from 'src/app/models/race.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import race_list from 'src/assets/races.json';

@Component({
  selector: 'app-option-select',
  templateUrl: './option-select.component.html',
  styleUrls: ['./option-select.component.scss']
})
export class OptionSelectComponent implements OnInit {

  @Output() buildNewNpc: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  raceOptions: string[];
  sexOptions: string[] = ['Random', 'Male', 'Female'];
  ageOptions: string[] = ['Random (All)', 'Random (Juvenile)', 'Random (Mature)', 'Child', 'Adolescent', 'Adult', 'Middle-aged', 'Senior'];
  
  optionsForm: FormGroup;
  
  // Default options for form fields
  //raceControl = new FormControl(this.raceOptions[0]);
  raceControl: FormControl;
  sexControl: FormControl;
  ageControl: FormControl;

  constructor(private fb: FormBuilder) {
    this.raceOptions = race_list.map((race: Race) => race.name);
    this.raceOptions.unshift('Random');
    this.optionsForm = new FormGroup({
      race: this.raceControl = new FormControl(this.raceOptions[0]),
      sex: this.sexControl = new FormControl(this.sexOptions[0]),
      age: this.ageControl = new FormControl(this.ageOptions[2]),
    });
  }
  

  ngOnInit(): void { }

  generateNewNpc(): void {
    this.buildNewNpc.emit(this.optionsForm);
  }

}
