import React from "react";

type ErrorCardProps = {
    message: string;
    secondaryText?: string;
    icon?: React.ReactNode;
    className?: string;
};

const ErrorCard: React.FC<ErrorCardProps> = ({
    message,
    secondaryText,
    icon,
    className,
}) => (
    <div
        className={`max-w-md mx-auto mt-20 bg-white rounded-[15px] border border-gray-200 p-7 ${className || ""}`}
        style={{ boxShadow: "none" }}
    >
        {/* Header */}
        <div className="flex items-start gap-3">
            {icon && (
                <div className="text-2xl text-[#388160] mt-0.5">
                    {icon}
                </div>
            )}
            <div className="text-gray-900 font-semibold text-lg leading-snug">
                {message}
            </div>
        </div>

        {/* Secondary text highlight */}
        {secondaryText && (
            <div className="mt-5 bg-[#388160]/8  rounded-md px-4 py-3 text-sm text-[#388160]">
                {secondaryText}
            </div>
        )}
    </div>
);

export default ErrorCard;
