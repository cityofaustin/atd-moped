import { useMemo, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid } from "@mui/x-data-grid";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
// import WorkActivityToolbar from "./ProjectWorkActivityToolbar";
// import ProjectWorkActivitiesDialog from "./ProjectWorkActivityDialog";
import { getUserFullName } from "src/utils/userNames";

import { currencyFormatter } from "src/utils/numberFormatters";

// https://builder.knack.com/atd/test-25-feb-2022-dt-austin-transportation-data-tracker/pages/scene_514/views/view_3108/table

const HEADERS = {
  "X-Knack-Application-Id": "621958d0b5ab96001edcb4b1",
  "X-Knack-REST-API-KEY": "knack",
};
const SCENE = "scene_514";
const VIEW = "view_3108";
const FILTERS = {
  match: "and",
  rules: [
    {
      field: "field_3965",
      operator: "is",
      value: "62195e71f538d8072b168ac0",
    },
  ],
};

const URL = `https://api.knack.com/v1/pages/${SCENE}/views/${VIEW}/records?filters=${encodeURIComponent(
  JSON.stringify(FILTERS)
)}`;

export const useKnackData = (url, headers) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(url, { headers })
      .then((response) => response.json())
      .then(
        (json) => {
          setData(json);
        },
        (error) => {
          setError(error.toString());
        }
      );
  }, [url]);
  error && console.error(error);
  return { data, error, loading: !data && !error };
};

const KnackWorkOrderTable = ({ projectId, knackProjectId }) => {
  const { error, loading, data } = useKnackData(URL, HEADERS);
  if (loading || !data) return <CircularProgress />;

  console.log("HIIIII", data);
  return (
    <Box sx={{ width: "100%" }}>
      {/* <DataGrid
            autoHeight
            columns={columns}
            density="comfortable"
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            hideFooterPagination={true}
            localeText={{ noRowsLabel: "No work activites" }}
            rows={activities}
            slots={{
              toolbar: WorkActivityToolbar,
            }}
            slotProps={{
              toolbar: { onClick: onClickAddActivity },
            }}
          /> */}
    </Box>
  );
};

export default KnackWorkOrderTable;
