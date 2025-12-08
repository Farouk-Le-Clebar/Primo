import React from "react";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className="not-prose my-12 p-8 bg-linear-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl shadow-xl text-white">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="mb-6 text-blue-50 text-lg leading-relaxed">{description}</p>
      <a
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        {buttonText}
      </a>
    </div>
  );
};
