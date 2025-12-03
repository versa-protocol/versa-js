import { SVGProps } from "react";

export const ExternalLink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M18 14a1 1 0 0 0-1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h5a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h11a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1z" />
    <path d="M21 1h-6a1 1 0 0 0 0 2h3.59l-9.3 9.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L20 4.41V8a1 1 0 0 0 2 0V2a1 1 0 0 0-1-1z" />
  </svg>
);
