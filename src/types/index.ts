export type TemporisticsType = 'P' | 'N' | 'B' | 'V';

export interface ActionLog {
  sceneId: string;
  actionDesc: string;
  darlingReply?: string;
  scores: Partial<ResultData>;
}

export interface SceneProps {
  onNext: (scores: Partial<ResultData>, log?: Omit<ActionLog, 'sceneId'> | Omit<ActionLog, 'sceneId'>[]) => void;
  isActive: boolean;
}

export interface ResultData {
  P: number;
  N: number;
  B: number;
  V: number;
  selfIdentifiedType?: string;
  hasSeTalent?: boolean;
  hasFeVulnerable?: boolean;
}
