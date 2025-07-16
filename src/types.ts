export interface UserInfo {
  name: string;
  age: string;
  gender?: string;
}

export interface Recording {
  id: string;
  userId: string;
  type: 'speech' | 'hum';
  triplet: string;
  blob: Blob;
  filename: string;
}

export type ExperimentPhase = 
  | 'speech-training'
  | 'speech-experiment'
  | 'hum-training'
  | 'hum-experiment'
  | 'complete';

export interface ExperimentState {
  phase: ExperimentPhase;
  currentIndex: number;
  recordings: Recording[];
  triplets: string[];
}
