import { useEffect, useRef } from 'react';
import { mountLauncher } from '../utils/launcher';

export function ToolsLauncher() {
  const slot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (slot.current) return mountLauncher(slot.current);
  }, []);

  return <span ref={slot} className="tools-launcher" />;
}
