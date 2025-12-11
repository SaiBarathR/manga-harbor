import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';

const AppInput = ({ icon, className = '', ...props }) => {
    return (
        <InputGroup size="lg" className={`${className}`}>
            {icon && (
                <InputLeftElement pointerEvents='none' className="text-slate-400">
                    {icon}
                </InputLeftElement>
            )}
            <Input 
                className={`
                    !bg-slate-50 dark:!bg-slate-900 
                    !border-2 !border-slate-200 dark:!border-slate-800 
                    focus:!border-brand-500 dark:focus:!border-brand-500 
                    !text-slate-900 dark:!text-white 
                    !rounded-lg !font-medium placeholder:text-slate-400
                `}
                {...props} 
            />
        </InputGroup>
    );
};

export default AppInput;
