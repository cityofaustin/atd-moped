export interface MopedComponent {
  project_id: number;
  project_component_id: number;
  phase_id: number | null;
  completion_date: string | null;
  feature_signals: {
    signal_id: number;
    location_name: string;
  }[];
}

export interface MopedComponentsResponse {
  moped_proj_components: MopedComponent[];
}

export interface SocrataSignalRecord {
  signal_id: string;
  location_name: string;
  location: { type: string; coordinates: [number, number] };
  signal_type: string;
  turn_on_date: string;
  id: string;
}

export type SocrataPHBResponse = SocrataSignalRecord[];

export interface MopedProjectInsertResponse {
  insert_moped_project_one: {
    project_id: number;
  };
}
