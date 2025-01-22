import type { GetProp, TableProps } from "antd";
import { Table } from "antd";

type SizeType = TableProps["size"];
type ColumnsType<T extends object> = GetProp<TableProps<T>, "columns">;
type TablePagination<T extends object> = NonNullable<
  Exclude<TableProps<T>["pagination"], boolean>
>;
type TablePaginationPosition = NonNullable<
  TablePagination<any>["position"]
>[number];
type ExpandableConfig<T extends object> = TableProps<T>["expandable"];
type TableRowSelection<T extends object> = TableProps<T>["rowSelection"];

interface TableDefaultProps {
  bordered?: boolean;
  loading?: boolean;
  size?: SizeType;
  expandable?: ExpandableConfig<any>;
  showTitle?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  rowSelection?: TableRowSelection<any>;
  hasData?: boolean;
  tableLayout?: "auto" | "fixed";
  top?: TablePaginationPosition;
  bottom?: TablePaginationPosition;
  ellipsis?: boolean;
  yScroll?: boolean;
  xScroll?: "scroll" | "fixed";
  columns: ColumnsType<any>;
  data: any;
  footerText?: string;
  titleText?: string;
  rowKey?: string;
}

const TableDefault = ({
  bordered = false,
  loading = false,
  size = "large",
  expandable = undefined,
  showTitle = false,
  showHeader = true,
  showFooter = false,
  footerText = "",
  titleText = "",
  rowSelection = undefined,
  hasData = true,
  tableLayout,
  top = "none",
  bottom = "bottomRight",
  ellipsis = false,
  yScroll = false,
  xScroll = undefined,
  columns = [],
  data,
  rowKey = undefined,
}: TableDefaultProps) => {
  const scroll: { x?: number | string; y?: number | string } = {};
  if (yScroll) {
    scroll.y = 240;
  }
  if (xScroll) {
    scroll.x = "100vw";
  }
  const defaultFooter = () => footerText;
  const defaultTitle = () => titleText;

  const tableColumns = columns.map((item) => ({ ...item, ellipsis }));
  if (xScroll === "fixed") {
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = "right";
  }

  const tableProps: TableProps<any> = {
    bordered,
    loading,
    size,
    expandable,
    title: showTitle ? defaultTitle : undefined,
    showHeader,
    footer: showFooter ? defaultFooter : undefined,
    rowSelection,
    scroll,
    tableLayout,
  };
  return (
    <>
      <Table
        {...tableProps}
        pagination={{ position: [top, bottom], pageSize: 5 }}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        scroll={scroll}
        {...(rowKey ? { rowKey } : {})}
      />
    </>
  );
};

export default TableDefault;
