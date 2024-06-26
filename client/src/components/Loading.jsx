function Loading() {
  return (
    <div className="d-flex align-items-center text-light">
      <strong role="status">Loading...</strong>
      <div
        className="spinner-border ms-auto"
        aria-hidden="true"
        data-testid="spinner"
      ></div>
    </div>
  );
}

export default Loading;
