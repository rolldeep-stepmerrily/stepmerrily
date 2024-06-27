interface IImage {
  '#text': string;
  size: string;
}

export interface IMusic {
  name: string;
  artist: string;
  url: string;
  stramable: string;
  listeners: string;
  image: IImage[];
  mbid: string;
}
