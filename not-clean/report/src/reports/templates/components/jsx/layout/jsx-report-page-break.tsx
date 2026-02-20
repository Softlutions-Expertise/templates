type Props = {
  before?: boolean;
  after?: boolean;
  inside?: boolean;

  children?: any;
};

export const JsxReportPageBreak = (props: Props) => {
  return (
    <div
      style={{
        pageBreakBefore: props.before ? "always" : "auto",
        pageBreakAfter: props.after ? "always" : "auto",
        pageBreakInside: props.inside ? "auto" : "avoid",
      }}
    >
      {props.children}
    </div>
  );
};
