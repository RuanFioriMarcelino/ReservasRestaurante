type Props = {
  title: string;
  onClick: () => void;
};

export function Button({ title, onClick, ...rest }: Props) {
  return (
    <>
      <button {...rest} onClick={onClick}>
        <div className=" bg-opacity-20 bg-yellow rounded-lg flex  justify-center">
          <span className="text-yellow font-medium text-sm uppercase h-10 flex items-center">
            {title}
          </span>
        </div>
      </button>
    </>
  );
}
