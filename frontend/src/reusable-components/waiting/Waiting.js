import WaitingCSS from "./Waiting.module.css";

// This reusable component is meant to be used while the user is waiting for an async operation
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
