import React from "react";
import { Card } from "react-bootstrap";
import { defaultColors } from "../../constants";
import { data, dataBar } from "./dummyData";

import { IconContext } from "react-icons";
import { BsFillFileBarGraphFill } from "react-icons/bs";

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

Chart.register(CategoryScale);

export default function MonthAtAGlance() {
  return (
    <div
      className="monthAtAGlance"
      style={{ display: "flex", gridColumnStart: 1, gridRowStart: 1 }}
    >
      <Card style={{ width: "100%" }}>
        <Card.Header
          as="h5"
          style={{
            backgroundColor: defaultColors.BREAKTIME_BLUE,
            color: "white",
            display: "flex",
            gap: "1%",
            alignItems: "center",
          }}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <BsFillFileBarGraphFill />
          </IconContext.Provider>
          Month at a Glance
        </Card.Header>
        <Card.Body
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div style={{ width: "1fr" }}>
            <Pie data={data} />
          </div>
          <div style={{ width: "1fr" }}>
            <Bar data={dataBar} />
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
