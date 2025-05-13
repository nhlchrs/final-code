import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Chart as ChartJSInstance,
} from 'chart.js';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

interface FileRow {
  [key: string]: string | number;
}

interface FileResponse {
  file: {
    contents: FileRow[];
  };
}

const Filepreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<FileRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');
  const [chartType, setChartType] = useState<'Bar' | 'Line' | 'Pie'>('Bar');

  const chartRef = useRef<ChartJSOrUndefined<any>>(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post<FileResponse>(
        `${process.env.REACT_APP_BASE_URL}/api/upload/files`,
        { fileId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const previewRows = response.data?.file?.contents?.slice(0, 20);
      setData(previewRows);
      if (previewRows?.length > 0) {
        setColumns(Object.keys(previewRows[0]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const downloadCSV = (rows: FileRow[]) => {
  //   if (!rows.length) return;

  //   const headers = Object.keys(rows[0]);
  //   const csvContent = [
  //     headers.join(','), // header row
  //     ...rows.map(row =>
  //       headers.map(field => `"${String(row[field]).replace(/"/g, '""')}"`).join(',')
  //     ),
  //   ].join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'transformed_data.csv');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart.png';
      link.click();
    }
  };

  const chartData = (() => {
    const labels = data.map((row) => String(row[selectedX]));
    const values = data.map((row) => parseFloat(String(row[selectedY])));

    const generateColors = (count: number) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
      return colors;
    };

    const backgroundColors =
      chartType === 'Pie' ? generateColors(labels.length) : ['rgba(54, 162, 235, 0.6)'];
    const borderColors =
      chartType === 'Pie' ? generateColors(labels.length) : ['rgba(54, 162, 235, 1)'];

    return {
      labels,
      datasets: [
        {
          label: `${selectedY} - ${selectedX}`,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
        },
      ],
    };
  })();

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', maxWidth: '1100px', margin: 'auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        ⬅ Back
      </button>

      {data?.length > 0 ? (
        <>
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>
              <label style={{ fontWeight: '600' }}> X-Axis:</label><br />
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '6px', minWidth: '160px' }}
              >
                <option value="">Select column</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600' }}> Y-Axis:</label><br />
              <select
                value={selectedY}
                onChange={(e) => setSelectedY(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '6px', minWidth: '160px' }}
              >
                <option value="">Select column</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600' }}> Chart Type:</label><br />
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'Bar' | 'Line' | 'Pie')}
                style={{ padding: '0.5rem', borderRadius: '6px', minWidth: '140px' }}
              >
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
                <option value="Pie">Pie</option>
              </select>
            </div>

            {/* <button
              onClick={() => downloadCSV(data)}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ⬇ Download CSV
            </button> */}
          </div>

          {selectedX && selectedY ? (
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '1rem',
                background: '#fafafa',
                maxWidth: '850px',
                margin: 'auto',
              }}
            >
              {chartType === 'Bar' && <Bar ref={chartRef} data={chartData} />}
              {chartType === 'Line' && <Line ref={chartRef} data={chartData} />}
              {chartType === 'Pie' && <Pie ref={chartRef} data={chartData} />}
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={downloadChart}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  ⬇ Download Chart
                </button>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#777', marginTop: '2rem' }}>
              Please select X and Y axes to view the chart.
            </p>
          )}

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>📄 Data Preview (Top 20 Rows)</h3>
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #ccc' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col}
                        style={{
                          border: '1px solid #ddd',
                          padding: '0.75rem',
                          backgroundColor: '#f2f2f2',
                          fontWeight: '600',
                          textAlign: 'left',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                      {columns.map((col) => (
                        <td key={col} style={{ border: '1px solid #eee', padding: '0.65rem' }}>
                          {String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '1.1rem' }}>⏳ Loading data...</p>
      )}
    </div>
  );
};

export default Filepreview;
