type ButtonProps = {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    growAnimation?: boolean;
    width?: string;
    height?: string;
    textSize?: string;
}

const Button = ({ children, onClick, className, growAnimation = false, width, height, textSize = "text-[1.4em]" }: ButtonProps) => {
    return (
        <div className={`${width ?? "w-full"} ${height ?? "h-14"}`}>
            <button
                onClick={onClick}
                children={children}
                className={`text-white flex items-center justify-center font-bold bg-agendai w-full h-full rounded-2xl hover:bg-agendai/90 cursor-pointer ${growAnimation ? "transition-transform transform hover:scale-101" : ""} ${className} ${textSize}`}
            />
        </div>
    )
}

export default Button