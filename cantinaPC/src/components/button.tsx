import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  children: ReactNode;

  to: string;
  isSelected: boolean;
  onClick: () => void;
};

export function Button({
  title,
  children,
  isSelected,
  onClick,
  to,
  ...rest
}: Props) {
  return (
    <>
      {isSelected ? (
        <button {...rest} onClick={onClick}>
          <div className="border-l-4 border-yellow">
            <div className="w-56 ml-7 py-3 bg-opacity-20 bg-yellow rounded-lg flex">
              <span className="text-yellow px-3">{children}</span>
              <span className="text-yellow font-medium text-sm uppercase">
                {title}
              </span>
            </div>
          </div>
        </button>
      ) : (
        <Link to={to}>
          <button {...rest} onClick={onClick}>
            <div>
              <div className="w-56 ml-7 py-3 flex">
                <span className="text-gray-700 px-3">{children}</span>
                <span className="text-gray-700 font-medium text-sm uppercase">
                  {title}
                </span>
              </div>
            </div>
          </button>
        </Link>
      )}
    </>
  );
}
