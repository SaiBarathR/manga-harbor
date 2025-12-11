import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  // Sync Chakra UI's color mode with Tailwind's class strategy
  useEffect(() => {
    const root = window.document.documentElement;
    if (colorMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [colorMode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <IconButton
      isRound
      size="md"
      variant="ghost"
      aria-label="Toggle Theme"
      icon={colorMode === 'dark' ? <SunIcon w={5} h={5} /> : <MoonIcon w={5} h={5} />}
      onClick={toggleColorMode}
      className={`
        !transition-all !duration-300
        ${colorMode === 'dark' 
            ? '!text-yellow-400 hover:!bg-white/10' 
            : '!text-slate-600 hover:!text-slate-900 hover:!bg-slate-200'
        }
      `}
    />
  );
};

export default ThemeToggle;
