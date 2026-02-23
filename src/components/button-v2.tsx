import { useEffect, useState } from "react";

export default function Button(props:any) {
  const [active, setActive] = useState(
    props.on ? true : props.off ? false : false
  );

  useEffect(()=>{
    props.clearStatus && setActive(false) 
  },[props.clearStatus])

  const toggle_color = () => {
    if (!props.has_state) return;
    setActive(!active);
  };
  const on_click = (e:any) => {
    if (props.onClick) props.onClick(e);
    toggle_color();
  };

  return (
    <>
      {props.circle ? (
        <>
          <div className="button_wrapper">
            <div className="pad"></div>
            <button
              onClick={on_click}
              className={`font_button_label circle ${props.color} on ${
                props.xs
                  ? "xs"
                  : props.small
                  ? "small"
                  : props.middle
                  ? "middle"
                  : props.small2
                  ? "small2"
                  : "normal"
              }`}
            >
            </button>
            <div className="pad"></div>
          </div>
        </>
      ) : (
        <div className="button_wrapper">
          <div className="pad"></div>
          <button
            onClick={on_click}
            className={`font_button_label ${props.color} ${
              active ? "on" : "off"
            } ${
              props.xs
                ? "xs"
                : props.small
                ? "small"
                : props.middle
                ? "middle"
                : props.small2
                ? "small2"
                : "normal"
            }`}
          >
            <span className="button-label">
              <div className="icon-label-wrapper" style={{ display: "flex" }}>
                 {props.label}
              </div>
            </span>
          </button>
          <div className="pad"></div>
        </div>
      )}
    </>
  );
}
