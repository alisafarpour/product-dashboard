import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmberRounded';
import {Stack} from '@mui/material';

type Props = {
    open: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({
                                  open,
                                  title,
                                  message,
                                  confirmLabel = 'تأیید',
                                  cancelLabel = 'انصراف',
                                  destructive = true,
                                  loading = false,
                                  onConfirm,
                                  onCancel,
                              }: Props) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            maxWidth="xs"
            fullWidth
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            slotProps={{
                paper: {
                    sx: {borderRadius: 3}
                }
            }}
        >
            <DialogTitle id="confirm-dialog-title">
                <Stack direction="row" spacing={1}>
                    <WarningAmberIcon color={destructive ? 'error' : 'warning'}/>
                    <span>{title}</span>
                </Stack>
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="confirm-dialog-description">{message}</DialogContentText>
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2}}>
                <Button onClick={onCancel} disabled={loading} color="inherit">
                    {cancelLabel}
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    color={destructive ? 'error' : 'primary'}
                    /* فوکوس اولیه روی دکمهٔ مخرب نباشد → جلوگیری از تأیید سهوی با Enter */
                    autoFocus={!destructive}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
