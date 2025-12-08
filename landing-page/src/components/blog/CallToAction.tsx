import React from "react";
import { EXTERNAL_LINKS, CTA_TEXTS } from "../../config/constants";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  title = CTA_TEXTS.BETA_TITLE,
  description = CTA_TEXTS.BETA_DESCRIPTION,
  buttonText = CTA_TEXTS.BETA_BUTTON,
  buttonLink = EXTERNAL_LINKS.BETA_FORM,
}) => {
  return (
    <div className="not-prose my-12 p-8 bg-linear-to-br from-green-600 via-green-700 to-emerald-600 rounded-2xl shadow-xl text-white">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="mb-6 text-green-50 text-lg leading-relaxed">
        {description}
      </p>
      <a
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
      >
        {buttonText}
      </a>
    </div>
  );
};
