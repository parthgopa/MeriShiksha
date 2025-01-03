const Danger = () => {
  return (
    <footer
      style={{
        marginTop: "5vh",
        // position: "relative",
        marginBottom: "0vh",
        bottom: "0px",
        position: "fixed",
        left: "0px",
        right: "0px",
        width: "100%",
        textAlign: "center",
        backgroundColor: "rgba(0, 7, 7, 1)",
      }}
    >
      <hr style={{ margin: 0, opacity: 1 }} />
      <p
        style={{
          color: "rgb(158, 243, 178)",
          zIndex: "5",
          fontSize: "14px",
          fontWeight: "300",
          margin: "0",
        }}
      >
        Dedicated to Meghmani Parivar Diamond Boys' Hostel.
      </p>
      <p
        style={{
          color: "rgb(158, 243, 178)",
          fontSize: "12px",
          fontWeight: "300",
          margin: "0",
        }}
      >
        Parth GPT can make mistakes, so double-check it.
      </p>
    </footer>
  );
};
export default Danger;
