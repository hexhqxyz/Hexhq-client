import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type Props = {
  title: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  subValue: React.ReactNode;
};

const InfoCard = (props: Props) => {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
          {props.icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{props.value}</div>
          <p className="text-xs text-muted-foreground">{props.subValue}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCard;
