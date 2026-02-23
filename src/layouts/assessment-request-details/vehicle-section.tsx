import { Grid, Stack, TextField, Typography } from "@mui/material";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { lg: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

const formatCarTraveledDistance = (value: string) => {
  if (value === "～900000000km") {
    return "210,000Km以上";
  }
  return value;
};

function VehicleSection(props : any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          車両
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
            id="car_maker"
            name="car_maker"
            label="メーカー"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.car_maker}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="inspect_remain"
            name="inspect_remain"
            label="車検日"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.inspect_remain}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="shift"
            name="shift"
            label="シフト"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.shift}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="car_type"
            name="car_type"
            label="車種"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.car_type}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="runnable"
            label="自走可否"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.runnable}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="fuel"
            name="fuel"
            label="燃料"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.fuel}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="car_model_year"
            name="car_model_year"
            label="年式"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.car_model_year}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="accident"
            name="accident"
            label="事故歴・修復歴"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.accident}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="wheel_drive"
            name="wheel_drive"
            label="駆動"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.wheel_drive}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="grade"
            name="grade"
            label="グレード"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.grade}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="loan"
            name="loan"
            label="ローン残債"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.loan}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}  className="panel-card-grid">
          <TextField
            id="car_state"
            name="car_state"
            label="車両状態"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.car_state}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="car_traveled_distance"
            name="car_traveled_distance"
            label="走行距離"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={formatCarTraveledDistance(props.data?.car?.car_traveled_distance)}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="desire_date"
            name="desire_date"
            label="売却希望時期"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.desire_date}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="displacement"
            name="displacement"
            label="排気量"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.displacement}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="bodyColor"
            name="bodyColor"
            label="ボディカラー"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.body_color}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default VehicleSection;
