import { SVGProps } from "react";

export const Wallet = (_props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>wallet</title>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2,12H7.5c2,0,2,2.5,4.5,2.5S14.5,12,16.5,12H22" />
    <path d="M2,12V10A2,2,0,0,1,4,8H20a2,2,0,0,1,2,2v2" />
  </svg>
);
