import NextLink from 'next/link';
import { Button } from '@mui/material';
import { FiArrowRight } from 'react-icons/fi';

/**
 * The primary call to action: the theme's `cta` variant (gradient, plan §1.7)
 * with the round arrow chip. Internal paths go through Next's Link; anchors
 * (#employers), mailto: and tel: stay plain links. Without `href` it's a
 * button (e.g. a form's submit).
 */
export default function CtaButton({ href, children, ...props }) {
    const link = href == null ? {} : { component: isInternal(href) ? NextLink : 'a', href };
    return (
        <Button variant="cta" endIcon={<FiArrowRight aria-hidden />} {...link} {...props}>
            {children}
        </Button>
    );
}

function isInternal(href) {
    return href.startsWith('/') && !href.startsWith('//');
}
