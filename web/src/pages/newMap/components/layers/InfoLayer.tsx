type InfoLayerProps = {
    isVisible?: boolean;
};

const InfoLayer = ({ isVisible = true }: InfoLayerProps) => {
    if (!isVisible) return null;

    return (
        <div className="absolute top-4/100 left-2/100 z-1000 h-92/100 w-23/100 flex items-center justify-center bg-white rounded-xl shadow-lg">
        </div>
    )
}

export default InfoLayer;