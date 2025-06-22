'use client';

import { createPortal } from "react-dom";
import styles from "./Dialog.module.scss";
import {useEffect, useRef, useState} from "react";
import { cn } from "@/utils/className";

export type DialogProps = {
  show: boolean;
  onClose: () => void;
  portalRoot: "dialog" | "popover";
  classNameOverflow?: string;
  classNameModal?: string;
};

type ClientPortalProps = {
  children: React.ReactNode;
} & DialogProps;

export default function Dialog(props: ClientPortalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.show) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [props.show]);

  useEffect(() => {
    const target = props.portalRoot
        ? document.getElementById(props.portalRoot)
        : document.getElementById("dialog");
    setPortalRoot(target);
  }, [props.portalRoot]);

  const handleOverlayClick = () => {
    dialogRef.current?.classList.add(styles.close);
    setTimeout(props.onClose, 50);
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return props.show && portalRoot
    ? createPortal(
        <div className={cn(styles.overflow, props.classNameOverflow)} onMouseDown={handleOverlayClick}>
          <div ref={dialogRef} className={cn(styles.modal, props.classNameModal)} onMouseDown={handleModalContentClick}>
            {props.children}
          </div>
        </div>,
        portalRoot,
      )
    : null;
}
