"use client";
import { ChartData, ChartOptions } from "chart.js";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Chart } from "primereact/chart";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../../layout/context/layoutcontext";
import type {
  ChartDataState,
  ChartOptionsState,
} from "../../types/types";

export default function Dashboard() {
  const [chartOptions, setChartOptions] = useState<ChartOptionsState>({});
  const [weeks] = useState([
    {
      label: "Last Week",
      value: 0,
      data: [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
      ],
    },
    {
      label: "This Week",
      value: 1,
      data: [
        [35, 19, 40, 61, 16, 55, 30],
        [48, 78, 10, 29, 76, 77, 10],
      ],
    },
  ]);
  const [chartData, setChartData] = useState<ChartDataState>({});
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);
  const dt = useRef<DataTable<any>>(null);
  const knobValue = 90;

  const onWeekChange = (e: DropdownChangeEvent) => {
    let newBarData = { ...chartData.barData };
    (newBarData.datasets as any)[0].data = weeks[e.value].data[0];
    (newBarData.datasets as any)[1].data[1] = weeks[e.value].data[1];
    setSelectedWeek(e.value);
    setChartData((prevState: ChartDataState) => ({
      ...prevState,
      barData: { ...prevState.barData, datasets: newBarData.datasets || [] },
    }));
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor =
      documentStyle.getPropertyValue("--text-color") || "#1e293b";
    const textColorSecondary =
      documentStyle.getPropertyValue("--text-color-secondary") || "#64748b";
    const surfaceBorder =
      documentStyle.getPropertyValue("--surface-border") || "#dfe7ef";
    const pieData: ChartData = {
      labels: ["Electronics", "Fashion", "Household"],
      datasets: [
        {
          data: [300, 50, 100],
          backgroundColor: [
            documentStyle.getPropertyValue("--primary-700") || "#4547a9",
            documentStyle.getPropertyValue("--primary-400") || "#8183f4",
            documentStyle.getPropertyValue("--primary-100") || "#dadafc",
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--primary-600") || "#5457cd",
            documentStyle.getPropertyValue("--primary-300") || "#9ea0f6",
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          ],
        },
      ],
    };

    const pieOptions: ChartOptions = {
      animation: {
        duration: 0,
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: "700",
            },
            padding: 28,
          },
          position: "bottom",
        },
      },
    };

    const barData: ChartData = {
      labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      datasets: [
        {
          label: "Revenue",
          backgroundColor:
            documentStyle.getPropertyValue("--primary-500") || "#6366f1",
          barThickness: 12,
          borderRadius: 12,
          data: weeks[selectedWeek].data[0],
        },
        {
          label: "Profit",
          backgroundColor:
            documentStyle.getPropertyValue("--primary-200") || "#bcbdf9",
          barThickness: 12,
          borderRadius: 12,
          data: weeks[selectedWeek].data[1],
        },
      ],
    };

    const barOptions: ChartOptions = {
      animation: {
        duration: 0,
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: "700",
            },
            padding: 28,
          },
          position: "bottom",
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: "500",
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
    setChartOptions({
      barOptions,
      pieOptions,
    });
    setChartData({
      barData,
      pieData,
    });
    initFilters();
  }, [weeks, selectedWeek, layoutConfig]);
  
  return (
    <div className="grid">
      <div className="col-12 xl:col-9">
        <div className="card h-auto">
          <div className="flex align-items-start justify-content-between mb-6">
            <span className="text-900 text-xl font-semibold">
              Revenue Overview
            </span>
            <Dropdown
              options={weeks}
              value={selectedWeek}
              className="w-10rem"
              optionLabel="label"
              onChange={onWeekChange}
            ></Dropdown>
          </div>
          <Chart
            height="300px"
            type="bar"
            data={chartData.barData}
            options={chartOptions.barOptions}
          ></Chart>
        </div>
      </div>
      <div className="col-12 xl:col-3">
        <div className="card h-auto">
          <div className="text-900 text-xl font-semibold mb-6">
            Sales by Category
          </div>
          <Chart
            height="300px"
            type="pie"
            data={chartData.pieData}
            options={chartOptions.pieOptions}
          ></Chart>
        </div>
      </div>
    </div>
  );
}
