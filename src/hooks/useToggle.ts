import { useState, useCallback } from "react";

const useToggle = (state = false) => {
  const [isOpen, toggle] = useState<boolean>(state);

  const open = useCallback(() => {
    toggle(true);
  }, []);
  const close = useCallback(() => toggle(false), []);
  const toogle = () => toggle((prev) => !prev);
  const set = (val: boolean) => toggle(val);

  return { isOpen, close, open, toogle, set };
};

export default useToggle;
