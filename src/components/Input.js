import React, { memo, useLayoutEffect, useRef } from 'react';
import usePrevious from '../utils/usePervious';

export function InputComponent(props) {
    const { focus, autoFocus, ...rest } = props;
    const inputRef = useRef(null)

    const previousFocus = usePrevious(!!focus)

    useLayoutEffect(() => {
        if (inputRef.current) {
            if (focus && autoFocus) {
                inputRef.current.focus();
            }
            if (focus && autoFocus && focus !== previousFocus) {
                inputRef.current.focus();
                inputRef.current.select();
            }
        }
    }, [autoFocus, focus, previousFocus])
    return (
        <>
            <input ref={inputRef} {...rest} />
        </>

    )
}

const Input = memo(InputComponent)
export default Input