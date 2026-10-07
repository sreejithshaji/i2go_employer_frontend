'use client';

import { usePathname } from 'next/navigation';
import { Alert, Box, CircularProgress } from '@mui/material';
import { useI18n } from '@/features/i18n';
import { loginHref } from './login-href';
import Redirect from './redirect';
import { useAuth } from './use-auth';

/** Wraps pages that need a signed-in employer. */
export default function RequireEmployer({ children }) {
    const { ready, user, isEmployer } = useAuth();
    const pathname = usePathname();
    const { t } = useI18n();

    if (!ready) {
        return <Box sx={{ display: 'grid', placeItems: 'center', py: 12 }}><CircularProgress /></Box>;
    }
    if (!user) {
        return <Redirect to={loginHref(pathname)} />;
    }
    if (!isEmployer) {
        return <Alert severity="info">{t.common.employerOnly}</Alert>;
    }
    return children;
}
