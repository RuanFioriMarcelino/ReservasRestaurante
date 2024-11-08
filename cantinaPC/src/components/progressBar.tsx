const ProgressBar = (props: any) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
  };

  const labelStyles = {
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles} className="ml-2">
          {" "}
          {`  ${completed}%`}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
