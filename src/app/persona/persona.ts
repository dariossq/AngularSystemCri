import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './persona.html',
  styleUrls: ['./persona.scss']
})
export class PersonaComponent {
  public today = new Date();
  public persona = {
    nivelGerarquico: '',
    estado: 'Activo',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    documento: '',
    identificacion: '',
    genero: '',
    vereda: '',
    escolaridad: '',
    profesion: '',
    fechaNacimiento: '',
    estadoCivil: '',
    hijosACargo: '0',
    departamento: '',
    municipio: '',
    fechaExpedicion: '',
    celular: '',
    telefono: ''
  };

  public registros: any[] = [];
  public buscar: string = '';
  public errores: { [key: string]: string } = {};
  public mensajeExito: string = '';
  public mostrarErrores: boolean = false;

  public opciones = {
    nivelGerarquico: ['Gerencial', 'Coordinador', 'Operativo', 'Otro'],
    estado: ['Activo', 'Inactivo', 'Suspendido'],
    documento: ['Cédula', 'Pasaporte', 'Tarjeta de identidad'],
    genero: ['Masculino', 'Femenino', 'Otro'],
    escolaridad: ['Primaria', 'Secundaria', 'Técnico', 'Profesional', 'Postgrado'],
    estadoCivil: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión libre'],
    hijosACargo: ['0', '1', '2', '3', '4', '5', 'Más de 5']
  };

  public guardar() {
    this.mostrarErrores = true;
    if (this.validarCompleto()) {
      this.registros.unshift({ ...this.persona });
      this.mensajeExito = 'Persona registrada correctamente.';
      setTimeout(() => this.mensajeExito = '', 3000);
      this.limpiar();
      this.mostrarErrores = false;
    }
  }

  public actualizar() {
    this.mostrarErrores = true;
    if (this.validarCompleto()) {
      const index = this.registros.findIndex(r => r.identificacion === this.persona.identificacion);
      if (index > -1) {
        this.registros[index] = { ...this.persona };
        this.mensajeExito = 'Persona actualizada correctamente.';
        setTimeout(() => this.mensajeExito = '', 3000);
        this.limpiar();
        this.mostrarErrores = false;
      } else {
        this.errores['identificacion'] = 'Registro no encontrado para actualizar.';
      }
    }
  }

  public cancelar() {
    this.limpiar();
    this.mostrarErrores = false;
  }

  public eliminar() {
    if (!this.persona.identificacion?.trim()) {
      this.errores['identificacion'] = 'Seleccione un registro para eliminar';
      return;
    }
    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      const index = this.registros.findIndex(r => r.identificacion === this.persona.identificacion);
      if (index > -1) {
        this.registros.splice(index, 1);
        this.mensajeExito = 'Persona eliminada correctamente.';
        setTimeout(() => this.mensajeExito = '', 3000);
        this.limpiar();
      } else {
        this.errores['identificacion'] = 'Registro no encontrado.';
      }
    }
  }

  public buscarRegistro() {
    if (!this.buscar?.trim()) {
      this.errores['buscar'] = 'Ingrese una identificación para buscar';
      return;
    }
    const registro = this.registros.find(r => r.identificacion === this.buscar);
    if (registro) {
      this.persona = { ...registro };
      this.errores['buscar'] = '';
      this.mensajeExito = 'Registro encontrado.';
      setTimeout(() => this.mensajeExito = '', 2000);
    } else {
      this.errores['buscar'] = 'Registro no encontrado con esa identificación';
      this.limpiar();
    }
  }

  private validarCompleto(): boolean {
    this.errores = {};
    
    // Validar campos obligatorios
    if (!this.persona.primerNombre?.trim()) {
      this.errores['primerNombre'] = 'Primer nombre es requerido';
    }
    if (!this.persona.primerApellido?.trim()) {
      this.errores['primerApellido'] = 'Primer apellido es requerido';
    }
    if (!this.persona.identificacion?.trim()) {
      this.errores['identificacion'] = 'Identificación es requerida';
    }
    if (!this.persona.documento) {
      this.errores['documento'] = 'Documento es requerido';
    }
    if (!this.persona.genero) {
      this.errores['genero'] = 'Género es requerido';
    }
    if (!this.persona.vereda) {
      this.errores['vereda'] = 'Vereda es requerida';
    }
    if (!this.persona.escolaridad) {
      this.errores['escolaridad'] = 'Escolaridad es requerida';
    }
    if (!this.persona.fechaNacimiento) {
      this.errores['fechaNacimiento'] = 'Fecha de nacimiento es requerida';
    }
    
    // Validar formato de identificación (solo números)
    if (this.persona.identificacion && !/^\d+$/.test(this.persona.identificacion)) {
      this.errores['identificacion'] = 'Identificación debe contener solo números';
    }
    
    // Validar longitud de identificación
    if (this.persona.identificacion && this.persona.identificacion.length < 5) {
      this.errores['identificacion'] = 'Identificación debe tener al menos 5 dígitos';
    }
    
    // Validar teléfono/celular (si se proporciona)
    if (this.persona.celular && !/^\d+$/.test(this.persona.celular)) {
      this.errores['celular'] = 'Celular debe contener solo números';
    }
    if (this.persona.celular && this.persona.celular.length < 7) {
      this.errores['celular'] = 'Celular debe tener al menos 7 dígitos';
    }
    if (this.persona.telefono && !/^\d+$/.test(this.persona.telefono)) {
      this.errores['telefono'] = 'Teléfono debe contener solo números';
    }
    
    // Validar que no haya errores
    return Object.keys(this.errores).length === 0;
  }

  private limpiar() {
    this.persona = {
      nivelGerarquico: '',
      estado: 'Activo',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      documento: '',
      identificacion: '',
      genero: '',
      vereda: '',
      escolaridad: '',
      profesion: '',
      fechaNacimiento: '',
      estadoCivil: '',
      hijosACargo: '0',
      departamento: '',
      municipio: '',
      fechaExpedicion: '',
      celular: '',
      telefono: ''
    };
    this.buscar = '';
    this.errores = {};
  }
}
