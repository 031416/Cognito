
import React from 'react';

type IconName = 'logo' | 'search' | 'sparkles' | 'takeaways' | 'questions' | 'error' | 'link' | 'loader';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const ICONS: Record<IconName, React.ReactNode> = {
  logo: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.252a6.25 6.25 0 110 11.496A6.25 6.25 0 0112 6.252zm0 0v11.496m0-11.496c-2.43 0-4.63.844-6.25 2.248m6.25-2.248c2.43 0 4.63.844 6.25 2.248M2.25 12c0-3.866 3.134-7 7-7s7 3.134 7 7-3.134 7-7 7-7-3.134-7-7zm0 0h19.5"
    />
  ),
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  ),
  sparkles: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18l-1.813-2.096a4.5 4.5 0 01-1.687-3.322V10.5a4.5 4.5 0 014.5-4.5h2.25a4.5 4.5 0 014.5 4.5v2.082a4.5 4.5 0 01-1.687 3.322l-1.813 2.096-1.22-.686-1.22.686zM12 12V6m0 6h.008m-4.512-3.086l.707-.707m6.364.707l-.707-.707"
    />
  ),
  takeaways: (
     <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  ),
  questions: (
    <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" 
    />
  ),
  error: (
     <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
    />
  ),
  link: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
    />
  ),
  loader: (
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  ),
};

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className || "w-6 h-6"}
      {...props}
    >
      {ICONS[name]}
    </svg>
  );
};

export default Icon;
