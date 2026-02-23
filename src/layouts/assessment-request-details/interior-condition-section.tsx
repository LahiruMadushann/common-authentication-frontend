
import { Grid, Stack, TextField, Typography } from "@mui/material";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { md: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

function InteriorConditionSection(props : any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          内装の状態
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
            id="conditionInterior"
            name="conditionInterior"
            label="全体の状況"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.interior}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="dirt"
            name="dirt"
            label="汚れ / シミ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.dirt}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="air_conditioning"
            name="air_conditioning"
            label="エアコン"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.air_conditioning}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="tear"
            name="tear"
            label="シート破れ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.tear}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="smoke"
            label="禁煙 / 喫煙"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.smoke}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default InteriorConditionSection;
