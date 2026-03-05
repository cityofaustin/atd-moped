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

export type MopedComponentsResponse = {
  moped_proj_components: MopedComponent[];
};
