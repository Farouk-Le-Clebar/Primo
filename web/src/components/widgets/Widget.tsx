type WidgetProps = {
    children?: React.ReactNode;
    title?: string;
};

const Widget = ({ children, title }: WidgetProps) => {
    return (
        <div className="w-50 h-50 bg-white rounded-2xl shadow-lg p-2 pt-1 flex flex-col gap-1">
            {title &&
                <div className="w-full h-15/100 rounded-t-lg border-b-1 border-gray-300 flex items-center">
                    <h2 className="font-UberMoveBold text-gray-600 text-sm ml-1">{title}</h2>
                </div>
            }
            <div className="flex-1 pl-1 pr-1">
                {children}
            </div>
        </div>
    );
};

export default Widget;