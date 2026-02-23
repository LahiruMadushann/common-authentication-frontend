
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Stack, Button, Modal, Box } from "@mui/material";

export function ModalComponent(props: any) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxHeight: "700px",
    overflow: "auto",
    width: props.width ? props.width : 800,
    bgcolor: "background.paper",
    border: "2px solid #ffffff",
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={props.isOpen}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={props.handleClose}><CloseRoundedIcon/></Button>
        </Stack>
        {props.children}
      </Box>
    </Modal>
  );
}
