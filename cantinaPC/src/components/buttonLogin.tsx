type Props = {
  title: string;
  onClick: () => void;
};

export function Button({ title, onClick, ...rest }: Props) {
  return (
    <>
      <button {...rest} onClick={onClick}>
        <div className="bg-yellow/70 rounded-lg flex  justify-center">
          <span className="text-white font-medium text-sm uppercase h-10 flex items-center">
            {title}
          </span>
        </div>
      </button>
    </>
  );
}
