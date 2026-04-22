export default function LoadingPrimoLogo({ className = "" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 86 86" 
      className={`w-5 h-5 text-black ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        className="primo-loader-path loader-delay-2"
        d="M34.1417 8.48529C38.828 3.799 46.4259 3.79899 51.1122 8.48528L53.7653 11.1383L11.1723 53.7313L8.51928 51.0782C3.83299 46.3919 3.83299 38.794 8.51928 34.1077L34.1417 8.48529Z" 
      />
      <path 
        className="primo-loader-path loader-delay-4"
        d="M50.976 76.5644C46.2897 81.2507 38.6917 81.2507 34.0054 76.5644L31.0628 73.6217L59.7697 44.9148L71.1977 56.3427L50.976 76.5644Z" 
      />
      <path 
        className="primo-loader-path loader-delay-3"
        d="M76.585 34.0685C81.2713 38.7548 81.2713 46.3528 76.585 51.0391L73.8728 53.7513L31.3786 11.2571L34.0908 8.54491C38.7771 3.85862 46.3751 3.85862 51.0614 8.54491L76.585 34.0685Z" 
      />
      <path 
        className="primo-loader-path loader-delay-1"
        d="M8.48529 50.924C3.799 46.2377 3.79899 38.6397 8.48528 33.9534L11.4099 31.0288L53.9041 73.523L50.9795 76.4476C46.2932 81.1339 38.6952 81.1339 34.0089 76.4476L8.48529 50.924Z" 
      />
    </svg>
  );
}