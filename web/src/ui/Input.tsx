import DateInput from "./DateInput";
import {BorderColors, TextColors, FocusColors, PlaceholderColors}  from "../utils/colors";

type InputProps = {
    width?: string;
    height?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type?: string;
    borderColor?: string;
    textColor?: string;
    focusColor?: string;
}

const Input = ({ 
    width = "w-full",
    height,
    placeholder = "Enter text",
    value, onChange,
    className = "",
    type = 'text',
    textColor = TextColors.gray,
    borderColor = BorderColors.gray,
    focusColor = FocusColors.green,
    placeholderColor = PlaceholderColors.gray,
}: InputProps) => {
    return (
        <>
            {type === 'date' ? (
                <DateInput
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            ) : type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`border border-gray-500 rounded-xl p-2 w-full h-24 resize-none focus:outline-none focus:border-agendai ${className}`}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        ${width} ${height} px-4 py-2 pr-12 ${textColor} border ${borderColor} ${placeholderColor} rounded-lg focus:outline-none focus:ring-2 ${focusColor} ${className}`}
                    lang="fr"
                />
            )}
        </>
    )
}

export default Input