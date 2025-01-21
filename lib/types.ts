export interface Topic {
  id: number;
  name: string;
  pageUrl: string;
  order: number;
}

export interface Module {
  id: number;
  name: string;
  pageUrl: string;
  topics: Topic[];
  order: number;
}

export interface Course {
  id: number;
  title: string;
  pageUrl: string;
  modules: Module[];
}
