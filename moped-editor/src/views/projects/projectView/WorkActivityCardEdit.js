import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CheckCircle } from "@mui/icons-material";
import {
  Button,
  TextField,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function ActivityCardEdit({ activity, onEdit, onCancel }) {
  return (
    <Card sx={{ marginBottom: "1rem" }}>
      <CardHeader
        action={
          <>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CheckCircle />}
              type="submit"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </>
          //   <IconButton aria-label="settings" onClick={() => setEditId(null)}>
          //     <MoreVertIcon />
          //   </IconButton>
        }
        title={activity ? <Typography variant="h3">#104</Typography> : null}
        // subheader={"#104"}
      />
      <CardContent>
        <FormControl>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              <InputLabel id="activity-status-label">Status</InputLabel>
              <Select
                size="small"
                fullWidth
                value={activity?.moped_work_activity_status.name || ""}
                variant="outlined"
                id="activity-status"
                labelId="activity-status-label"
                label="Status"
              >
                <MenuItem value="Planned">Planned</MenuItem>
                <MenuItem value="Under Construction">
                  Under Construction
                </MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
                <MenuItem value="Canceled">Canceled</MenuItem>
                <MenuItem value="On hold">On hold</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Status note"
                value={activity?.status_note || ""}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              {/* <FormLabel id="roles-label">Contractor</FormLabel> */}
              <TextField
                size="small"
                fullWidth
                label="Contractor"
                value={activity?.contractor || ""}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Contract"
                value={activity?.contract_number || ""}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Work Assignment"
                value={activity?.work_assignment_id || ""}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                size="small"
                fullWidth
                label="Amount"
                value={activity?.amount || ""}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={6} md={3}>
              <InputLabel id="activity-status-label">Status</InputLabel>
              <TextField
                fullWidth
                size="small"
                label="Implementation Workgroup"
                value={activity?.implementation_workgroup || ""}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Task order(s)"
                value={
                  activity?.task_orders
                    ?.map((tk) => tk.task_order)
                    .join(", ") || ""
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={activity?.description || ""}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </FormControl>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid container spacing={2} justifyContent="end">
          <Grid item>
            {/* <Typography variant="body2" component="span" color="text.secondary">
              Updated by John Clary - 10m ago
            </Typography> */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              type="submit"
              onClick={onCancel}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
