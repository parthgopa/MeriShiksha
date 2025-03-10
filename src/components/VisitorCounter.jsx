import React, { useEffect, useState } from "react";

function VisitorCount() {
  const [count, setCount] = useState(1005);

  useEffect(() => {
    fetch("http://localhost:3000/visitorCount.json")
      .then((response) => response.json())
      .then((data) => setCount(data.count))
      .catch((error) => console.error("Error fetching visitor count:", error));
  }, []);

  return (
    <div>
      <h5>Visitor Count: {count}</h5>
    </div>
  );
}

export default VisitorCount;
