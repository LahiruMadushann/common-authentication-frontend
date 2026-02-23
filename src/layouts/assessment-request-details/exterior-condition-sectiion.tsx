import { Grid, Stack, TextField, Typography } from "@mui/material";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { md: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

function ExteriorConditionSection(props: any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          外装の状態
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
            id="overallSituation"
            name="overallSituation"
            label="全体の状況"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.exterior}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="damage"
            name="damage"
            label="傷"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.scratch}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="peel"
            name="peel"
            label="塗装剥げ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.peel}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="dent"
            name="dent"
            label="へこみ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.dent}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="rust"
            name="rust"
            label="サビ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.rust}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default ExteriorConditionSection;
