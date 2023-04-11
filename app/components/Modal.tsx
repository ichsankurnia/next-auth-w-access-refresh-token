import React, { MouseEvent, useEffect, useState } from 'react';

type Props = {
    onClose: (e: MouseEvent<HTMLElement>) => any,
    children: JSX.Element
};

const Modal: React.FC<Props> = ({ children, onClose }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

        return () => {
            setIsMounted(false)
        }
    }, [])

    return (
        <>
            <div className={`${isMounted ? 'open' : 'close'} modal-background`} onClick={onClose}>
                <div className={`${isMounted ? 'open' : 'close'} modal`} style={{ translate: '-50% -50%' }}>
                    <div className="w-full overflow-y-auto" style={{ maxHeight: '90vh' }}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Modal;