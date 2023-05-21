import React from 'react';
import { FiBell } from 'react-icons/fi';
import Badge from './Badge';

function NotificationIcon({ notifications , onClick}) {
    return (
            <button style={{ position: 'relative', border: 'none', background: 'none' }} onClick={onClick}>
                <FiBell size={26} />
                {notifications > 0 && <Badge>{notifications}</Badge>}
            </button >
    );
}

export default NotificationIcon;