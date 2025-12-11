import { Button } from '@chakra-ui/react';

const AppButton = ({ children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: "bg-brand-500 hover:bg-brand-600 text-white border-transparent",
        secondary: "bg-slate-200 hover:bg-slate-300 text-slate-900 border-transparent dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white",
        outline: "bg-transparent border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-brand-500 dark:hover:border-brand-500",
        ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:bg-slate-50 dark:hover:bg-white/5",
        danger: "bg-red-500 hover:bg-red-600 text-white border-transparent"
    };

    return (
        <Button
            className={`
                !rounded-lg !font-bold !transition-all !duration-200 !px-6 !py-5
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {children}
        </Button>
    );
};

export default AppButton;
