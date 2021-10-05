import { Component, OnInit, Input } from '@angular/core';
import { Trait } from 'src/app/models/trait.model';
import { NonPlayerCharacter } from 'src/app/models/npc.model';


@Component({
  selector: 'app-npc-display',
  templateUrl: './npc-display.component.html',
  styleUrls: ['./npc-display.component.scss']
})
export class NpcDisplayComponent implements OnInit {

  @Input() displayedNpc: NonPlayerCharacter;
  

  readableHeight(num: number): string {
    return (`${Math.floor(num/12)}' ${num%12}"`);
  }

  readableWeight(num: number): string {
    return (`${num} lbs.`);
  }


  constructor() {
    this.displayedNpc = {} as NonPlayerCharacter;
  }

  ngOnInit(): void { }

}
