import React from 'react';

const EmptyPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ecf1fd',
            color: '#64748b',
            fontSize: '1.3rem',
            fontWeight: 500
        }}>
            This page is empty.
        </div>
    );
};

export default EmptyPage;
