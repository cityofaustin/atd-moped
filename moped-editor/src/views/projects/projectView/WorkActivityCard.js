import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Divider } from "@mui/material";
export default function ActivityCard({ activity, onEdit }) {
  return (
    <Card sx={{ marginBottom: "1rem" }}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={onEdit}>
            <MoreVertIcon />
          </IconButton>
        }
        title={<Typography variant="h3">#104</Typography>}
        // subheader={"#104"}
      />
      <CardContent>
        <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
          <Grid item xs={3}>
            <Typography variant="h4">Status</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.moped_work_activity_status.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4">Status note</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.status_note}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
          <Grid item xs={6} md={3}>
            <Typography variant="h4">Contractor</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.contractor}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h4">Contract</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.contract_number}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h4">Work Assignment</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.work_assignment_id}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h4">Amount</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.amount}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
          <Grid item xs={6} md={3}>
            <Typography variant="h4">Workgroup</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.implementation_workgroup}
            </Typography>
          </Grid>
          <Grid item xs={6} md={4}>
            <Typography variant="h4">Task order(s)</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.task_orders?.map((tk) => (
                <div>
                  <span>{tk.task_order}</span>
                </div>
              ))}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
          <Grid item xs={3}>
            <Typography variant="h4">Description</Typography>
            <Typography variant="body2" color="text.secondary">
              {activity.description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <CardContent>
        <Grid container spacing={2} justifyContent="end">
          <Grid item>
            {/* <Typography variant="body2" component="span">Updated by </Typography> */}
            <Typography variant="body2" component="span">
              Updated by John Clary - 10m ago
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
