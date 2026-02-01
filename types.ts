
export interface Recipe {
  titulo: string;
  tempo: string;
  porcoes: string;
  dificuldade: string;
  ingredientes: string[];
  instrucoes: string[];
}

export interface GenerationState {
  loading: boolean;
  recipe: Recipe | null;
  image: string | null;
  imageLoading: boolean;
  error: string | null;
}
