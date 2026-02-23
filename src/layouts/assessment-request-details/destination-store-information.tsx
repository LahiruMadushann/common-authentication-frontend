import React from "react";
import { Grid, Stack, TextField, Typography } from "@mui/material";

function DestinationStoreInformation(props: any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          送客先店舗情報
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        direction="row"
        textAlign="center"
        className="panel-card"
      >
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="destinationInformation_1"
            name="destinationInformation_1"
            label="送客先店舗1"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.shops?.shops[0]?.name}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="destinationInformation_2"
            name="destinationInformation_2"
            label="送客先店舗2"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.shops?.shops[1]?.name}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="destinationInformation_3"
            name="destinationInformation_3"
            label="送客先店舗3"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.shops?.shops[2]?.name}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default DestinationStoreInformation;
