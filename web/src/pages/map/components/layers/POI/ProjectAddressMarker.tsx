import { memo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { ProjectAddress } from "../../../../../types/project/addresses";

type ProjectAddressMarkerProps = {
    address: ProjectAddress;
};

const ADDRESS_ICON_SIZE = 28;
const ADDRESS_COLOR = "#111827";

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;

const addressIcon = L.divIcon({
    html: `<div style="width:${ADDRESS_ICON_SIZE}px;height:${ADDRESS_ICON_SIZE}px;border-radius:50%;background-color:${ADDRESS_COLOR};border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${PIN_SVG}</div>`,
    className: "project-address-marker",
    iconSize: [ADDRESS_ICON_SIZE, ADDRESS_ICON_SIZE],
    iconAnchor: [ADDRESS_ICON_SIZE / 2, ADDRESS_ICON_SIZE / 2],
    popupAnchor: [0, -(ADDRESS_ICON_SIZE / 2 + 4)],
});

const ProjectAddressMarker = ({ address }: ProjectAddressMarkerProps) => (
    <Marker position={[address.latitude, address.longitude]} icon={addressIcon} zIndexOffset={1000}>
        <Popup>
            <div className="font-inter">
                <p className="text-sm font-semibold text-gray-900">{address.address}</p>
                {address.description && <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">{address.description}</p>}
            </div>
        </Popup>
    </Marker>
);

export default memo(ProjectAddressMarker);
