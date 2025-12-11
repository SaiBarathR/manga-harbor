const AppCard = ({ children, className = '', noPadding = false, ...props }) => {
    return (
        <div 
            className={`
                bg-white dark:bg-dark-surface 
                border border-slate-200 dark:border-slate-800 
                shadow-sm dark:shadow-none 
                rounded-xl overflow-hidden transition-colors duration-200
                ${noPadding ? '' : 'p-6'}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export default AppCard;
