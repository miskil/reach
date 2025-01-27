export interface Topic {
  id: number;
  name: string | null;
  pageUrl: string | null;
  order: number;
}

export interface Module {
  id: number;
  name: string | null;
  pageUrl: string | null;
  topics: Topic[];
  order: number;
}

export interface Course {
  id: number;
  title: string;
  pageUrl: string | null;
  modules: Module[];
}
