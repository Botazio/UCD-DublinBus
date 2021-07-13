import WaitingCSS from "./Waiting.module.css";

// This is component while the user is waiting for a fetch call
const Waiting = ({ variant, size }) => {

  return (
    <div className={WaitingCSS.wrapper}>
      <div
        className={WaitingCSS.lds_dual_ring + " " + WaitingCSS[variant] + " " + WaitingCSS[size]}>
      </div>
    </div>
  );
};

export default Waiting;
