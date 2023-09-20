import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {  IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode()
    const toolTipText = useMemo(() => (`Switch to ${colorMode === 'dark' ? 'Light' : 'Dark'} mode`), [colorMode])

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Tooltip label={toolTipText} hasArrow arrowSize={10}>
            <IconButton onClick={toggleColorMode} minW={'none'} width={'32px'} height={'32px'} rounded={'full'}>
                {colorMode === 'light' ? <SunIcon boxSize={4} /> : <MoonIcon boxSize={4} />}
            </IconButton>
        </Tooltip>
    );
};