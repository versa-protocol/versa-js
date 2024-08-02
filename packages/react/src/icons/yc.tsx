import { SVGProps } from "react";

export const YC = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" fill="none">
    <g clipPath="url(#a)">
      <path
        fill="#F60"
        d="M435.2 0H76.8C34.385 0 0 34.385 0 76.8v358.4C0 477.615 34.385 512 76.8 512h358.4c42.415 0 76.8-34.385 76.8-76.8V76.8C512 34.385 477.615 0 435.2 0z"
      />
      <path
        fill="#fff"
        d="M126 113h49l81 164 81-165h49L274 314v134h-42V314L126 113z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <rect width="512" height="512" fill="#fff" rx="256" />
      </clipPath>
    </defs>
  </svg>
);
