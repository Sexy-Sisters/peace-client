import React from 'react'

import { Snackbar, Alert, Slide } from "@mui/material";
import { useRecoilState } from "recoil";
import { snackbarState } from '../atom';

function SnackBar() {
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);
  return (
    <Snackbar
      open={snackbar.isOpen}
      autoHideDuration={3000}
      // TransitionComponent={Slide}
      onClose={() => setSnackbar({
        ...snackbar,
        isOpen: false
      })}
    // action={action}
    >
      <Alert onClose={() => setSnackbar({
        ...snackbar,
        isOpen: false
      })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '10px', }}>
        {snackbar.message}
      </Alert>
    </Snackbar >
  )
}

export default SnackBar