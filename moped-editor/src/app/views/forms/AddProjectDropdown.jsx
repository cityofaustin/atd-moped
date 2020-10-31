import React from "react";
import { gql, useQuery } from "@apollo/client"; 

export const PhasesDropdown = ({ label, ...others }) => {
  const PHASES_QUERY = gql`
  query Phases {
  moped_phases(order_by: {phase_name: asc}) {
    phase_name
  }
}
`;
const { loading: phaseLoading, error: phaseError, data: phases} = useQuery(PHASES_QUERY);

if (phaseLoading) return 'Loading...';
if (phaseError) return `Error! ${phaseError.message}`;

  return (
  <div>
    <label>{label}</label>
    <select {...others}>
    {phases.moped_phases.map(phase => (
              <option 
                key={phase.phase_name} 
                value={phase.phase_name}>
                {phase.phase_name}
              </option>
            ))}
    </select>
  </div>
);
};


