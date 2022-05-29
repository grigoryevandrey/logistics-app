import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { nanoid } from 'nanoid';
import React, { Component } from 'react';
import { ObjectLiteral } from '../../types';

const rowsPerPageOptions = [2, 5, 10, 25, 50];

type HeaderElement = {
  label: string;
  key: string;
  isSortable?: boolean;
  ascSortString?: string;
  descSortString?: string;
};

interface RepresentationalTableProps {
  headerCells: HeaderElement[];
  rows: ObjectLiteral[];
  offset: number;
  limit: number;
  sort: string;
  page: number;
  totalElements: number;
  filter?: string;
  setOffset: Function;
  setLimit: Function;
  setSort: Function;
  setFilter?: Function;
  fetchTableData: Function;
  onClick: Function;
}

export class RepresentationalTable extends Component<RepresentationalTableProps> {
  constructor(props: RepresentationalTableProps) {
    super(props);
  }

  private async changePage(_event: any, page: number): Promise<void> {
    const newOffset = this.props.limit * page;
    await this.props.setOffset(newOffset);
    await this.props.fetchTableData();
  }

  private async changeRowsPerPage(event: any): Promise<void> {
    await this.props.setLimit(event.target.value);
    await this.props.fetchTableData();
  }

  private async changeSort(asc?: string, desc?: string): Promise<void> {
    const newSort = this.props.sort === asc ? desc : asc;
    await this.props.setSort(newSort);
    await this.props.fetchTableData();
  }

  public override render() {
    return (
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {this.props.headerCells.map((header, index) => {
                  const align = index === 0 ? 'left' : 'right';
                  const active = header.ascSortString === this.props.sort || header.descSortString === this.props.sort;

                  return header.isSortable ? (
                    <TableCell align={align} key={header.key}>
                      <TableSortLabel
                        active={active}
                        direction={this.props.sort === header.descSortString ? 'desc' : 'asc'}
                        onClick={() => this.changeSort(header.ascSortString, header.descSortString)}
                      >
                        {header.label}
                      </TableSortLabel>
                    </TableCell>
                  ) : (
                    <TableCell align={align} key={header.key}>
                      {header.label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.rows.map((row) => {
                return (
                  <TableRow
                    hover
                    key={typeof row.id === 'string' || typeof row.id === 'number' ? row.id : nanoid()}
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={() => this.props.onClick(row.id)}
                  >
                    {this.props.headerCells.map((header, index) => {
                      return index === 0 ? (
                        <TableCell component="th" scope="row" key={`${row.id}_${header.key}`}>
                          {`${row[header.key]}`}
                        </TableCell>
                      ) : (
                        <TableCell align="right" key={`${row.id}_${header.key}`}>{`${row[header.key]}`}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          labelRowsPerPage="Элементов на странице:"
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} из ${count !== -1 ? count : `больше чем ${to}`}`;
          }}
          component="div"
          count={this.props.totalElements}
          rowsPerPage={this.props.limit}
          page={this.props.page}
          onPageChange={this.changePage.bind(this)}
          onRowsPerPageChange={this.changeRowsPerPage.bind(this)}
        />
      </Paper>
    );
  }
}
