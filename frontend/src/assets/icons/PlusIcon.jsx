const PlusIcon = ({iconColor,width,height}) => {
    return (
      <svg
        width={width ?? "25"}
        height={height ?? "25"}
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12.5H12M12 12.5H20M12 12.5V20.5M12 12.5V4.5"
          stroke={iconColor ?? "#57585C"}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };
  
  export default PlusIcon;
  