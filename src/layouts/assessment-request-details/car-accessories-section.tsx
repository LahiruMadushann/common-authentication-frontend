
import { Grid, Stack, TextField, Typography } from "@mui/material";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { md: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

function CarAccessoriesSection(props : any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          装飾品
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        direction="row"
        textAlign="center"
        className="panel-card"
      >
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid" sx={gridLineStyle}>
          <TextField
            id="navigation"
            name="navigation"
            label="ナビ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.navigation}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          className="panel-card-grid"
          sx={gridLineStyle}
        >
          <TextField
            id="handle_type"
            name="handle_type"
            label="ハンドル"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.handle_type}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}  className="panel-card-grid">
          <TextField
            id="sunroof"
            name="sunroof"
            label="サンルーフ"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.sunroof}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="auto_slide"
            name="auto_slide"
            label="電動スライド"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.auto_slide}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle}className="panel-card-grid">
          <TextField
            id="back_monitor"
            name="back_monitor"
            label="バックモニター"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.back_monitor}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="wheel"
            name="wheel"
            label="タイヤホイール"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.wheel}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle}className="panel-card-grid">
          <TextField
            id="leather_sheet"
            name="leather_sheet"
            label="皮シート"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.car?.leather_sheet}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default CarAccessoriesSection;
