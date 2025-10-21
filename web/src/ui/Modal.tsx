type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    title?: string;
};

const modalSizeClasses = {
    small: 'w-200',
    medium: 'w-250',
    large: 'w-300',
};

const Modal = ({ isOpen, onClose, children, size = "medium", title }: ModalProps) => {
return (
    isOpen ? (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60`}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-xl shadow-lg ${modalSizeClasses[size]} h-150`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-agendai h-10/100 p-2 rounded-t-xl text-dark-gray flex items-center justify-center font-bold text-xl">
                    <span className="truncate whitespace-nowrap overflow-ellipsis">{title}</span>
                </div>
                <div className="h-full bg-darker-light-gray rounded-b-xl p-4">
                    {children}
                </div>
            </div>
        </div>
    ) : null
)
}

export default Modal;