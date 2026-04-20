import { useState, useRef } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from '@floating-ui/react';

import styles from './Tooltip.module.css';

const Tooltip = ({ children, content }) => {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const {
    refs,
    floatingStyles,
    context,
    middlewareData,
    placement,
  } = useFloating({
    placement: 'top',
    strategy: 'fixed', // 🔥 évite les jumps
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(10),
      flip(),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: 150, close: 100 },
  });

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const staticSide = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  }[placement.split('-')[0]];

  return (
    <>
      {/* Trigger */}
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className={styles.trigger}
      >
        {children}
      </span>

      {/* Tooltip toujours dans le DOM (IMPORTANT anti flash) */}
      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          visibility: open ? 'visible' : 'hidden',
        }}
        {...getFloatingProps()}
        className={styles.tooltip}
      >
        {content}

        {/* Arrow */}
        <div
          ref={arrowRef}
          className={styles.arrow}
          style={{
            position: 'absolute',
            left:
              middlewareData.arrow?.x != null
                ? `${middlewareData.arrow.x}px`
                : '',
            top:
              middlewareData.arrow?.y != null
                ? `${middlewareData.arrow.y}px`
                : '',
            [staticSide]: '-4px',
          }}
        />
      </div>
    </>
  );
};

export default Tooltip;