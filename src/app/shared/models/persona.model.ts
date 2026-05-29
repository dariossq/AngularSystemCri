export interface Persona {
  nivelGerarquico: string;
  estado: string;
  codigoFlia: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  documento: string;
  identificacion: string;
  genero: string;
  vereda: string;
  escolaridad: string;
  profesion: string;
  fechaNacimiento: string;
  estadoCivil: string;
  hijosACargo: string;
  departamento: string;
  municipio: string;
  fechaExpedicion: string;
  celular: string;
  telefono: string;
}

export function createEmptyPersona(): Persona {
  return {
    nivelGerarquico: '',
    estado: 'Activo',
    codigoFlia: '',
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
}
