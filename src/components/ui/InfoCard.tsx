import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

type Props = {
  title: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  subValue: React.ReactNode;
  loading?: boolean;
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
          {props.loading ? (
            <>
              <Skeleton className="h-4 w-[200px] my-1" />
            </>
          ) : (
            <>
              <div className="text-xl font-bold">{props.value}</div>
            </>
          )}
          <p className="text-xs text-muted-foreground">{props.subValue}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCard;
