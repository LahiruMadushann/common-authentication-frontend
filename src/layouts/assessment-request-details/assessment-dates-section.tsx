import { Grid, Stack, TextField, Typography } from "@mui/material";
import moment from "moment";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { md: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

function AssessmentDatesSection(props : any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          査定希望日
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        direction="row"
        textAlign="center"
        className="panel-card"
      >
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="dateOfFirstAssessment"
            name="dateOfFirstAssessment"
            label="第一査定希望日"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.aDates[0] && moment(props.data?.aDates[0]).format('YYYY-MM-DD')}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="dateOfSecondAssessment"
            name="dateOfSecondAssessment"
            label="第二査定希望日"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.aDates[1] && moment(props.data?.aDates[1]).format('YYYY-MM-DD')}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="dateOfThirdAssessment"
            name="dateOfThirdAssessment"
            label="第三査定希望日"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.aDates[2] && moment(props.data?.aDates[2]).format('YYYY-MM-DD')}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default AssessmentDatesSection;
