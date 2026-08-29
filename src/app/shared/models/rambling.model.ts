export interface Rambling {
  id: string;
  title: string;
  text: string;
  image?: string;
  imageCredit?: string;
}

export interface RamblingImageManifestEntry {
  credit?: string;
  ext?: string;
}

export type RamblingImageManifest = Record<string, RamblingImageManifestEntry>;