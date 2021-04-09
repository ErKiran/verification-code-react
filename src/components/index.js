import React, { useCallback, useState, memo } from 'react';
import Input from './Input';
import { SubmitCode } from '../services';
import { Redirect } from 'react-router';

export function VerificationInputComponent(props) {
  const {
    length,
    autoFocus,
    disabled,
    onChangeVerificationCode,
    inputClassName,
    inputStyle,
    ...rest
  } = props;

  const [activeInput, setActiveInput] = useState(0);
  const [codeInputError, setCodeInputError] = useState(null)
  const [code, setCodes] = useState(Array(length).fill(''));
  const [isCodeVerifiedFromServer, setIsCodeVerifiedFromServer] = useState(false)
  const [serverMsg, setServerMsg] = useState('')
  const [errorIndexs, setErrorIndexs] = useState([])

  const handleCodeChange = useCallback((codes) => {
    const code = codes.join('');
    onChangeVerificationCode(code);
  }, [onChangeVerificationCode],
  );

  const getRightValue = useCallback(
    (str) => {
      let changedValue = str;
      if (isNaN(changedValue) || changedValue === '') {
        setErrorIndexs(new Set([...new Set(errorIndexs), activeInput]))
        setCodeInputError("only number input is accepted")
      } else {
        setErrorIndexs([...errorIndexs].filter(x => x !== activeInput))
        setCodeInputError(null)
      }
      return !changedValue || /\d/.test(changedValue) ? changedValue : '';
    }, [errorIndexs, activeInput]
  );

  const changeCodeAtFocus = useCallback(
    (str) => {
      const updatedVerificationCode = [...code];
      updatedVerificationCode[activeInput] = str[0] || '';
      setCodes(updatedVerificationCode);
      handleCodeChange(updatedVerificationCode);
    },
    [activeInput, handleCodeChange, code],
  );

  const focusInput = useCallback(
    (inputIndex) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length],
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index) => () => {
      focusInput(index);
    },
    [focusInput],
  );

  const handleOnChange = useCallback(
    (e) => {
      setServerMsg('')
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue],
  );

  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  const handleOnKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Backspace':
        case 'Delete': {
          e.preventDefault();
          if (code[activeInput]) {
            changeCodeAtFocus('');
          } else {
            focusPrevInput();
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          getRightValue(e.currentTarget.value)
          focusPrevInput();
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          getRightValue(e.currentTarget.value)
          focusNextInput();
          break;
        }
        case ' ': {
          e.preventDefault();
          break;
        }
        default:
          break;
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, code, getRightValue],
  );

  const handleOnPaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text/plain')
        .trim()
        .slice(0, length - activeInput)
        .split('');
      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedVerificationCode = [...code];
        updatedVerificationCode.forEach((val, index) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedVerificationCode[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        setCodes(updatedVerificationCode);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
      }
    },
    [activeInput, getRightValue, length, code],
  );

  const handleCodeSubmit = useCallback(async (e) => {
    e.preventDefault();
    const payload = {
      codes: code
    }
    const { data } = await SubmitCode(payload)
    setIsCodeVerifiedFromServer(data.success)
    setServerMsg(data.msg)
    return data
  }, [code])


  const getClassName = (index) => [...errorIndexs].includes(index) ? 'codeInputError' : 'codeInput'

  return (
    <div>
      <form onSubmit={handleCodeSubmit}>
        <div {...rest}>
          <h2>Verification Code: </h2> <br />

          {Array(length)
            .fill('')
            .map((_, index) => (
              <Input
                key={`SingleInput-${index}`}
                focus={activeInput === index}
                value={code && code[index]}
                autoFocus={autoFocus}
                onFocus={handleOnFocus(index)}
                onChange={handleOnChange}
                onKeyDown={handleOnKeyDown}
                onBlur={onBlur}
                onPaste={handleOnPaste}
                style={inputStyle}
                className={getClassName(index)}
                disabled={disabled}
                error={codeInputError}
              />
            ))}
          {isCodeVerifiedFromServer && (
            <>
              <Redirect to="/success" />
            </>
          )}
          <br />
          <button ><h3> SUBMIT </h3></button>
        </div>
      </form>
      {serverMsg !== '' && (
        <>
          <div className="oaerror danger">
            <strong>Error</strong> - Verification Error!
        </div>
        </>)}
    </div>
  );
}

const VerificationInput = memo(VerificationInputComponent);
export default VerificationInput;