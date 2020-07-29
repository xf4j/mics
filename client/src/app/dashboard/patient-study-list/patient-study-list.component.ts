import { Component, OnInit, Injectable, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
import {FlatTreeControl} from '@angular/cdk/tree';
import { StudyNode, StudyFlatNode } from '../../studies/study.service';
import {SelectionModel} from '@angular/cdk/collections';
import { SeriesService } from '../series.service';
import { AlertService } from '../../alert/alert.service';

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<StudyNode[]>([]);
  get data(): StudyNode[] { return this.dataChange.value; }
  
  public initialize(treeData: any) {
    // Build the tree nodes from Json object. The result is a list of TodoItemNode with nested
    //     file node as children.
    const data = this.buildFileTree(treeData, 0);
    // Notify the change.
    this.dataChange.next(data);
  }
  buildFileTree(obj: {[key: string]: any}, level: number): StudyNode[] {
    return Object.keys(obj).reduce<StudyNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new StudyNode();
      node.name = key;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.name = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
  /** Add an item to to-do list */
}



@Component({
  selector: 'app-patient-study-list',
  templateUrl: './patient-study-list.component.html',
  styleUrls: ['./patient-study-list.component.css'],
  providers:[ChecklistDatabase]
})


export class PatientStudyListComponent implements OnInit {

  ngOnInit(): void {
    // console.log("Hi in init");
    
  }

  ngOnChanges(){
    // console.log("Checking the treedata");
    // console.log(this.treeData1);
    this._database.initialize(this.treeData1);
    this._database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  @Input('treeData1') treeData1: any
    
  flatNodeMap = new Map<StudyFlatNode, StudyNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<StudyNode, StudyFlatNode>();
  treeControl: FlatTreeControl<StudyFlatNode>;
  treeFlattener: MatTreeFlattener<StudyNode, StudyFlatNode>;
  dataSource: MatTreeFlatDataSource<StudyNode, StudyFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<StudyFlatNode>(true /* multiple */);
  
  constructor(private _database: ChecklistDatabase,
    private seriesService: SeriesService,
    private alertService: AlertService, ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<StudyFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    
  }
  getLevel = (node: StudyFlatNode) => node.level;
  isExpandable = (node: StudyFlatNode) => node.expandable;
  getChildren = (node: StudyNode): StudyNode[] => node.children;
  hasChild = (_: number, _nodeData: StudyFlatNode) => _nodeData.expandable;
  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: StudyNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
        ? existingNode
        : new StudyFlatNode();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: StudyFlatNode, event: any): void {
    this.checklistSelection.toggle(node);
    let par=this.getParentNode(node);
    if (event){
    // if tabsToOpen already has the parent entry append into the list
    if(this.seriesService.tabsToOpen.hasOwnProperty(par.name)){
      this.seriesService.tabsToOpen[par.name].push(node.name);
      
    }
    else{
      this.seriesService.tabsToOpen[par.name]=[node.name]
    }
  }
    //uncheck event should be remove from tabstoopen
    else{
      // let listNodes=this.seriesService.tabsToOpen[par.name]
      if (this.seriesService.tabsToOpen[par.name].length==1){
        delete this.seriesService.tabsToOpen[par.name]
      }
      else{
        this.seriesService.tabsToOpen[par.name]=this.seriesService.tabsToOpen[par.name].filter(obj=> obj!==node.name);
      }
      
    }
    //only one study is allowed at a time
    let n=Object.keys(this.seriesService.tabsToOpen).length;
    if ( n>1){
      this.alertService.error('Select one study at a time');
    }
    this.seriesService.setNumberofStudiesSelected(n);
    
  }


  getParentNode(node: StudyFlatNode): StudyFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }


}


