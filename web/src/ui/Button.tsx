import {BackgroundColors, TextColors}  from "../utils/colors";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  growAnimation?: boolean;
  width?: string;
  height?: string;
  textSize?: string;
  textColor?: string;
  textHoverColor?: string;
  disabled?: boolean;
  isLoading?: boolean;
  shadowHover?: string;
  rounded?: string;
  backgroundColor?: string;
  backgroundHoverColor?: string;
};

const Button = ({
  children,
  onClick,
  growAnimation = false,
  width,
  height,
  textSize = "text-[1.4em]",
  textColor = TextColors.white,
  textHoverColor = TextColors.white,
  disabled = false,
  isLoading = false,
  shadowHover = "hover:shadow-lg",
  className = "",
  rounded = "rounded-lg",
  backgroundColor = BackgroundColors.green,
  backgroundHoverColor = BackgroundColors.greenHover,
}: ButtonProps) => {

  return (
    <div className={`${width ?? "w-full"} ${height ?? "h-11"}`}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex ${backgroundColor} ${backgroundHoverColor} ${shadowHover}
          ${textColor} ${textHoverColor} items-center justify-center font-bold w-full h-full ${rounded}
          disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 group ${growAnimation ? "transition-transform transform hover:scale-105" : ""} ${textSize} ${className}
        `}
      >
        {isLoading ? "Recherche en cours..." : children}
      </button>
    </div>
  );
};

export default Button;
