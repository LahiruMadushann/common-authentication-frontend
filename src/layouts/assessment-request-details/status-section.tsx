import { Grid, InputLabel, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { statusTypeFilter } from "../../utils/status-type-filter";

function StatusSection(props: any) {
  return (
    <div>
      <Stack spacing={2}>
        {/* <Typography variant="h5" component="h5" className="text-heading">
          アフィリエイト媒体
        </Typography>
        <Typography variant="h5" component="h5" justifyContent={"center"}>
        {props.data?.saved_utm_param}
        </Typography> */}
        <Typography variant="h5" component="h5" className="text-heading text-center">
          ステータス
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        direction="row"
        textAlign="center"
        className="panel-card"
      >
        <Grid item xs={12} sm={6} md={6} className="panel-card-grid">
          <InputLabel  className="popup-status">{props.data?.status && statusTypeFilter(props.data?.status)}</InputLabel>
        </Grid>
        {/* <Grid item xs={12} sm={6} md={6} className="panel-card-grid">
          <TextField
            id="note"
            name="note"
            label="備考"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.supplement?.note}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid> */}
        <Grid item xs={12} sm={6} md={6} className="panel-card-grid">
          <TextField
            id="param"
            name="param"
            label="パラメーター"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.supplement?.param}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="panel-card-grid">
          <TextField
            id="message_for_matching_shop"
            name="message_for_matching_shop"
            label="CTNサポートからの連絡事項"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.supplement?.message_for_matching_shop}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default StatusSection;
