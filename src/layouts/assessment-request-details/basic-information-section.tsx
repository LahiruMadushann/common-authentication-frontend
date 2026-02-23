
import { formatPhoneNumber } from "@/src/utils/formatPhoneNumber";
import { Grid, Stack, TextField, Typography } from "@mui/material";

const gridLineStyle = {
  borderRight: { md: "1px solid #AAAAAA" },
  // height: { md: "100px" }, // Adjust height as needed
  display: { md: "flex" },
  alignItems: { md: "center" },
  justifyContent: { md: "center" },
};

function BasicInformationSection(props : any) {
  return (
    <div>
      <Stack spacing={2}>
        <Typography variant="h5" component="h5" className="text-heading">
          基礎情報
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
            id="telephoneNumber"
            name="telephoneNumber"
            label="電話番号"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={formatPhoneNumber(props.data?.customer?.phone?.content)}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="postalCode"
            name="postalCode"
            label="郵便番号"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={`〒${props.data?.customer?.post_number}`}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="streetAddress"
            name="streetAddress"
            label="番地"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.address}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="name"
            name="name"
            label="名前"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.name}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="prefecture"
            name="prefecture"
            label="都道府県"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.prefecture}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className="panel-card-grid">
          <TextField
            id="buildingName"
            name="buildingName"
            label="ビル名等"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.address_detail}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="email"
            name="email"
            label="メール"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.email?.content}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={gridLineStyle} className="panel-card-grid">
          <TextField
            id="streetAddress"
            name="streetAddress"
            label="市区町村"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              readOnly: true,
            }}
            value={props.data?.customer?.municipalities}
            variant="standard"
            fullWidth
            className="panel-card-text-field"
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default BasicInformationSection;
