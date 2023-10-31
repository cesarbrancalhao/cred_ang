import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserContact } from '../share/usercontact.model';
import { UsercontactService } from '../share/usercontact.service';


@Component({
  selector: 'app-edit-usercontact',
  templateUrl: './edit-usercontact.component.html',
  styleUrls: ['./edit-usercontact.component.css']
})
export class EditUsercontactComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UsercontactService,
    private http: HttpClient
    ) { }
  addForm!: FormGroup;
  usercontact!: UserContact;

  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  ngOnInit() {
    const userId = localStorage.getItem('editUserId');
    if (!userId) {
      alert('Invalid action.');
      this.router.navigate(['']);
      return;
    }
    this.addForm = this.formBuilder.group({
      id: [userId],
      tipo: ['', Validators.required],
      documento: ['', Validators.required],
      nome: ['', Validators.required],
      nomeF: ['', Validators.required],
      cep: ['', [Validators.required, this.cepValidator]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]]
    });

    const data = this.userService.getUserById(+userId);
    this.addForm.setValue(data);

    this.addForm.get('tipo')?.valueChanges.subscribe(() => {
      this.updateDocumentoValidator();
    });

    this.addForm.get('cep')?.valueChanges.subscribe((cep) => {
      this.getAddressDetails(cep);
    });

    this.updateDocumentoValidator();
  }

  cepValidator(control: AbstractControl): { [key: string]: any } | null {
    const cepValue = control.value;
    if (cepValue && !/^\d{8}$/.test(cepValue)) {
      return { invalidCep: true };
    }
    return null;
  }

  isInvalid(name: string) {
    const control = this.addForm.get(name);
    return control?.invalid && control.dirty;
  }

  isEmailInvalid(name: string) {
    const control = this.addForm.get(name);
    return control?.invalid && control.dirty;
  }

  documentoValidator(tipo: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (tipo === 'f') {
        const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!regex.test(value)) {
          return { documentoInvalid: true };
        }
      } else if (tipo === 'j') {
        const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!regex.test(value)) {
          return { documentoInvalid: true };
        }
      }
      return null;
    };
  }

  updateDocumentoValidator() {
    const tipoControl = this.addForm.get('tipo');
    const tipo = tipoControl ? tipoControl.value : '';
    
    const documentoControl = this.addForm.get('documento');
    if (documentoControl) {
      documentoControl.setValidators([Validators.required, this.documentoValidator(tipo)]);
      documentoControl.updateValueAndValidity();
    }
  }

  getAddressDetails(cep: string) {
    if (cep) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (!data.erro) {
          this.addForm.patchValue({
            endereco: data.logradouro,
            bairro: data.bairro,
            cidade: `${data.localidade}/${data.uf}`
          });
        } else {
          // handler, validação já feita
        }
      });
    }
  }

  onSubmit() {
    const tipoControl = this.addForm.get('tipo');
    const tipo = tipoControl ? tipoControl.value : '';

    if (tipo === 'f') {
      const nomeFControl = this.addForm.get('nomeF');
      if (nomeFControl) {
        nomeFControl.setValue('-');
      }
    }

    this.updateDocumentoValidator();
  
    if (this.addForm.valid) {
      this.userService.update(this.addForm.value);
      this.router.navigate(['']);
    } else {
      alert('Preencha todos os campos');
    }
  }

  onCancel() {
    this.router.navigate(['']);
  }
}