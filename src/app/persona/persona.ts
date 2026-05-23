import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './persona.html',
  styleUrls: ['./persona.scss']
})
export class PersonaComponent {
  public today = new Date();
  public mensajeExito = '';
  private timerMensaje: any;
  
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

  // listTarjetas: any[] = [
  //   { titular: 'Juan Perez', numeroTarjeta: '252525262', fechaExpiracion: '11/23', cvv: '123' },
  //   { titular: 'Miguel Gonzalez', numeroTarjeta: '252525262', fechaExpiracion: '11/24', cvv: '312' }
  // ];

  public registros: any[] = [];
  public buscar = '';
  public errores: { [key: string]: string } = {};
  public mostrarErrores = false;

  public opciones = {
    nivelGerarquico: ['Gerencial', 'Coordinador', 'Operativo', 'Otro'],
    estado: ['Activo', 'Inactivo', 'Suspendido'],
    documento: ['Cédula', 'Pasaporte', 'Tarjeta de identidad'],
    genero: ['Masculino', 'Femenino', 'Otro'],
    escolaridad: ['Primaria', 'Secundaria', 'Técnico', 'Profesional', 'Postgrado'],
    estadoCivil: ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión libre'],
    hijosACargo: ['0', '1', '2', '3', '4', '5', 'Más de 5']
  };

  public trackByOpcion(_index: number, opcion: string): string {
    return opcion;
  }

  public trackByRegistro(_index: number, registro: any): string {
    return registro.identificacion;
  }

  public cargarRegistro(registro: any) {
    this.persona = { ...registro };
    this.mostrarErrores = false;
  }

  public guardar() {
    this.mostrarErrores = true;
    if (this.validarCompleto()) {
      this.registros.unshift({ ...this.persona });
      this.mostrarMensajeExito('Persona registrada correctamente.');
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
        this.mostrarMensajeExito('Persona actualizada correctamente.');
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
        this.mostrarMensajeExito('Persona eliminada correctamente.');
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
      this.cargarRegistro(registro);
      this.errores['buscar'] = '';
      this.mostrarMensajeExito('Registro encontrado.');
    } else {
      this.errores['buscar'] = 'Registro no encontrado con esa identificación';
      this.limpiar();
    }
  }

  public cerrarMensaje() {
    this.mensajeExito = '';
    if (this.timerMensaje) {
      clearTimeout(this.timerMensaje);
    }
  }

  private mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    if (this.timerMensaje) {
      clearTimeout(this.timerMensaje);
    }
    this.timerMensaje = setTimeout(() => this.mensajeExito = '', 4000);
  }

  private validarCompleto(): boolean {
    this.errores = {};

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

    if (this.persona.identificacion && !/^\d+$/.test(this.persona.identificacion)) {
      this.errores['identificacion'] = 'Identificación debe contener solo números';
    }

    if (this.persona.identificacion && this.persona.identificacion.length < 5) {
      this.errores['identificacion'] = 'Identificación debe tener al menos 5 dígitos';
    }

    if (this.persona.celular && !/^\d+$/.test(this.persona.celular)) {
      this.errores['celular'] = 'Celular debe contener solo números';
    }
    if (this.persona.celular && this.persona.celular.length < 7) {
      this.errores['celular'] = 'Celular debe tener al menos 7 dígitos';
    }
    if (this.persona.telefono && !/^\d+$/.test(this.persona.telefono)) {
      this.errores['telefono'] = 'Teléfono debe contener solo números';
    }

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
