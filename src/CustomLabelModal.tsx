import {Box, Button, Stack, TextField} from "@mui/material";
import React, {FormEvent, useState} from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type CustomLabelModalProps = {
    closeModal: () => void;
    addTimer: (label: string, duration: number) => void;
}

export const CustomLabelModal = (props: CustomLabelModalProps) => {

    const [label, setLabel] = useState<string>('');
    const [duration, setDuration] = useState<number>(1);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        props.addTimer(label, duration);
        props.closeModal();
    }

    return (
        <Box sx={{...style, width: 200}}>
            <form onSubmit={handleSubmit}>
                <Stack gap={2}>
                    <TextField
                        label="Label"
                        onChange={(e) => setLabel(e.target.value)}
                    />
                    <TextField
                        type='number'
                        label="Duration"
                        onChange={(e) => setDuration(Number(e.target.value))}
                    />
                    <Stack direction='row' justifyContent='end'>
                        <Button onClick={props.closeModal}>Cancel</Button>
                        <Button variant='contained' type='submit'>Add</Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    )
}