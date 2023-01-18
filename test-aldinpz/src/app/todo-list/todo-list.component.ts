import { Component, OnInit, ViewChild } from '@angular/core'; //use for test
import { FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { ITodo, PostToDo } from 'src/models/models';
import { RestApiService } from 'src/services/rest-api.service';
//use for test
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  assignments: ITodo[] = [];
  tableIsEnabled: boolean = false;
  displayedColumns: string[] = [
    'id',
    'assignedTo',
    'description',
    'done',
    'operations',
    'CCNr'
  ];

  inputAssign = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    // this.isValidCC
  ]);
  inputDescription = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
  ]);
  inputDone: boolean = false;
  updateId: string = '';
  inputcc = new FormControl('', [Validators.required, this.isValidCC]);

  formIsInvalid: boolean = true;

  // todo : ITodo = {
  //   AssignedTo : <string>this.inputAssign.value,
  //   Description : <string>this.inputDescription.value,
  //   Done : this.inputDone,
  //   Id : ''
  // }

  @ViewChild(MatTable) table: MatTable<ITodo> | undefined;

  constructor(private restApi: RestApiService) {}

  ngOnInit(): void {
    this.restApi.getAll().subscribe((data) => {
      data.records.forEach((e) => {
        let item: ITodo = {
          AssignedTo: e.fields.AssignedTo,
          Description: e.fields.Description,
          Done: e.fields.Done,
          Id: e.id,
          CCNr: e.fields.CCNr,
        };
        this.assignments.push(item);
      });
      console.log(`list length': ${this.assignments.length}`);
      this.table?.renderRows();

      this.tableIsEnabled = this.assignments.length > 0;
    });

    this.inputAssign.valueChanges.subscribe(() => this.onFormIsValid());
    this.inputDescription.valueChanges.subscribe(() => this.onFormIsValid());
    this.inputcc.valueChanges.subscribe(() => this.onFormIsValid());
    this.inputAssign.valueChanges.subscribe(() => this.checkAssign()); //demo
  }

  updateTable() {
    this.assignments = [];

    this.restApi.getAll().subscribe((data) => {
      data.records.forEach((e) => {
        let item: ITodo = {
          AssignedTo: e.fields.AssignedTo,
          Description: e.fields.Description,
          Done: e.fields.Done,
          Id: e.id,
          CCNr: e.fields.CCNr,
        };

        this.assignments.push(item);

        this.resetInputs();
      });
      console.log(`list length': ${this.assignments.length}`);
      this.table?.renderRows();

      this.tableIsEnabled = this.assignments.length > 0;
    });
  }

  onFormIsValid() {
    this.formIsInvalid =
      this.inputAssign.invalid ||
      this.inputDescription.invalid ||
      this.inputcc.invalid;
  }

  isValidCC(control: FormControl) {
    let array = control.value as string;
    if (array != undefined && array != null) {
      let sum = 0;
      for (let i = 0; i < array.length; i++) {
        let tmp = parseInt(array[i]);
        if (tmp != undefined) {
          if ((array.length - i) % 2 == 0) {
            tmp = tmp * 2;

            if (tmp > 9) {
              tmp = tmp - 9;
            }
          }
          sum += tmp;
        }
      }
      if (sum % 10 == 0) {
        return { 'isValidCC': true };
      }
    }
    return null;
  }

  checkAssign() {
    //demo
    let text = this.inputAssign.value;

    if (text != null && text.length > 5) {
      this.inputAssign.setErrors({ test: true });
    }
  }
  getErrorForCC(): string{
    let result = '';

    if(this.inputcc.hasError('required'))
    {
      result += 'Empty CC - Please INPUT'
    }

if(this.inputcc.hasError('isValidCC')) {
  result += 'Invalid CC Number'
}
    return result;
  }

  getErrorForInputAssign(): string {
    let result = '';

    if (this.inputAssign.hasError('minlength')) {
      result += 'Länge minimum 2 Zeichen';
    }

    if (this.inputAssign.hasError('required')) {
      result += 'Eingabe benötigt';
    }

    if (this.inputAssign.hasError('test')) {
      //demo
      result += 'falsch!';
    }

    if (this.inputcc.hasError('null')) {
      result += 'CC Nr invalid!!';
    }

    return result;
  }

  getErrorForInputDescription(): string {
    let result = '';

    if (this.inputDescription.hasError('minlength')) {
      result += 'Länge minimum 2 Zeichen';
    }

    if (this.inputDescription.hasError('required')) {
      result += 'Eingabe benötigt';
    }
    return result;
  }

  addOrUpdateTodo() {
    if (this.formIsInvalid == false) {
      let post: PostToDo = {
        fields: {
          AssignedTo: <string>this.inputAssign.value,
          Description: <string>this.inputDescription.value,
          Done: this.inputDone,
          CCNr: <string>this.inputcc.value,
        },
      };
      if (this.updateId.length > 0) {
        this.restApi.patch(post, this.updateId).subscribe((data) => {
          this.updateTable();
        });
      } else {
        this.restApi.post(post).subscribe((data) => {
          if (data.id.length > 0) {
            this.updateTable();
          }
        });
      }
    }
  }

  deleteToDo(todo: ITodo) {
    this.restApi.delete(todo.Id).subscribe((data) => {
      this.updateTable();
    });
  }

  editToDo(todo: ITodo) {
    this.inputAssign.setValue(todo.AssignedTo);
    this.inputDescription.setValue(todo.Description);
    this.inputDone = todo.Done;
    this.updateId = todo.Id;
  }

  resetInputs() {
    this.inputAssign.reset();
    this.inputDescription.reset();
    this.inputDone = false;
    this.inputcc.reset();
    this.updateId = '';
  }
}
