const SpinnerSVG = () => (
  <svg
    width="24"
    height="24"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className="origin-center animate-[spinner-rotate-anim_2s_linear_infinite]">
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="animate-[spinner-stroke-anim_1.5s_ease-in-out_infinite]"
      ></circle>
    </g>
  </svg>
);

export default SpinnerSVG;
