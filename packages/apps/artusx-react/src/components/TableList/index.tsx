import React, { useState } from 'react';
import { Table, Column } from 'react-virtualized';
import { useThrottleFn } from 'ahooks';
import 'react-virtualized/styles.css';
import './index.css';

interface TableListProps {
  columns: string[];
  data: any[];
}

const TableList: React.FC<TableListProps> = ({ columns, data }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const { run: setScrollTopDebounce } = useThrottleFn(
    (value) => {
      setScrollTop(value);
    },
    { wait: 100 }
  );

  const onScroll = (params: { scrollTop: number }) => {
    setScrollTopDebounce(params.scrollTop);

    const shouldShowFilter = params.scrollTop - scrollTop <= 0;
    setShowFilter(shouldShowFilter);
  };

  return (
    <>
      <div className={showFilter ? 'filter show' : 'filter hiden'}>filter</div>

      <Table
        width={800}
        height={600}
        headerHeight={20}
        rowHeight={30}
        rowCount={data.length}
        rowGetter={({ index }) => data[index]}
        onScroll={onScroll}
      >
        {columns.map((column) => (
          <Column label={column} dataKey={column} width={200} />
        ))}
      </Table>
    </>
  );
};

export default TableList;
