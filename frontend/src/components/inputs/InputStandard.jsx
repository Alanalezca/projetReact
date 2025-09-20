import { forwardRef } from 'react';
import styles from './InputStandard.module.css';

const InputStandard = forwardRef(({strID, strPlaceholder, strValeurByDef, strType, intMaxLength, strTxtAlign, strColor, strMt, strMb}, ref) => {
    return (
        <input className={`mt-${strMt ? strMt : "0"} mb-${strMb ? strMb : "0"} ${styles.input} ${strTxtAlign == "left" ? styles.txtLeft : strTxtAlign == "right" ? styles.txtRight : styles.txtCenter}`}
            type={strType}
            maxLength={intMaxLength}
            placeholder={strPlaceholder}
            defaultValue={strValeurByDef}
            id={strID}
            ref={ref}
            style={{
            color: strColor || "white"
            }}
        />
    )
});

export default InputStandard;