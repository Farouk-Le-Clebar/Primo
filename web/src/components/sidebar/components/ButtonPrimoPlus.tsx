import topographix from "../../../assets/images/topographic.svg";
import logoPrimoWhite from "../../../assets/logos/logoPrimoWhite.svg";

export default function ButtonPrimoPlus() {
    return (
        <button className="flex w-50 h-[11%] rounded-xl overflow-hidden 
            shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] cursor-pointer bg-cover bg-center 
            transition-transform duration-500 ease-in-out hover:scale-101 items-center justify-center gap-1" 
            style={{ backgroundImage: `url(${topographix})` }}
        >
            <img src={logoPrimoWhite} alt="Logo Primo" className="flex w-14 h-14 z-10" />
            <span className="flex z-10 text-4xl text-white font-semibold">Primo+</span>
        </button>
    );
}