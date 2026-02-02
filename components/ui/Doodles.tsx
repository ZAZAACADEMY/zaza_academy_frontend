import React from "react";

export const UnderlineDoodle = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 268 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M3 13.9105C59.0886 4.98188 174.542 -7.50294 265 9.77098"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowDoodle = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 94 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M89.7025 3.02492C78.4908 26.6974 53.6841 53.0569 16.5913 63.8562"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.76686 65.689C13.4357 73.1895 24.3828 72.8227 33.2798 68.6192"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.76686 65.6888C5.07174 51.5796 14.1205 45.4215 25.1481 40.5235"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparkleDoodle = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 46 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.0003 3.65967C24.4704 15.352 26.6579 20.6713 42.6622 23.5002C27.1328 27.2458 24.1627 31.7824 23.0003 43.3407C20.6866 31.1449 17.5 27.0256 3.33835 23.5002C17.5 21.321 21.0503 16.3268 23.0003 3.65967Z"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HighlightsDoodle = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 46 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 5  L25 15"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M40 5  L30 15"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M10 40 L20 30"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export const CircleDoodle = ({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) => (
  <svg
    className={className}
    viewBox="0 0 180 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M176.602 29.8519C174.453 17.4764 156.402 7.74755 125.152 4.09727C77.4027 -1.48065 25.5539 3.09756 8.55447 16.3521C-5.14506 27.0345 -0.295286 44.5905 28.3039 51.6912C63.2029 60.3551 127.352 59.9489 157.051 47.9575C169.851 42.79 175.751 34.6185 174.501 27.4619"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
