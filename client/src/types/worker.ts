export interface IWorker {
  id: number;
  tabNom: string;
  name: string;
  position: string;
  shift: string;
  lastMed?: Date | null;
  isException: boolean;
  harm?: IHarm;
  comment?: string;
}

export interface IHarm {
  id: number;
  position: string;
  harm: string;
  harmNum: string;
}
