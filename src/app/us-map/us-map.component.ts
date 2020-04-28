import { Component, OnInit, ViewChild, Output, ElementRef, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { RefreshablePage } from '../app.component';

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

  selectedPath: SVGPathElement;

  @Input()
  public stateStyles: StateStyle[];

  @Output()
  public stateClicked: Subject<StateSelected> = new Subject<StateSelected>();

  @ViewChild("map")
  public svg: ElementRef<SVGElement>;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    let paths = this.svg.nativeElement.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.id != 'labels') {
        path.addEventListener("click", (me: MouseEvent) => {
          this.selectedPath?.classList?.remove('selected');
          if (this.selectedPath == path)  {
            this.selectedPath = null;
            this.stateClicked.next(null);
          } else {
            this.selectedPath = path;
            this.selectedPath.classList.add('selected');
            this.stateClicked.next({ stateAbbreviation: path.id });
          }
          return false;
        });
      }
    }

    this.applyColors();
  }

  applyColors() {
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
