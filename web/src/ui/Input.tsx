import DateInput from "./DateInput";

type InputProps = {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    type?: string;
}

const Input = ({ placeholder = "Enter text", value, onChange, className = "", type = 'text' }: InputProps) => {
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
                    className={`border border-gray-500 text-lg rounded-xl h-12 p-2 w-full focus:border-agendai focus:outline-none ${className}`}
                    lang="fr"
                />
            )}
        </>
    )
}

export default Input