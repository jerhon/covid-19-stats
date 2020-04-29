import { Component, OnInit, ViewChild, Output, ElementRef, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';

export interface StateSelected {
  stateAbbreviation: string;
}

export interface StateStyle {
  stateAbbreviation: string;
  fillColor: string;
}

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.scss']
})
export class UsMapComponent implements OnInit, OnChanges {

  constructor() { }

  @Input()
  public statesHighlighted: string[];

  @Input()
  public stateStyles: StateStyle[];

  @Output()
  public stateClicked: Subject<StateSelected> = new Subject<StateSelected>();

  @ViewChild("map")
  public svg: ElementRef<SVGElement>;

  public statesElements: { [state: string]: SVGElement } = {};

  ngOnInit() {}

  clearSelected() {
    let selected:string[] = [];
    let paths = this.svg.nativeElement.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.id != 'labels') {
        if (path.classList.contains('selected')) {
          path.classList.remove('selected');
          selected.push(path.id);
        }
      }
    }
    return selected;
  }

  setSelected(states: string[]) {
    for (let state of states) {
      this.statesElements[state.toUpperCase()]?.classList?.add('selected');
    }
  }

  ngAfterViewInit(): void {
    let paths = this.svg.nativeElement.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.id != 'labels') {
        this.statesElements[path.id] = path;

        path.addEventListener("click", (me: MouseEvent) => {
          this.stateClicked.next({ stateAbbreviation: path.id });
        });
      }
    }

    this.applyColors();
  }

  applyColors() {
    this.clearSelected();
    if (this.statesHighlighted && this.statesHighlighted.length) {
      this.setSelected(this.statesHighlighted);
    }
    if (this.svg) {
      let paths = this.svg.nativeElement.getElementsByTagName("path");
      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        let stateStyle = this.stateStyles.find((s) => s.stateAbbreviation == path.id);
        if (stateStyle) {
          path.style.fill = stateStyle.fillColor;
        }
      } 
    }
  }

  ngOnChanges() {
    this.applyColors();
  }
}
