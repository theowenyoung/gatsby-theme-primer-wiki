import { Label } from "@primer/components";
import React from "react";

const STATUS_COLORS = {
  alpha: "auto.orange.7",
  beta: "auto.yellow.8",
  stable: "auto.green.6",
  deprecated: "auto.red.6",
};

function getStatusColor(status) {
  return STATUS_COLORS[status.toLowerCase()] || "auto.gray.6";
}

function StatusLabel({ status }) {
  return (
    <Label
      outline
      color={getStatusColor(status)}
      borderColor={getStatusColor(status)}
    >
      {status}
    </Label>
  );
}

export default StatusLabel;
