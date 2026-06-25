export interface LeftTurnTreatmentRecord {
  signalId: number;
  recommendation: string;
  implementationDate: string;
}

export type SocrataTrafficSignalLocation = {
  type: "Point";
  coordinates: [number, number];
};

export interface SocrataTrafficSignalRecord {
  signal_id: string;
  location_name: string;
  location: SocrataTrafficSignalLocation;
  signal_type: string;
  turn_on_date: string;
  id: string;
}

export type SocrataTrafficSignalResponse = SocrataTrafficSignalRecord[];

export interface MopedTrafficSignalRecord {
  geography: {
    location: SocrataTrafficSignalLocation;
    type: "MultiPoint";
    coordinates: SocrataTrafficSignalLocation["coordinates"][];
  };
  knack_id: string;
  location_name: string;
  signal_type: string;
  signal_id: string;
  created_by_user_id: number;
}

export interface MopedComponentPayload {
  component_id: number;
  location_description: string;
  phase_id: number;
  completion_date: string;
  created_by_user_id: number;
  feature_signals: {
    data: MopedTrafficSignalRecord[];
  };
  moped_proj_components_subcomponents: {
    data: {
      subcomponent_id: number;
      created_by_user_id: number;
    }[];
  };
  moped_proj_component_work_types: {
    data: {
      work_type_id: number;
      created_by_user_id: number;
    }[];
  };
}

export interface MopedProjectInsertResponse {
  insert_moped_project_one: {
    project_id: number;
  };
}
