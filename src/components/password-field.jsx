'use client';

import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/** TextField for passwords with an eye button to show or hide what was typed. */
export default function PasswordField({ showLabel = 'Show password', hideLabel = 'Hide password', slotProps, ...props }) {
    const [visible, setVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={visible ? 'text' : 'password'}
            slotProps={{
                ...slotProps,
                input: {
                    ...slotProps?.input,
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                aria-label={visible ? hideLabel : showLabel}
                                onClick={() => setVisible((v) => !v)}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}
