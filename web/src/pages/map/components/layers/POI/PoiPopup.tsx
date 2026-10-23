import type { GeoJsonProperties } from "geojson";
import type { PoiConfig } from "../../PoiConfig";
import { buildAddress, formatOpeningHours } from "../../../../../utils/pois";

type PoiPopupProps = {
    props: NonNullable<GeoJsonProperties>;
    tags: Record<string, string>;
    config: PoiConfig;
};

export default function PoiPopup({ props, tags, config }: PoiPopupProps) {
    const address = props.address || buildAddress(tags);
    const phone = props.phone || tags.phone || tags["contact:phone"];
    const website = props.website || tags.website || tags["contact:website"];
    const email = tags.email || tags["contact:email"];
    const openingHours = props.opening_hours || tags.opening_hours;
    const hours = openingHours ? formatOpeningHours(openingHours) : null;

    return (
        <div className="font-sans min-w-[220px] max-w-[280px]">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 leading-tight m-0">
                        {props.name ||
                            tags.name ||
                            "Aucun nom disponible"}
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500 m-0">
                        {config.label}
                    </p>
                </div>
            </div>
            <div className="space-y-3">
                {address && (
                    <div>
                        <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-[-10px]">
                            Adresse
                        </h4>
                        <p className="text-[12px] text-gray-700 leading-relaxed">
                            {address}
                        </p>
                    </div>
                )}

                {phone && (
                    <div>
                        <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                            Téléphone
                        </h4>
                        <a
                            href={`tel:${phone}`}
                            className="text-[12px] no-underline hover:underline transition-colors duration-150"
                            style={{ color: config.color }}
                        >
                            {phone}
                        </a>
                    </div>
                )}

                {email && (
                    <div>
                        <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                            Email
                        </h4>
                        <a
                            href={`mailto:${email}`}
                            className="text-[12px] no-underline hover:underline transition-colors duration-150 break-all"
                            style={{ color: config.color }}
                        >
                            {email}
                        </a>
                    </div>
                )}

                {website && (
                    <div>
                        <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                            Site web
                        </h4>
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] no-underline hover:underline transition-colors duration-150"
                            style={{ color: config.color }}
                        >
                            {website.replace(
                                /^https?:\/\//,
                                "",
                            )}
                        </a>
                    </div>
                )}

                {hours && hours.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-semibold tracking-wide text-gray-400 mb-1">
                            Horaires
                        </h4>
                        <div className="text-[11px] text-gray-700 leading-relaxed space-y-0.5">
                            {hours.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center"
                                >
                                    <span className="font-medium text-gray-600">
                                        {h.days}
                                    </span>
                                    {h.hours && (
                                        <span className="font-semibold text-gray-800">
                                            {h.hours}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
