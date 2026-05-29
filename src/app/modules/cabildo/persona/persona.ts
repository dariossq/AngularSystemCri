import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { Persona, createEmptyPersona } from '../../../models/persona.model';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './persona.html',
  styleUrls: ['./persona.scss']
})
export class PersonaComponent {
  private personaService = inject(PersonaService);

  public today = new Date();
  public mensajeExito = '';
  public mensajeError = '';
  private timerMensaje: any;
  private timerError: any;
  
  public persona: Persona = createEmptyPersona();
  public anteriorNivelGerarquico = ''; 
  public registros = this.personaService.personas;
  public buscar = '';
  public errores: { [key: string]: string } = {};
  public mostrarErrores = false;
  public currentStep = 1;
  public totalSteps = 4;
  public stepTitles = [
    'Información Personal',
    'Identificación',
    'Ubicación y Educación',
    'Datos Demográficos y Contacto'
  ];

  public opciones = {
    nivelGerarquico: ['Hombre', 'Mujer', 'Padre y Madre', 'Hijo'],
    estado: ['Activo', 'Inactivo', 'Suspendido'],
    documento: ['Cédula', 'Pasaporte', 'Tarjeta de identidad'],
    genero: ['Masculino', 'Femenino'],
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

  public nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.validateStep(this.currentStep)) {
        this.currentStep += 1;
        this.mostrarErrores = false;
      }
    }
  }

  public previousStep() {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  public goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      if (step > this.currentStep) {
        if (!this.validateStep(this.currentStep)) {
          return;
        }
      }
      this.currentStep = step;
      this.mostrarErrores = false;
    }
  }

  // Validación por paso
  public validateStep(step: number): boolean {
    this.mostrarErrores = true;
    const pasoErrores: { [key: string]: string } = {};

    if (step === 1) {
      if (!this.persona.nivelGerarquico) pasoErrores['nivelGerarquico'] = 'Nivel jerárquico es requerido';
      if (!this.persona.primerNombre || !this.persona.primerNombre.trim()) pasoErrores['primerNombre'] = 'Primer nombre es requerido';
      if (!this.persona.primerApellido || !this.persona.primerApellido.trim()) pasoErrores['primerApellido'] = 'Primer apellido es requerido';
    }

    if (step === 2) {
      if (!this.persona.documento) pasoErrores['documento'] = 'Documento es requerido';
      if (!this.persona.identificacion || !this.persona.identificacion.trim()) pasoErrores['identificacion'] = 'Identificación es requerida';
      if (!this.persona.genero) pasoErrores['genero'] = 'Género es requerido';
    }

    if (step === 3) {
      if (!this.persona.vereda) pasoErrores['vereda'] = 'Vereda es requerida';
      if (!this.persona.escolaridad) pasoErrores['escolaridad'] = 'Escolaridad es requerida';
    }

    if (step === 4) {
      if (!this.persona.fechaNacimiento) pasoErrores['fechaNacimiento'] = 'Fecha de nacimiento es requerida';
      if (this.persona.nivelGerarquico === 'Hijo') {
        this.persona.estadoCivil = 'Soltero';
        this.persona.hijosACargo = '0';
      }
    }

    this.errores = pasoErrores;
    return Object.keys(pasoErrores).length === 0;
  }

  public cargarRegistro(registro: any) {
    this.persona = { ...registro };
    this.currentStep = 1;
    if (registro.nivelGerarquico === 'Hijo') {
      this.persona.estadoCivil = 'Soltero';
      this.persona.hijosACargo = '0';
    }
    this.anteriorNivelGerarquico = registro.nivelGerarquico || '';
    this.mostrarErrores = false;
  }

  public onNivelJerarquicoChange(nuevoNivel: string) {
    const generoPorNivel = nuevoNivel === 'Hombre' ? 'Masculino' : nuevoNivel === 'Mujer' ? 'Femenino' : '';

    if (this.anteriorNivelGerarquico && nuevoNivel !== this.anteriorNivelGerarquico) {
      this.persona = {
        nivelGerarquico: nuevoNivel,
        estado: 'Activo',
        codigoFlia: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        documento: '',
        identificacion: '',
        genero: generoPorNivel,
        vereda: '',
        escolaridad: '',
        profesion: '',
        fechaNacimiento: '',
        estadoCivil: nuevoNivel === 'Hijo' ? 'Soltero' : '',
        hijosACargo: '0',
        departamento: '',
        municipio: '',
        fechaExpedicion: '',
        celular: '',
        telefono: ''
      };
      this.errores = {};
      this.mostrarErrores = false;
    } else {
      this.persona.genero = generoPorNivel;
    }

    if (nuevoNivel === 'Hijo') {
      this.persona.hijosACargo = '0';
      this.persona.estadoCivil = 'Soltero';
    }

    this.anteriorNivelGerarquico = nuevoNivel;
  }

  public setGenero(valor: string) {
    if (!this.persona.nivelGerarquico) {
      return;
    }
    this.persona.genero = valor;
    // limpiar error al seleccionar género
    if (valor) {
      delete this.errores['genero'];
    }
  }

  // Valida todos los campos antes de guardar o actualizar
  public guardar() {
    this.mostrarErrores = true;
    if (this.validarCompleto()) {
      this.personaService.addPersona({ ...this.persona });
      this.mostrarMensajeExito('Persona registrada correctamente.');
      this.limpiar();
      this.mostrarErrores = false;
    } else {
      this.mostrarMensajeError('Faltan diligenciar campos obligatorios');
    }
  }

  // Valida todos los campos antes de actualizar un registro existente
  public actualizar() {
    this.mostrarErrores = true;
    if (this.validarCompleto()) {
      const updated = this.personaService.updatePersona({ ...this.persona });
      if (updated) {
        this.mostrarMensajeExito('Persona actualizada correctamente.');
        this.limpiar();
        this.mostrarErrores = false;
      } else {
        this.errores['identificacion'] = 'Registro no encontrado para actualizar.';
      }
    } else {
      this.mostrarMensajeError('Faltan diligenciar campos obligatorios');
    }
  }

  // Cancela la edición o creación y limpia el formulario
  public cancelar() {
    this.limpiar();
    this.mostrarErrores = false;
  }

  // Elimina un registro existente después de confirmar la acción
  public eliminar() {
    if (!this.persona.identificacion?.trim()) {
      this.errores['identificacion'] = 'Seleccione un registro para eliminar';
      return;
    }

    if (confirm('¿Está seguro de que desea eliminar este registro?')) {
      const removed = this.personaService.deletePersona(this.persona.identificacion);
      if (removed) {
        this.mostrarMensajeExito('Persona eliminada correctamente.');
        this.limpiar();
      } else {
        this.errores['identificacion'] = 'Registro no encontrado.';
      }
    }
  }

  // Busca un registro por identificación y carga sus datos en el formulario
  public buscarRegistro() {
    if (!this.buscar?.trim()) {
      this.errores['buscar'] = 'Ingrese una identificación para buscar';
      return;
    }

    const registro = this.personaService.searchByIdentificacion(this.buscar);
    if (registro) {
      this.cargarRegistro(registro);
      this.errores['buscar'] = '';
      this.mostrarMensajeExito('Registro encontrado.');
    } else {
      this.errores['buscar'] = 'Registro no encontrado con esa identificación';
      this.limpiar();
    }
  }

  // Limpia el mensaje de éxito después de mostrarlo durante un tiempo determinado
  public cerrarMensaje() {
    this.mensajeExito = '';
    if (this.timerMensaje) {
      clearTimeout(this.timerMensaje);
    }
  }

  // Limpia el mensaje de error después de mostrarlo durante un tiempo determinado
  public cerrarMensajeError() {
    this.mensajeError = '';
    if (this.timerError) {
      clearTimeout(this.timerError);
    }
  }

  // Muestra un mensaje de éxito y lo oculta automáticamente después de 4 segundos
  private mostrarMensajeExito(mensaje: string) {
    this.mensajeExito = mensaje;
    if (this.timerMensaje) {
      clearTimeout(this.timerMensaje);
    }
    this.timerMensaje = setTimeout(() => this.mensajeExito = '', 4000);
  }

  // Muestra un mensaje de error y lo oculta automáticamente después de 3 segundos
  private mostrarMensajeError(mensaje: string) {
    this.mensajeError = mensaje;
    if (this.timerError) {
      clearTimeout(this.timerError);
    }
    this.timerError = setTimeout(() => this.mensajeError = '', 3000);
  }

  // Valida un solo campo cuando pierde el foco
  public validarCampo(campo: string) {
    const valor = (this.persona as any)[campo];
    // campos que sólo requieren existencia
    const requiredOnly = ['documento', 'genero', 'vereda', 'escolaridad', 'fechaNacimiento'];
    // validación específica para campos que sólo requieren existencia
    if (requiredOnly.includes(campo)) {
      if (!valor) {
        this.errores[campo] = this.mensajePorCampo(campo);
      } else {
        delete this.errores[campo];
      }
      return;
    }

    // validación general de campos obligatorios
    if (!valor || (typeof valor === 'string' && !valor.trim())) {
      this.errores[campo] = this.mensajePorCampo(campo);
      return;
    }

    // validaciones específicas
    if (campo === 'identificacion') {
      // validación de solo números y longitud mínima
      if (!/^\d+$/.test(valor)) {
        this.errores[campo] = 'Identificación debe contener solo números';
        return;
      }
      if (valor.length < 5) {
        this.errores[campo] = 'Identificación debe tener al menos 5 dígitos';
        return;
      }
    }

    // validación de celular y teléfono: solo números y longitud mínima para celular
    if (campo === 'celular') {
      if (valor && !/^\d+$/.test(valor)) {
        this.errores[campo] = 'Celular debe contener solo números';
        return;
      }
      if (valor && valor.length < 7) {
        this.errores[campo] = 'Celular debe tener al menos 7 dígitos';
        return;
      }
    }

    // validación de teléfono: solo números, sin longitud mínima específica
    if (campo === 'telefono') {
      if (valor && !/^\d+$/.test(valor)) {
        this.errores[campo] = 'Teléfono debe contener solo números';
        return;
      }
    }

    // si pasa todas las validaciones, eliminar el error
    delete this.errores[campo];
  }

  // Limpia el error de un campo cuando el usuario escribe/selecciona un valor válido
  public limpiarError(campo: string, valor: any) {
    if (campo === 'identificacion' || campo === 'celular' || campo === 'telefono') {
      // reutilizar la validación para aplicar reglas específicas
      (this.persona as any)[campo] = valor;
      this.validarCampo(campo);
      return;
    }

    if (valor || (typeof valor === 'number' && !isNaN(valor))) {
      delete this.errores[campo];
    }
  }

  // Devuelve el mensaje de error específico para cada campo
  private mensajePorCampo(campo: string) {
    switch (campo) {
      case 'primerNombre': return 'Primer nombre es requerido';
      case 'primerApellido': return 'Primer apellido es requerido';
      case 'identificacion': return 'Identificación es requerida';
      case 'documento': return 'Documento es requerido';
      case 'genero': return 'Género es requerido';
      case 'vereda': return 'Vereda es requerida';
      case 'escolaridad': return 'Escolaridad es requerida';
      case 'fechaNacimiento': return 'Fecha de nacimiento es requerida';
      default: return 'Campo requerido';
    }
  }

  // Valida todos los campos del formulario antes de guardar o actualizar un registro
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

  // Limpia el formulario y resetea el estado a su configuración inicial
  private limpiar() {
    this.persona = createEmptyPersona();
    this.buscar = '';
    this.errores = {};
    this.anteriorNivelGerarquico = '';
    this.currentStep = 1;
  }
}
