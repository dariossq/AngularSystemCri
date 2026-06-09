export interface Usuario {
  id: number;
  usuarioNombre: string;
  usuarioDescripcion: string;
  usuarioLogo: string | null;
  usuarioPie: string | null;
  usuarioEtnia: string;
  usuarioDepartamento: number;
  usuarioMunicipio: number;
  usuarioEstado: number;
}
