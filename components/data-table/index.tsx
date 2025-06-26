import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { KeyMap } from "@/types/key-map.type";
import { RenderMap } from "@/types/render-map.type";
import MinObject from "@/types/min-object.type";
import Action from "@/types/action.type";
import Loader from "../loader";

// type Action<T extends MinObject> = {
//   label?: string
//   icon?: React.ReactNode
//   color?: ButtonProps['color']
//   variant?: ButtonProps['variant']
//   onClick: (item: T) => void
// }

interface DataTableProps<T extends MinObject> {
  data?: T[];
  keyMap?: KeyMap<T>;
  renderMap?: RenderMap<T>;
  actions?: Action<T>[];
  loading?: boolean;
}

export default function DataTable<T extends MinObject>({
  data = [],
  keyMap,
  renderMap,
  actions,
  loading = false,
}: DataTableProps<T>) {
  const renderedKeyMap = useMemo(() => {
    if (keyMap) return keyMap;

    return Object.keys(data[0] ?? {}).reduce((acc, key) => {
      const k = key as keyof T;
      acc[k] = key;
      return acc;
    }, {} as KeyMap<T>);
  }, [keyMap, data]);

  // Helper function to safely render cell values
  const renderCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return "-";
    }

    if (typeof value === "object") {
      // Handle objects, arrays, etc.
      if (React.isValidElement(value)) {
        return value;
      }
      // Convert objects to string representation
      return JSON.stringify(value);
    }

    // Handle primitives (string, number, boolean)
    return String(value);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Object.entries(renderedKeyMap).map(([key, value]) => (
            <TableHead key={key}>{value}</TableHead>
          ))}
          {actions && (
            <TableHead className="flex justify-center items-center">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={Object.keys(renderedKeyMap).length + (actions ? 1 : 0)}
              className="py-8 text-muted-foreground"
            >
              <div className="flex w-full items-center justify-center gap-2">
                <div className="w-4 h-4">
                  <Loader />
                </div>
                Loading data...
              </div>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={Object.keys(renderedKeyMap).length + (actions ? 1 : 0)}
              className="text-center py-8 text-muted-foreground"
            >
              No data available
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <TableRow key={index}>
              {Object.entries(renderedKeyMap).map(([key, value]) => {
                const cellValue = item[key as keyof T];
                const renderFn = renderMap?.[key as keyof RenderMap<T>];

                return (
                  <TableCell key={key} className="align-middle">
                    {renderFn
                      ? renderFn(cellValue, item)
                      : renderCellValue(cellValue)}
                  </TableCell>
                );
              })}
              {actions && (
                <TableCell className="align-middle">
                  <div className="flex items-center justify-center gap-2">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={action.label || actionIndex}
                        variant={action.variant || "ghost"}
                        color={action.color || "default"}
                        onClick={() => action.onClick(item)}
                        size={"none"}
                        className="flex items-center gap-1"
                      >
                        {action.icon && <span>{action.icon}</span>}
                        {action.label && action.label}
                      </Button>
                    ))}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
