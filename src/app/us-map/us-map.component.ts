import { Component, OnInit, ViewChild, Output, ElementRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { PathLocationStrategy } from '@angular/common';

export interface StateStyle {
  state: string;
  fill: string;
}

@Component({
  selector: 'app-us-map',
  templateUrl: './us-map.component.html',
  styleUrls: ['./us-map.component.scss']
})
export class UsMapComponent implements OnInit {

  constructor() { }

  selectedPath: SVGPathElement;

  @Input() 
  public stateStyles: StateStyle[];

  @Output()
  public stateClicked: Subject<string> = new Subject<string>();

  @ViewChild("map")
  public svg: ElementRef<SVGElement>;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    /* if (this.stateStyles) {
      let style = this.stateStyles.find((st) => st.fill == path.id);
      if (style) {
        path.style.fill = style.fill;
      }
    }*/

    let paths = this.svg.nativeElement.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.id != 'labels') {
        path.addEventListener("click", (me: MouseEvent) => {
          
          this.selectedPath?.classList?.remove('selected');
          if (this.selectedPath == path)  {
            this.stateClicked.next(null);
          } else {
            this.selectedPath = path;
            this.selectedPath.classList.add('selected');
            this.stateClicked.next(path.id);
          }
          return false;
        });
      }
    }
  }

  getStatePath(state: string) {
    let paths = this.svg.nativeElement.getElementsByTagName("path");
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.id == state) {
        return path;
      }
    } 
    return null;
  }

  setStateFill(state: string, fill: string) {
    this.getStatePath(state).style.fill = fill;
  }
}
