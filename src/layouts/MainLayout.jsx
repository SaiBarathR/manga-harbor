import { Box, Flex, Text, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody, Badge } from '@chakra-ui/react';
import { HamburgerIcon, StarIcon, DownloadIcon } from '@chakra-ui/icons';
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from '../components/ThemeToggle';

const NavItem = ({ to, icon, children, onClick, badge }) => (
    <NavLink 
        to={to} 
        onClick={onClick}
        className={({ isActive }) => `
            flex items-center gap-4 px-6 py-4 text-lg font-medium rounded-xl transition-all duration-200 relative
            ${isActive 
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 font-bold' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }
        `}
    >
        {icon}
        {children}
        {badge && (
            <Badge colorScheme="blue" variant="solid" className="ml-auto rounded-full px-2">
                {badge}
            </Badge>
        )}
    </NavLink>
);

const SidebarContent = ({ onClick }) => {
    const { itemsToDownload, preparingZips } = useSelector(state => state.mangaDownloader);
    const activeDownloads = (itemsToDownload?.length || 0) + (preparingZips?.length || 0);

    return (
        <div className="flex flex-col h-full py-8 px-4">
            <div className="flex items-center gap-3 px-4 mb-12">
                <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    M
                </div>
                <Text className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    MangaHarbor
                </Text>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                <NavItem to="/" icon={<StarIcon boxSize={5} />} onClick={onClick}>Discover</NavItem>
                <NavItem 
                    to="/downloads" 
                    icon={<DownloadIcon boxSize={5} />} 
                    onClick={onClick}
                    badge={activeDownloads > 0 ? activeDownloads : null}
                >
                    Downloads
                </NavItem>
            </nav>

            <div className="mt-auto px-4">
                <ThemeToggle />
            </div>
        </div>
    );
};

const MainLayout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-white flex transition-colors duration-200">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-80 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-surface fixed h-screen z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-30 bg-white/90 dark:bg-dark-surface/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-500 rounded flex items-center justify-center text-white font-bold">M</div>
                    <Text className="font-bold text-lg">MangaHarbor</Text>
                </div>
                <div className="flex gap-2">
                    <ThemeToggle />
                    <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onOpen} aria-label="Menu" />
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent className="!bg-light-bg dark:!bg-dark-surface">
                    <DrawerCloseButton className="mt-2 text-slate-500" />
                    <DrawerBody className="p-0">
                        <SidebarContent onClick={onClose} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <main className="flex-1 md:ml-80 w-full min-h-screen p-4 md:p-8 pt-20 md:pt-8 bg-light-bg dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto animate-appear">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
